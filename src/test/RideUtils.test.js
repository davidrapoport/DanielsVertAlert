import {
  getCurrentStreak,
  getVertLastSevenDays,
  getVertSinceMonday,
} from '../RideUtils';

test('Current Streak ignores today if its before close', () => {
  // 3:45 PM MST
  const mockDateObject = new Date('2023-01-16T22:45:23.581Z');

  jest.useFakeTimers('modern');

  jest.setSystemTime(mockDateObject.getTime());

  const mockRides = [
    {date: '2023-01-15'},
    {date: '2023-01-13'},
    {date: '2023-01-14'},
    {date: '2023-01-10'},
  ];
  const currentStreak = getCurrentStreak(mockRides);
  jest.useRealTimers();
  expect(currentStreak).toBe(3);
});

test('Current Streak counts today if after close', () => {
  // 4:45 PM MST
  const mockDateObject = new Date('2023-01-16T23:45:23.581Z');

  jest.useFakeTimers('modern');

  jest.setSystemTime(mockDateObject.getTime());

  const mockRides = [
    {date: '2023-01-15'},
    {date: '2023-01-13'},
    {date: '2023-01-14'},
    {date: '2023-01-10'},
  ];
  const currentStreak = getCurrentStreak(mockRides);
  jest.useRealTimers();
  expect(currentStreak).toBe(0);
});

test('Current Streak is 0 if didnt ski yesterday', () => {
  // 3:45 PM MST
  const mockDateObject = new Date('2023-01-16T22:45:23.581Z');

  jest.useFakeTimers('modern');

  jest.setSystemTime(mockDateObject.getTime());

  const mockRides = [
    {date: '2023-01-13'},
    {date: '2023-01-14'},
    {date: '2023-01-10'},
  ];
  const currentStreak = getCurrentStreak(mockRides);
  jest.useRealTimers();
  expect(currentStreak).toBe(0);
});

test('Vert Last seven days', () => {
  // 3:45 PM MST
  const mockDateObject = new Date('2023-01-16T22:45:23.581Z');

  jest.useFakeTimers('modern');

  jest.setSystemTime(mockDateObject.getTime());

  const mockRides = [
    {date: '2023-01-13', totalVert: 1000},
    {date: '2023-01-14', totalVert: 500},
    {date: '2023-01-10', totalVert: 50},
    {date: '2023-01-09', totalVert: 5},
  ];
  const vert = getVertLastSevenDays(mockRides);
  jest.useRealTimers();
  // The 9th shouldn't count.
  expect(vert).toBe(1550);
});

test('Vert Since Monday Doesnt wrap around', () => {
  // 3:45 PM MST, MONDAY!! The 16th
  const mockDateObject = new Date('2023-01-16T22:45:23.581Z');

  jest.useFakeTimers('modern');

  jest.setSystemTime(mockDateObject.getTime());

  const mockRides = [
    {date: '2023-01-16', totalVert: 1000},
    {date: '2023-01-14', totalVert: 500},
    {date: '2023-01-10', totalVert: 50},
    {date: '2023-01-09', totalVert: 5},
  ];
  const vert = getVertSinceMonday(mockRides);
  jest.useRealTimers();
  // Only count Monday the 16th, nothing before.
  expect(vert).toBe(1000);
});

test('Vert Since Monday adds goodly', () => {
  // 3:45 PM MST, Sunday!! The 15th
  const mockDateObject = new Date('2023-01-15T22:45:23.581Z');

  jest.useFakeTimers('modern');

  jest.setSystemTime(mockDateObject.getTime());

  const mockRides = [
    {date: '2023-01-15', totalVert: 1000},
    {date: '2023-01-14', totalVert: 500},
    {date: '2023-01-10', totalVert: 50},
    {date: '2023-01-09', totalVert: 5},
    {date: '2023-01-08', totalVert: 10000},
  ];
  const vert = getVertSinceMonday(mockRides);
  jest.useRealTimers();
  // Count everything but the 8th (A sunday)
  expect(vert).toBe(1555);
});
