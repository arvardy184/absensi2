export const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const getToday = (): string => formatDate(new Date());
