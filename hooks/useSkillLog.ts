import { useState, useEffect, useCallback } from 'react';
import type { TurnLog, EventName } from '../types';
import { format, subDays, isWithinInterval } from 'date-fns';

const LOG_STORAGE_KEY_PREFIX = 'gymnastics_turn_log_';

const todayISO = () => format(new Date(), 'yyyy-MM-dd');

export const useSkillLog = (athleteId: string) => {
    const [logs, setLogs] = useState<TurnLog[]>([]);
    const storageKey = `${LOG_STORAGE_KEY_PREFIX}${athleteId}`;

    useEffect(() => {
        try {
            const storedLogs = localStorage.getItem(storageKey);
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            } else {
                setLogs([]); // Ensure logs are cleared when athlete changes
            }
        } catch (error) {
            console.error("Failed to load turn logs from local storage", error);
            setLogs([]);
        }
    }, [storageKey]);

    const saveLogs = useCallback((newLogs: TurnLog[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(newLogs));
            setLogs(newLogs);
        } catch (error)
        {
            console.error("Failed to save turn logs to local storage", error);
        }
    }, [storageKey]);

    const addTurn = useCallback((skillId: string, event: EventName, count: number) => {
        const date = todayISO();
        const existingLogIndex = logs.findIndex(log => log.date === date && log.skillId === skillId);
        
        const newLogs = [...logs];
        
        if (existingLogIndex > -1) {
            if (count > 0) {
                newLogs[existingLogIndex] = { ...newLogs[existingLogIndex], count };
            } else {
                newLogs.splice(existingLogIndex, 1); // Remove if count is zero
            }
        } else if (count > 0) {
            newLogs.push({ date, skillId, event, count });
        }

        saveLogs(newLogs);
    }, [logs, saveLogs]);

    const getTurnsForDate = useCallback((date: string): Record<string, number> => {
        return logs
            .filter(log => log.date === date)
            .reduce((acc, log) => {
                acc[log.skillId] = log.count;
                return acc;
            }, {} as Record<string, number>);
    }, [logs]);

    const getTurnsForToday = useCallback(() => getTurnsForDate(todayISO()), [getTurnsForDate]);

    const getAggregatedTurnsForPeriod = useCallback((days: number): Record<EventName, number> => {
        const endDate = new Date();
        const startDate = subDays(endDate, days - 1);
        
        const relevantLogs = logs.filter(log => {
             try {
                return isWithinInterval(new Date(log.date), { start: startDate, end: endDate });
            } catch {
                return false; // handle invalid date strings
            }
        });

        return relevantLogs.reduce((acc, log) => {
            acc[log.event] = (acc[log.event] || 0) + log.count;
            return acc;
        }, {} as Record<EventName, number>);

    }, [logs]);

    const getTurnsForLast7Days = useCallback(() => getAggregatedTurnsForPeriod(7), [getAggregatedTurnsForPeriod]);
    const getTurnsForLast30Days = useCallback(() => getAggregatedTurnsForPeriod(30), [getAggregatedTurnsForPeriod]);

    return { 
        logs,
        addTurn,
        getTurnsForToday, 
        getTurnsForLast7Days,
        getTurnsForLast30Days,
    };
};