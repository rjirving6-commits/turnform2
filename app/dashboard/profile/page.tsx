'use client';
import { Profile } from '@/components/Profile';
import { useAthleteManager } from '@/hooks/useAthleteManager';
import React from 'react';

export default function ProfilePage() {
    const {
        athletes,
        activeAthlete,
        addAthlete,
        updateAthlete,
        setActiveAthlete,
    } = useAthleteManager();

    if (!activeAthlete) {
        return <div>Loading...</div>;
    }

    return (
        <Profile 
            athletes={athletes}
            activeAthlete={activeAthlete}
            addAthlete={addAthlete}
            updateAthlete={updateAthlete}
            setActiveAthlete={setActiveAthlete}
        />
    );
}
