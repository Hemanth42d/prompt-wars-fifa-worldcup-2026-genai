import OpenAI from 'openai';
import logger from '../utils/logger.js';
import NavigationAgent from './navigationAgent.js';
import LanguageAgent from './languageAgent.js';
import AnalyticsAgent from './analyticsAgent.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class GenAIOrchestrator {
  constructor() {
    this.navigationAgent = new NavigationAgent();
    this.languageAgent = new LanguageAgent();
    this.analyticsAgent = new AnalyticsAgent();
  }

  async processRequest(message, context = {}, userProfile = {}) {
    const startTime = Date.now();

    try {
      // Detect language
      const detectedLanguage = await this.languageAgent.detectLanguage(message);
      logger.info(`Detected language: ${detectedLanguage}`);

      // Translate to English if needed
      let englishMessage = message;
      if (detectedLanguage !== 'en') {
        englishMessage = await this.languageAgent.translate(
          message,
          detectedLanguage,
          'en'
        );
      }

      // Detect intent
      const intent = await this.detectIntent(englishMessage, context);
      logger.info(`Intent detected: ${intent.type} (confidence: ${intent.confidence})`);

      // Route to appropriate agent
      let response = await this.routeToAgent(intent, englishMessage, context, userProfile);

      // Translate response back if needed
      if (detectedLanguage !== 'en' && response.message) {
        response.message = await this.languageAgent.translate(
          response.message,
          'en',
          detectedLanguage
        );
      }

      // Add metadata
      const processingTime = Date.now() - startTime;
      response.metadata = {
        intent: intent.type,
        language: detectedLanguage,
        confidence: intent.confidence,
        agent: response.agent || 'unknown',
        processingTime
      };

      return response;
    } catch (error) {
      logger.error('GenAI Orchestrator error:', error);
      return {
        message: 'I apologize, but I encountered an error. Please try again.',
        error: true,
        metadata: { error: error.message }
      };
    }
  }

  async detectIntent(message, context) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.DEFAULT_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an intent classifier for a FIFA World Cup stadium assistant.
Classify the user's intent into one of these categories:
- navigation: Finding locations, directions, seats
- information: General questions about the event, stadium, services
- emergency: Medical, security, urgent assistance
- accessibility: Special needs, wheelchair access, assistance
- services: Food, merchandise, restrooms
- social: Finding friends, group coordination

Respond ONLY with valid JSON in this exact format:
{"type": "intent_type", "confidence": 0.95, "entities": {}}`
          },
          {
            role: 'user',
            content: `Context: ${JSON.stringify(context)}\n\nMessage: ${message}`
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      });

      const result = completion.choices[0].message.content;
      return JSON.parse(result);
    } catch (error) {
      logger.error('Intent detection error:', error);
      return { type: 'information', confidence: 0.5, entities: {} };
    }
  }

  async routeToAgent(intent, message, context, userProfile) {
    const intentType = intent.type;

    if (intentType === 'navigation' || intentType === 'accessibility') {
      return await this.navigationAgent.process(message, context, userProfile, intent);
    } else if (intentType === 'emergency') {
      return await this.handleEmergency(message, context, userProfile);
    } else {
      return await this.handleGeneralQuery(message, context, userProfile);
    }
  }

  async handleEmergency(message, context, userProfile) {
    logger.warn(`EMERGENCY REQUEST: ${message}`);

    const location = context.location || {};
    const emergencyInfo = {
      nearestMedical: 'Medical Station 2A - 50 meters north',
      nearestSecurity: 'Security Point B3 - 30 meters east',
      emergencyNumber: '911',
      stadiumHelp: '+1-555-HELP'
    };

    const responseText = `🚨 EMERGENCY ASSISTANCE

Your location: ${location.section || 'Unknown'}

Nearest Medical: ${emergencyInfo.nearestMedical}
Nearest Security: ${emergencyInfo.nearestSecurity}

Emergency services have been alerted.
Help is on the way.

Emergency: ${emergencyInfo.emergencyNumber}
Stadium Help: ${emergencyInfo.stadiumHelp}

Stay calm. Help is coming.`;

    return {
      message: responseText,
      priority: 'high',
      emergency: true,
      emergencyInfo,
      agent: 'emergency'
    };
  }

  async handleGeneralQuery(message, context, userProfile) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.DEFAULT_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a helpful FIFA World Cup 2026 stadium assistant.
You help fans with information about the event, stadium, and services.

Context:
- Stadium: ${context.stadium || 'Unknown'}
- Event: ${context.event || 'FIFA World Cup 2026'}
- Section: ${context.location?.section || 'Unknown'}
- Language: ${userProfile.preferredLanguage || 'en'}

User preferences: ${JSON.stringify(userProfile.accessibility || {})}

Provide clear, concise, and friendly responses (max 150 words).
Always prioritize user safety and accessibility.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: Number(process.env.TEMPERATURE) || 0.7,
        max_tokens: Number(process.env.MAX_TOKENS) || 500
      });

      const answer = completion.choices[0].message.content;

      return {
        message: answer,
        priority: 'normal',
        agent: 'general'
      };
    } catch (error) {
      logger.error('General query error:', error);
      return {
        message: 'I apologize, but I am having trouble processing your request. Please try rephrasing your question.',
        error: true,
        agent: 'general'
      };
    }
  }
}

export default GenAIOrchestrator;
