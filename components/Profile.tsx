import React, { useState } from 'react';
import type { Athlete, CustomSkill, EventName } from '../types';

interface ProfileProps {
  athletes: Athlete[];
  activeAthlete: Athlete | null;
  addAthlete: (name: string, level: number) => void;
  updateAthlete: (updatedAthlete: Athlete) => void;
  setActiveAthlete: (athleteId: string) => void;
  isInitialSetup?: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ 
    athletes, 
    activeAthlete, 
    addAthlete, 
    updateAthlete, 
    setActiveAthlete,
    isInitialSetup = false
}) => {
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  // --- Forms State ---
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState<number>(4);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillEvent, setNewSkillEvent] = useState<EventName>('Floor');

  const handleAddNewAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addAthlete(newName.trim(), newLevel);
      setNewName('');
      setNewLevel(4);
    }
  };
  
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim() && editingAthlete) {
        const newSkill: CustomSkill = {
            id: `custom-${Date.now()}`,
            name: newSkillName.trim(),
            event: newSkillEvent,
            isCustom: true,
        };
        const updatedAthlete = {
            ...editingAthlete,
            customSkills: [...editingAthlete.customSkills, newSkill]
        };
        updateAthlete(updatedAthlete);
        setEditingAthlete(updatedAthlete);
        setNewSkillName('');
    }
  };

  const handleRemoveCustomSkill = (skillId: string) => {
    if (editingAthlete) {
        const updatedAthlete = {
            ...editingAthlete,
            customSkills: editingAthlete.customSkills.filter(s => s.id !== skillId),
        };
        updateAthlete(updatedAthlete);
        setEditingAthlete(updatedAthlete);
    }
  };
  
  const handleUpdateAthleteLevel = (athlete: Athlete, level: number) => {
    const updatedAthlete = { ...athlete, level };
    updateAthlete(updatedAthlete);
    if(editingAthlete?.id === athlete.id) {
        setEditingAthlete(updatedAthlete);
    }
  };

  if (isInitialSetup) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
        <p className="text-gray-400 mb-6">Let's create your first athlete profile to get started.</p>
        <form onSubmit={handleAddNewAthlete} className="max-w-sm mx-auto space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Athlete's Name"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <select 
            value={newLevel} 
            onChange={e => setNewLevel(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 text-white text-md rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <button type="submit" className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
            Save & Start Tracking
          </button>
        </form>
      </div>
    );
  }

  if (editingAthlete) {
    return (
         <div className="space-y-6">
            <button onClick={() => setEditingAthlete(null)} className="text-sm text-gray-400 hover:text-white">&larr; Back to Profiles</button>
            <h2 className="text-2xl font-bold">Editing: {editingAthlete.name}</h2>
            {/* ... form to edit name, level, etc. ... */}
             <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3">
                <h3 className="text-xl font-semibold">Custom Skills</h3>
                {editingAthlete.customSkills.length > 0 ? (
                    editingAthlete.customSkills.map(skill => (
                        <div key={skill.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                            <span>{skill.name} ({skill.event})</span>
                            <button onClick={() => handleRemoveCustomSkill(skill.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                        </div>
                    ))
                ) : <p className="text-gray-500">No custom skills added yet.</p>}
            </div>
            <form onSubmit={handleAddCustomSkill} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3">
                 <h3 className="text-xl font-semibold">Add New Custom Skill</h3>
                 <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., Double Back Handspring"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                    required
                 />
                 <select value={newSkillEvent} onChange={e => setNewSkillEvent(e.target.value as EventName)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md">
                     <option value="Vault">Vault</option>
                     <option value="Bars">Bars</option>
                     <option value="Beam">Beam</option>
                     <option value="Floor">Floor</option>
                 </select>
                 <button type="submit" className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold">+ Add Skill</button>
            </form>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Athlete Profiles</h2>
      <div className="space-y-3">
        {athletes.map(athlete => (
          <div key={athlete.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
            <div>
              <p className={`font-bold text-lg ${athlete.id === activeAthlete?.id ? 'text-indigo-400' : 'text-white'}`}>{athlete.name}</p>
              <p className="text-sm text-gray-400">Level {athlete.level}</p>
            </div>
            <div className="flex items-center gap-2">
                <select 
                    value={athlete.level} 
                    onChange={e => handleUpdateAthleteLevel(athlete, Number(e.target.value))}
                    className="bg-gray-700 border-gray-600 rounded text-sm h-8"
                >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
                        <option key={level} value={level}>Lvl {level}</option>
                    ))}
                </select>
                <button onClick={() => setEditingAthlete(athlete)} className="px-3 h-8 text-xs bg-gray-600 hover:bg-gray-500 rounded">Manage Skills</button>
                {athlete.id !== activeAthlete?.id && (
                    <button onClick={() => setActiveAthlete(athlete.id)} className="px-3 h-8 text-xs bg-indigo-600 hover:bg-indigo-500 rounded">Set Active</button>
                )}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-semibold mt-8 mb-2">Add New Athlete</h3>
        <form onSubmit={handleAddNewAthlete} className="flex items-center gap-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New Athlete's Name"
            className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md"
            required
          />
          <select 
            value={newLevel} 
            onChange={e => setNewLevel(Number(e.target.value))}
            className="p-2 bg-gray-700 border border-gray-600 text-white rounded-md"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold">+ Add</button>
        </form>
      </div>
    </div>
  );
};