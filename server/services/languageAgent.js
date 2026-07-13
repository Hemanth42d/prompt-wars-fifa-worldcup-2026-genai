import axios from 'axios';
import logger from '../utils/logger.js';

class LanguageAgent {
  constructor() {
    this.supportedLanguages = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      pt: 'Portuguese',
      ar: 'Arabic',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
      ru: 'Russian',
      it: 'Italian',
      nl: 'Dutch',
      pl: 'Polish',
      tr: 'Turkish',
      hi: 'Hindi',
      bn: 'Bengali',
      vi: 'Vietnamese',
      th: 'Thai',
      id: 'Indonesian',
      sw: 'Swahili'
    };
  }

  async detectLanguage(text) {
    try {
      // Simple language detection based on character patterns
      if (/[\u4e00-\u9fa5]/.test(text)) return 'zh'; // Chinese
      if (/[\u0600-\u06FF]/.test(text)) return 'ar'; // Arabic
      if (/[\u0400-\u04FF]/.test(text)) return 'ru'; // Russian
      if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'; // Japanese
      if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'; // Korean
      if (/[\u0E00-\u0E7F]/.test(text)) return 'th'; // Thai

      // Use Google Translate API for other languages
      if (process.env.GOOGLE_TRANSLATE_API_KEY) {
        const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
          { q: text }
        );
        return response.data.data.detections[0][0].language;
      }

      // Default to English if detection fails
      return 'en';
    } catch (error) {
      logger.error('Language detection error:', error);
      return 'en';
    }
  }

  async translate(text, sourceLang, targetLang) {
    if (sourceLang === targetLang) return text;

    try {
      if (process.env.GOOGLE_TRANSLATE_API_KEY) {
        const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
          {
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
          }
        );
        return response.data.data.translations[0].translatedText;
      }

      // Fallback: Return original text
      logger.warn('Translation API not configured, returning original text');
      return text;
    } catch (error) {
      logger.error('Translation error:', error);
      return text;
    }
  }

  getLanguageName(code) {
    return this.supportedLanguages[code] || code.toUpperCase();
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }
}

export default LanguageAgent;
