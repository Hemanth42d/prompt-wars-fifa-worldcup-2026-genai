import logger from '../utils/logger.js';
import AnalyticsAgent from './analyticsAgent.js';

class NavigationAgent {
  constructor() {
    this.analyticsAgent = new AnalyticsAgent();
    this.stadiumGraph = this.loadStadiumGraph();
  }

  loadStadiumGraph() {
    return {
      entrances: ['North Gate', 'South Gate', 'East Gate', 'West Gate'],
      sections: {
        '100': { floor: 1, accessible: true },
        '200': { floor: 2, accessible: true },
        '300': { floor: 3, accessible: false }
      },
      services: {
        restroom: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        medical: ['Med-1', 'Med-2', 'Med-3'],
        food: ['Food-A', 'Food-B', 'Food-C', 'Food-D'],
        merchandise: ['Shop-1', 'Shop-2']
      }
    };
  }

  async process(message, context, userProfile, intent) {
    try {
      const currentLocation = this.parseLocation(context.location || {});
      const destination = this.extractDestination(message, intent);
      const needsAccessibility = userProfile.accessibility?.wheelchair || false;

      const route = await this.calculateRoute(
        currentLocation,
        destination,
        needsAccessibility,
        context
      );

      const responseText = this.formatNavigationResponse(
        route,
        currentLocation,
        destination,
        needsAccessibility
      );

      return {
        message: responseText,
        route,
        currentLocation,
        destination,
        agent: 'navigation'
      };
    } catch (error) {
      logger.error('Navigation error:', error);
      return {
        message: "I'm having trouble calculating that route. Can you provide more details about your destination?",
        error: true,
        agent: 'navigation'
      };
    }
  }

  parseLocation(locationData) {
    return {
      section: locationData.section || 'Unknown',
      row: locationData.row || '',
      seat: locationData.seat || '',
      floor: locationData.floor || 1,
      coordinates: {
        lat: locationData.lat || 0,
        lon: locationData.lon || 0
      }
    };
  }

  extractDestination(message, intent) {
    const entities = intent.entities || {};
    if (entities.destination) return entities.destination;

    const keywords = {
      'seat': 'seat',
      'restroom': 'restroom',
      'bathroom': 'restroom',
      'toilet': 'restroom',
      'food': 'food',
      'restaurant': 'food',
      'shop': 'merchandise',
      'store': 'merchandise',
      'medical': 'medical',
      'first aid': 'medical',
      'exit': 'exit'
    };

    const messageLower = message.toLowerCase();
    for (const [keyword, type] of Object.entries(keywords)) {
      if (messageLower.includes(keyword)) return type;
    }

    return 'information_desk';
  }

  async calculateRoute(current, destination, needsAccessibility, context) {
    const crowdLevel = await this.analyticsAgent.getCrowdLevel(destination);
    const steps = this.generateRouteSteps(current, destination, needsAccessibility, crowdLevel);
    
    const distance = steps.length * 20; // meters
    const duration = Math.round(distance / 1.2); // walking speed ~1.2 m/s

    return {
      steps,
      distance,
      duration,
      accessibilityFriendly: needsAccessibility,
      crowdLevel
    };
  }

  generateRouteSteps(current, destination, needsAccessibility, crowdLevel) {
    const steps = [];

    steps.push(`Starting from Section ${current.section}`);

    if (needsAccessibility) {
      steps.push('♿ Following wheelchair-accessible route');
      steps.push('Head to the elevator on your right');
    } else {
      steps.push('Head straight down the main corridor');
    }

    if (crowdLevel === 'high') {
      steps.push('⚠️ High crowd density ahead - allow extra time');
    }

    if (destination === 'restroom') {
      steps.push('Turn left at Concourse A');
      steps.push('Restroom will be 30 meters on your right');
      if (needsAccessibility) steps.push('Accessible stall available');
    } else if (destination === 'food') {
      steps.push('Continue to Concourse B');
      steps.push('Food court on your left');
      steps.push('Wait time: ~5 minutes');
    } else if (destination === 'medical') {
      steps.push('Turn right immediately');
      steps.push('Medical station 50 meters ahead');
      steps.push('Staff available 24/7');
    } else {
      steps.push(`Navigate to ${destination}`);
      steps.push('Follow signs overhead');
    }

    steps.push('You will arrive in approximately 2-3 minutes');

    return steps;
  }

  formatNavigationResponse(route, current, destination, needsAccessibility) {
    let response = `📍 Navigation to ${destination.toUpperCase()}\n\n`;

    if (needsAccessibility) {
      response += '♿ Accessible Route\n\n';
    }

    response += `Distance: ${route.distance}m\n`;
    response += `Time: ${Math.floor(route.duration / 60)}min ${route.duration % 60}s\n`;
    response += `Crowd: ${route.crowdLevel.toUpperCase()}\n\n`;

    response += 'Directions:\n';
    route.steps.forEach((step, i) => {
      response += `${i + 1}. ${step}\n`;
    });

    return response;
  }
}

export default NavigationAgent;
