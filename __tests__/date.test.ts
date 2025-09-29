import { formatDate, getToday } from '@/utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD string', () => {
      const date = new Date('2024-05-02T15:30:00.000Z');
      const result = formatDate(date);
      expect(result).toBe('2024-05-02');
    });

    it('should handle different time zones consistently', () => {
      const date = new Date('2024-12-25T23:59:59.999Z');
      const result = formatDate(date);
      expect(result).toBe('2024-12-25');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2024-01-05T10:00:00.000Z');
      const result = formatDate(date);
      expect(result).toBe('2024-01-05');
    });
  });

  describe('getToday', () => {
    it('should return today\'s date in YYYY-MM-DD format', () => {
      const today = new Date();
      const expectedFormat = today.toISOString().split('T')[0];
      const result = getToday();
      
      expect(result).toBe(expectedFormat);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return consistent format', () => {
      const result = getToday();
      expect(typeof result).toBe('string');
      expect(result.length).toBe(10);
      expect(result.split('-')).toHaveLength(3);
    });
  });
});
