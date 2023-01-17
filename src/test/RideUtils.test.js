import { getCurrentStreak } from "../RideUtils";

test('Current Streak ignores today if its before close',
    () => {
        // 3:45 PM MST
        const mockDateObject = new Date("2023-01-16T22:45:23.581Z");

        jest.useFakeTimers('modern');

        jest.setSystemTime(mockDateObject.getTime());

        const mockRides = [{ date: '2023-01-15' },
        { date: '2023-01-13' },
        { date: '2023-01-14' },
        { date: '2023-01-10' },];
        const currentStreak = getCurrentStreak(mockRides);
        jest.useRealTimers();
        expect(currentStreak).toBe(3);
    });

test('Current Streak counts today if after close',
    () => {
        // 4:45 PM MST
        const mockDateObject = new Date("2023-01-16T23:45:23.581Z");

        jest.useFakeTimers('modern');

        jest.setSystemTime(mockDateObject.getTime());

        const mockRides = [{ date: '2023-01-15' },
        { date: '2023-01-13' },
        { date: '2023-01-14' },
        { date: '2023-01-10' },];
        const currentStreak = getCurrentStreak(mockRides);
        jest.useRealTimers();
        expect(currentStreak).toBe(0);
    });

test('Current Streak is 0 if didnt ski yesterday',
    () => {
        // 3:45 PM MST
        const mockDateObject = new Date("2023-01-16T22:45:23.581Z");

        jest.useFakeTimers('modern');

        jest.setSystemTime(mockDateObject.getTime());

        const mockRides = [
            { date: '2023-01-13' },
            { date: '2023-01-14' },
            { date: '2023-01-10' },];
        const currentStreak = getCurrentStreak(mockRides);
        jest.useRealTimers();
        expect(currentStreak).toBe(0);
    });