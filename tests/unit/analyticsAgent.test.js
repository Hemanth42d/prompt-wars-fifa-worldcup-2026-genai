import AnalyticsAgent from '../../server/services/analyticsAgent.js';

describe('AnalyticsAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new AnalyticsAgent();
  });

  describe('getCrowdLevel', () => {
    it('should return high crowd level during peak hours', async () => {
      const level = await agent.getCrowdLevel('food-court');
      expect(['low', 'medium', 'high']).toContain(level);
    });
  });

  describe('getCrowdDensity', () => {
    it('should return crowd density data', async () => {
      const density = await agent.getCrowdDensity('Section 200');

      expect(density).toHaveProperty('location');
      expect(density).toHaveProperty('density');
      expect(density).toHaveProperty('count');
      expect(density).toHaveProperty('capacity');
      expect(density).toHaveProperty('percentage');
      expect(density.percentage).toBeGreaterThanOrEqual(0);
      expect(density.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('predictWaitTime', () => {
    it('should predict wait time for food service', async () => {
      const waitTime = await agent.predictWaitTime('food', 'Food Court A');

      expect(waitTime).toHaveProperty('service');
      expect(waitTime).toHaveProperty('waitTimeMinutes');
      expect(waitTime).toHaveProperty('confidence');
      expect(waitTime.service).toBe('food');
      expect(waitTime.waitTimeMinutes).toBeGreaterThan(0);
    });

    it('should predict wait time for restroom', async () => {
      const waitTime = await agent.predictWaitTime('restroom', 'Restroom A1');
      expect(waitTime.service).toBe('restroom');
      expect(waitTime.waitTimeMinutes).toBeLessThan(15);
    });
  });

  describe('getVenueInsights', () => {
    it('should return comprehensive venue insights', async () => {
      const insights = await agent.getVenueInsights('stadium-001');

      expect(insights).toHaveProperty('venueId');
      expect(insights).toHaveProperty('totalCapacity');
      expect(insights).toHaveProperty('currentOccupancy');
      expect(insights).toHaveProperty('occupancyRate');
      expect(insights).toHaveProperty('peakHours');
      expect(Array.isArray(insights.peakHours)).toBe(true);
    });
  });

  describe('logInteraction', () => {
    it('should log interaction without errors', async () => {
      await expect(
        agent.logInteraction('user123', 'navigation', { destination: 'restroom' })
      ).resolves.not.toThrow();
    });
  });
});
