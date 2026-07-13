import NavigationAgent from '../../server/services/navigationAgent.js';

describe('NavigationAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new NavigationAgent();
  });

  describe('parseLocation', () => {
    it('should parse location data correctly', () => {
      const location = agent.parseLocation({
        section: '204',
        row: 'A',
        seat: '15',
        floor: 2
      });

      expect(location.section).toBe('204');
      expect(location.row).toBe('A');
      expect(location.floor).toBe(2);
    });

    it('should handle missing location data', () => {
      const location = agent.parseLocation({});
      expect(location.section).toBe('Unknown');
      expect(location.floor).toBe(1);
    });
  });

  describe('extractDestination', () => {
    it('should extract restroom destination', () => {
      const dest = agent.extractDestination('Where is the restroom?', {});
      expect(dest).toBe('restroom');
    });

    it('should extract food destination', () => {
      const dest = agent.extractDestination('Find food court', {});
      expect(dest).toBe('food');
    });

    it('should extract medical destination', () => {
      const dest = agent.extractDestination('I need medical help', {});
      expect(dest).toBe('medical');
    });
  });

  describe('calculateRoute', () => {
    it('should calculate route with accessibility', async () => {
      const current = { section: '100', floor: 1, coordinates: { lat: 0, lon: 0 } };
      const route = await agent.calculateRoute(current, 'restroom', true, {});

      expect(route).toHaveProperty('steps');
      expect(route).toHaveProperty('distance');
      expect(route).toHaveProperty('duration');
      expect(route.accessibilityFriendly).toBe(true);
      expect(Array.isArray(route.steps)).toBe(true);
    });

    it('should include wheelchair accessibility in route', async () => {
      const current = { section: '200', floor: 2, coordinates: { lat: 0, lon: 0 } };
      const route = await agent.calculateRoute(current, 'food', true, {});

      const hasAccessibilityStep = route.steps.some(step => 
        step.toLowerCase().includes('wheelchair') || step.includes('♿')
      );
      expect(hasAccessibilityStep).toBe(true);
    });
  });

  describe('formatNavigationResponse', () => {
    it('should format response with route details', () => {
      const route = {
        steps: ['Step 1', 'Step 2'],
        distance: 100,
        duration: 120,
        crowdLevel: 'medium',
        accessibilityFriendly: false
      };

      const response = agent.formatNavigationResponse(
        route,
        { section: '100' },
        'restroom',
        false
      );

      expect(response).toContain('RESTROOM');
      expect(response).toContain('100m');
      expect(response).toContain('2min');
      expect(response).toContain('MEDIUM');
    });
  });
});
