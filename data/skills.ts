import type { Skill } from '../types';

export const skills: Skill[] = [
  // === VAULT ===
  { id: 'v1', name: 'Straight Jump', event: 'Vault', levels: [1, 2] },
  { id: 'v2', name: 'Handstand Flatback', event: 'Vault', levels: [3, 4] },
  { id: 'v3', name: 'Front Handspring', event: 'Vault', levels: [4, 5, 6] },
  { id: 'v4', name: 'Tsukahara Prep', event: 'Vault', levels: [6, 7] },
  { id: 'v5', name: 'Yurchenko Prep', event: 'Vault', levels: [7, 8] },
  { id: 'v6', name: 'Tsukahara Tuck', event: 'Vault', levels: [8, 9] },
  { id: 'v7', name: 'Yurchenko Layout', event: 'Vault', levels: [9, 10] },

  // === BARS ===
  { id: 'b1', name: 'Pullover', event: 'Bars', levels: [1, 2, 3] },
  { id: 'b2', name: 'Back Hip Circle', event: 'Bars', levels: [2, 3] },
  { id: 'b3', name: 'Front Hip Circle', event: 'Bars', levels: [3, 4] },
  { id: 'b4', name: 'Kip', event: 'Bars', levels: [4, 5, 6] },
  { id: 'b5', name: 'Flyaway Dismount', event: 'Bars', levels: [5, 6, 7] },
  { id: 'b6', name: 'Clear Hip Circle', event: 'Bars', levels: [6, 7, 8] },
  { id: 'b7', name: 'Giant Swing', event: 'Bars', levels: [7, 8, 9] },
  { id: 'b8', name: 'Tkatchev', event: 'Bars', levels: [9, 10] },
  { id: 'b9', name: 'Double Layout Dismount', event: 'Bars', levels: [10] },

  // === BEAM ===
  { id: 'be1', name: 'Straight Jump', event: 'Beam', levels: [1, 2] },
  { id: 'be2', name: 'Cartwheel', event: 'Beam', levels: [3, 4] },
  { id: 'be3', name: 'Handstand', event: 'Beam', levels: [3, 4, 5] },
  { id: 'be4', name: 'Leap Series', event: 'Beam', levels: [5, 6] },
  { id: 'be5', name: 'Back Walkover', event: 'Beam', levels: [5, 6, 7] },
  { id: 'be6', name: 'Back Handspring', event: 'Beam', levels: [7, 8] },
  { id: 'be7', name: 'Switch Leap', event: 'Beam', levels: [7, 8, 9] },
  { id: 'be8', name: 'Back Tuck', event: 'Beam', levels: [8, 9, 10] },
  { id: 'be9', name: 'Full Turn', event: 'Beam', levels: [6, 7, 8, 9, 10] },

  // === FLOOR ===
  { id: 'f1', name: 'Forward Roll', event: 'Floor', levels: [1] },
  { id: 'f2', name: 'Cartwheel', event: 'Floor', levels: [1, 2, 3] },
  { id: 'f3', name: 'Round-off', event: 'Floor', levels: [3, 4] },
  { id: 'f4', name: 'Back Handspring', event: 'Floor', levels: [4, 5, 6] },
  { id: 'f5', name: 'Front Handspring', event: 'Floor', levels: [4, 5] },
  { id: 'f6', name: 'Round-off Back Handspring', event: 'Floor', levels: [5, 6] },
  { id: 'f7', name: 'Front Tuck', event: 'Floor', levels: [6, 7] },
  { id: 'f8', name: 'Back Tuck', event: 'Floor', levels: [6, 7] },
  { id: 'f9', name: 'Layout', event: 'Floor', levels: [7, 8, 9] },
  { id: 'f10', name: 'Full Twist', event: 'Floor', levels: [8, 9, 10] },
  { id: 'f11', name: 'Double Tuck', event: 'Floor', levels: [10] },
];