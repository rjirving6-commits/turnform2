import React, { useState } from 'react';
import { skills } from '../data/skills';
import { skillAnimations } from '../data/skillAnimations';
import type { EventName } from '../types';
import { VaultIcon, BarsIcon, BeamIcon, FloorIcon } from './icons/Icons';

const eventDetails: Record<EventName, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
  'Vault': { icon: VaultIcon, color: 'text-purple-400' },
  'Bars': { icon: BarsIcon, color: 'text-blue-400' },
  'Beam': { icon: BeamIcon, color: 'text-orange-400' },
  'Floor': { icon: FloorIcon, color: 'text-red-400' },
};

export const SkillLibrary: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventName | null>(null);

  const filteredSkills = selectedEvent 
    ? skills.filter(skill => skill.event === selectedEvent)
    : skills;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Skill Library</h2>
        <p className="text-gray-400">Browse standard gymnastics skills by event.</p>
      </div>
      
      <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg">
        <button 
            onClick={() => setSelectedEvent(null)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${!selectedEvent ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}
        >
            All
        </button>
        {(Object.keys(eventDetails) as EventName[]).map(event => (
            <button 
                key={event}
                onClick={() => setSelectedEvent(event)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${selectedEvent === event ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}
            >
                {event}
            </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map(skill => {
            const Icon = eventDetails[skill.event].icon;
            const color = eventDetails[skill.event].color;
            const animationSrc = skillAnimations[skill.id];

            return (
              <div key={skill.id} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                {animationSrc ? (
                    <div className="w-24 h-24 bg-gray-800 rounded-md flex-shrink-0 flex items-center justify-center">
                         <p className="text-xs text-gray-500">Animation</p>
                    </div>
                ) : <div className="w-24 h-24 bg-gray-800 rounded-md flex-shrink-0"/>}
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                  <div className={`flex items-center gap-2 text-sm ${color}`}>
                    <Icon className="w-4 h-4" />
                    <span>{skill.event}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Levels: {skill.levels.join(', ')}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-8">No skills found for this event.</p>
        )}
      </div>
    </div>
  );
};
