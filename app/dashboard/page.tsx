'use client';
import { SkillTracker } from '@/components/SkillTracker';
import { useAthleteManager } from '@/hooks/useAthleteManager';
import React from 'react';

export default function SkillTrackerPage() {
    const { activeAthlete } = useAthleteManager();

    if (!activeAthlete) {
        return <div>Loading...</div>; // Or a spinner
    }

    return <SkillTracker activeAthlete={activeAthlete} />;
}
