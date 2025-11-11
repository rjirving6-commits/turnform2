import { useState, useEffect, useCallback } from 'react';
import type { Athlete, CustomSkill, EventName } from '../types';

const ATHLETES_STORAGE_KEY = 'gymnastics_athletes';
const ACTIVE_ATHLETE_ID_KEY = 'gymnastics_active_athlete_id';

export const useAthleteManager = () => {
    const [athletes, setAthletes] = useState<Athlete[]>(() => {
        try {
            const stored = localStorage.getItem(ATHLETES_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const [activeAthleteId, setActiveAthleteId] = useState<string | null>(() => {
        try {
            const stored = localStorage.getItem(ACTIVE_ATHLETE_ID_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });

    const saveAthletes = useCallback((newAthletes: Athlete[]) => {
        try {
            localStorage.setItem(ATHLETES_STORAGE_KEY, JSON.stringify(newAthletes));
            setAthletes(newAthletes);
        } catch (error) {
            console.error("Failed to save athletes", error);
        }
    }, []);
    
    const setActiveAthlete = useCallback((athleteId: string) => {
         try {
            localStorage.setItem(ACTIVE_ATHLETE_ID_KEY, JSON.stringify(athleteId));
            setActiveAthleteId(athleteId);
        } catch (error) {
            console.error("Failed to set active athlete", error);
        }
    }, []);

    const addAthlete = useCallback((name: string, level: number) => {
        const newAthlete: Athlete = {
            id: `athlete-${Date.now()}`,
            name,
            level,
            customSkills: [],
        };
        const updatedAthletes = [...athletes, newAthlete];
        saveAthletes(updatedAthletes);
        // If it's the first athlete, make them active
        if (athletes.length === 0) {
            setActiveAthlete(newAthlete.id);
        }
    }, [athletes, saveAthletes, setActiveAthlete]);
    
    const updateAthlete = useCallback((updatedAthlete: Athlete) => {
        const updatedAthletes = athletes.map(ath => ath.id === updatedAthlete.id ? updatedAthlete : ath);
        saveAthletes(updatedAthletes);
    }, [athletes, saveAthletes]);
    
    const logout = useCallback(() => {
        try {
            localStorage.removeItem(ACTIVE_ATHLETE_ID_KEY);
            setActiveAthleteId(null);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }, []);
    
    // Ensure active athlete exists, if not, set to first athlete or null
    useEffect(() => {
        if (athletes.length > 0) {
            const activeExists = athletes.some(a => a.id === activeAthleteId);
            if (!activeAthleteId || !activeExists) {
                setActiveAthlete(athletes[0].id);
            }
        } else {
            // No athletes, so no active one
            if (activeAthleteId !== null) {
                setActiveAthleteId(null);
                localStorage.removeItem(ACTIVE_ATHLETE_ID_KEY);
            }
        }
    }, [athletes, activeAthleteId, setActiveAthlete]);


    const activeAthlete = athletes.find(a => a.id === activeAthleteId) || null;

    return {
        athletes,
        activeAthlete,
        addAthlete,
        updateAthlete,
        setActiveAthlete,
        logout,
    };
};