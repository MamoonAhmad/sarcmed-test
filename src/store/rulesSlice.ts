import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RulesState, Ruleset } from '../types/rules';

const initialState: RulesState = {
  rulesets: [],
  selectedRulesetId: null,
  isEditMode: false
};

interface LoadRuleSetsPayload {
  rule_sets: Ruleset[];
}

interface UpdateRuleSetPayload {
  rulesetId: number;
  updates: Partial<Ruleset>;
}

export const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    loadRuleSets: (state, action: PayloadAction<LoadRuleSetsPayload>) => {
      state.rulesets = action.payload.rule_sets;
      if (state.rulesets.length > 0) {
        state.selectedRulesetId = state.rulesets[0].id;
      }
    },
    updateRuleSet: (state, action: PayloadAction<UpdateRuleSetPayload>) => {
      const { rulesetId, updates } = action.payload;
      const rulesetIndex = state.rulesets.findIndex(rs => rs.id === rulesetId);
      if (rulesetIndex !== -1) {
        state.rulesets[rulesetIndex] = {
          ...state.rulesets[rulesetIndex],
          ...updates
        };
      }
    },
    deleteRuleSet: (state, action: PayloadAction<number>) => {
      const rulesetId = action.payload;
      state.rulesets = state.rulesets.filter(rs => rs.id !== rulesetId);
      if (state.rulesets.length > 0) {
        state.selectedRulesetId = state.rulesets[0].id;
      } else {
        state.selectedRulesetId = null;
      }
    },
    setSelectedRuleset: (state, action: PayloadAction<number>) => {
      state.selectedRulesetId = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    addNewRuleset: (state) => {
      const newRuleset: Ruleset = {
        id: Date.now(),
        name: `Rule Set ${state.rulesets.length + 1}`,
        rules: []
      };
      state.rulesets.push(newRuleset);
      state.selectedRulesetId = newRuleset.id;
    },
    copyRuleset: (state) => {
      const currentRuleset = state.rulesets.find(rs => rs.id === state.selectedRulesetId);
      if (currentRuleset) {
        const newRuleset: Ruleset = {
          id: Date.now(),
          name: `${currentRuleset.name}_(1)`,
          rules: JSON.parse(JSON.stringify(currentRuleset.rules))
        };
        state.rulesets.push(newRuleset);
        state.selectedRulesetId = newRuleset.id;
      }
    },
  }
});

export const {
  loadRuleSets,
  updateRuleSet,
  deleteRuleSet,
  setSelectedRuleset,
  toggleEditMode,
  addNewRuleset,
  copyRuleset,
} = rulesSlice.actions;

export default rulesSlice.reducer; 