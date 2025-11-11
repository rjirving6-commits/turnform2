import React, { useState, useMemo } from 'react';
import { useSkillLog } from '../hooks/useSkillLog';
import { skills as defaultSkills } from '../data/skills';
// FIX: Import CustomSkill type to resolve 'Cannot find name' error.
import type { EventName, Skill, Athlete, CustomSkill } from '../types';
import { VaultIcon, BarsIcon, BeamIcon, FloorIcon, ChevronLeftIcon } from './icons/Icons';

type SkillTrackerView = 'dashboard' | 'events' | 'log';

interface SkillTrackerProps {
    activeAthlete: Athlete;
}

const eventDetails: Record<EventName, { icon: React.FC<React.SVGProps<SVGSVGElement>>; gradient: string }> = {
  'Vault': { icon: VaultIcon, gradient: 'from-purple-500 to-indigo-500' },
  'Bars': { icon: BarsIcon, gradient: 'from-blue-500 to-cyan-500' },
  'Beam': { icon: BeamIcon, gradient: 'from-orange-500 to-amber-500' },
  'Floor': { icon: FloorIcon, gradient: 'from-red-500 to-rose-500' },
};

const StatCard: React.FC<{ title: string; value: number | string; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-gray-800 p-4 rounded-xl shadow-lg ${className}`}>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

export const SkillTracker: React.FC<SkillTrackerProps> = ({ activeAthlete }) => {
    const [view, setView] = useState<SkillTrackerView>('dashboard');
    const [currentEvent, setCurrentEvent] = useState<EventName | null>(null);

    const {
        getTurnsForToday,
        getTurnsForLast7Days,
        getTurnsForLast30Days,
        addTurn,
    } = useSkillLog(activeAthlete.id);

    const todayTurnsBySkill = useMemo(getTurnsForToday, [getTurnsForToday]);
    const weeklyTurnsByEvent = useMemo(getTurnsForLast7Days, [getTurnsForLast7Days]);
    const monthlyTurnsByEvent = useMemo(getTurnsForLast30Days, [getTurnsForLast30Days]);

    const totalToday = Object.values(todayTurnsBySkill).reduce((sum: number, count: number) => sum + count, 0);
    const totalWeekly = Object.values(weeklyTurnsByEvent).reduce((sum: number, count: number) => sum + count, 0);
    const totalMonthly = Object.values(monthlyTurnsByEvent).reduce((sum: number, count: number) => sum + count, 0);

    const handleSelectEvent = (event: EventName) => {
        setCurrentEvent(event);
        setView('log');
    };

    const allSkills = useMemo(() => [...defaultSkills, ...activeAthlete.customSkills], [activeAthlete.customSkills]);
    
    const relevantSkills = useMemo(() => {
        if (!currentEvent) return [];
        return allSkills.filter(skill => {
            if (skill.event !== currentEvent) return false;
            if ('isCustom' in skill) return true; // Always show custom skills for the event
            return skill.levels.includes(activeAthlete.level);
        });
    }, [currentEvent, activeAthlete.level, allSkills]);

    // --- Views ---

    const DashboardView = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Turn Tracker Dashboard</h2>
                 <p className="text-gray-400 mt-1">Showing stats for {activeAthlete.name} (Level {activeAthlete.level})</p>
                <button 
                    onClick={() => setView('events')}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                    Start Today&apos;s Practice
                </button>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-4 text-center">Events Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.keys(eventDetails) as EventName[]).map(event => {
                        const EventIcon = eventDetails[event].icon;
                        return (
                            <div key={event} className="bg-gray-800 p-4 rounded-xl shadow-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${eventDetails[event].gradient}`}>
                                        <EventIcon className="w-6 h-6 text-white"/>
                                    </div>
                                    <h4 className="text-xl font-bold">{event}</h4>
                                </div>
                                <div className="text-sm space-y-1">
                                    <p className="text-gray-400">Last 7 Days: <span className="font-semibold text-white">{weeklyTurnsByEvent[event] || 0}</span></p>
                                    <p className="text-gray-400">Last 30 Days: <span className="font-semibold text-white">{monthlyTurnsByEvent[event] || 0}</span></p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Today&apos;s Turns" value={totalToday} />
                <StatCard title="This Week" value={totalWeekly} />
                <StatCard title="This Month" value={totalMonthly} />
            </div>
        </div>
    );

    const EventSelectionView = () => (
        <div className="space-y-6">
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <ChevronLeftIcon className="w-4 h-4" /> Back to Dashboard
            </button>
            <h2 className="text-3xl font-bold text-center">Select Event</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(Object.keys(eventDetails) as EventName[]).map(event => {
                    const EventIcon = eventDetails[event].icon;
                    return (
                        <button key={event} onClick={() => handleSelectEvent(event)} className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 group">
                            <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${eventDetails[event].gradient} transition-transform group-hover:scale-110`}>
                                <EventIcon className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white">{event}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    );

    const SkillLoggingView = () => {
        // Note: Adding new skills is now handled in the Profile component.
        // This view is now purely for logging turns.
        if (!currentEvent) return null;

        const EventIcon = eventDetails[currentEvent].icon;
        
        const SkillCounter: React.FC<{skill: Skill | CustomSkill}> = ({ skill }) => {
            const count = todayTurnsBySkill[skill.id] || 0;
            const setCount = (newCount: number) => addTurn(skill.id, skill.event, newCount);

            return (
                 <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-white">{skill.name}</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCount(Math.max(0, count - 1))} className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg">-</button>
                        <span className="text-xl font-bold w-10 text-center">{count}</span>
                        <button onClick={() => setCount(count + 1)} className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg">+</button>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <button onClick={() => setView('events')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" /> Back to Events
                </button>
                <div className="flex items-center gap-3 justify-center">
                    <EventIcon className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-center">{currentEvent}</h2>
                </div>

                <div className="p-4 bg-gray-800 rounded-xl space-y-3">
                    <h3 className="text-lg font-semibold">Level {activeAthlete.level} Skills</h3>
                    {relevantSkills.length > 0 ? (
                        relevantSkills.map(skill => <SkillCounter key={skill.id} skill={skill}/>)
                    ) : (
                        <p className="text-gray-400 text-center py-4">No skills found for this level. Go to the Profile page to add custom skills.</p>
                    )}
                </div>
            </div>
        );
    };

    const renderCurrentView = () => {
        switch(view) {
            case 'dashboard': return <DashboardView />;
            case 'events': return <EventSelectionView />;
            case 'log': return <SkillLoggingView />;
            default: return <DashboardView />;
        }
    };

    return <>{renderCurrentView()}</>;
};