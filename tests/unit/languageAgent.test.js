import LanguageAgent from '../../server/services/languageAgent.js';

describe('LanguageAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new LanguageAgent();
  });

  test('should detect English language', async () => {
    const result = await agent.detectLanguage('Hello, how are you?');
    expect(result).toBe('en');
  });

  test('should detect Chinese language', async () => {
    const result = await agent.detectLanguage('你好吗');
    expect(result).toBe('zh');
  });

  test('should return language name', () => {
    const result = agent.getLanguageName('en');
    expect(result).toBe('English');
  });

  test('should get supported languages', () => {
    const langs = agent.getSupportedLanguages();
    expect(langs).toHaveProperty('en');
    expect(langs).toHaveProperty('es');
  });
});
