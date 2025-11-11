export type EventName = 'Vault' | 'Bars' | 'Beam' | 'Floor';

export interface Skill {
  id: string;
  name: string;
  event: EventName;
  levels: number[];
}

export interface CustomSkill {
  id: string;
  name: string;
  event: EventName;
  isCustom: true;
}

export interface Athlete {
  id: string;
  name: string;
  level: number;
  customSkills: CustomSkill[];
}

export interface TurnLog {
  date: string; // YYYY-MM-DD
  skillId: string;
  event: EventName;
  count: number;
}

// For AI Video Coach
export interface FormCorrection {
    timestamp: number;
    feedback: string;
}

export interface Deduction {
    timestamp: number;
    description: string;
    deductionRangeMin: number;
    deductionRangeMax: number;
}

export interface FinalScoreRange {
    min: number;
    max: number;
}

export interface AnalysisResult {
    formCorrections: FormCorrection[];
    deductions: Deduction[];
    finalScoreRange: FinalScoreRange;
}

export interface SavedVideo {
    id: string;
    name: string;
    videoUrl: string; // object URL
    mimeType: string;
    prompt: string;
    analysis: AnalysisResult;
    date: string;
}
