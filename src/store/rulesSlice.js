import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rulesets: [],
  selectedRulesetId: null,
  isEditMode: false
};

export const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    loadRuleSets: (state, action) => {
      state.rulesets = action.payload.rule_sets;
      if (state.rulesets.length > 0) {
        state.selectedRulesetId = state.rulesets[0].id;
      }
    },
    updateRuleSet: (state, action) => {
      const { rulesetId, updates } = action.payload;
      const rulesetIndex = state.rulesets.findIndex(rs => rs.id === rulesetId);
      if (rulesetIndex !== -1) {
        state.rulesets[rulesetIndex] = {
          ...state.rulesets[rulesetIndex],
          ...updates
        };
      }
    },
    deleteRuleSet: (state, action) => {
      const rulesetId = action.payload;
      state.rulesets = state.rulesets.filter(rs => rs.id !== rulesetId);
      if (state.rulesets.length > 0) {
        state.selectedRulesetId = state.rulesets[0].id;
      } else {
        state.selectedRulesetId = null;
      }
    },
    setSelectedRuleset: (state, action) => {
      state.selectedRulesetId = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    addNewRuleset: (state) => {
      const newRuleset = {
        id: Date.now().toString(),
        name: 'New Ruleset',
        rules: []
      };
      state.rulesets.push(newRuleset);
      state.selectedRulesetId = newRuleset.id;
    },
    copyRuleset: (state) => {
      const currentRuleset = state.rulesets.find(rs => rs.id === state.selectedRulesetId);
      if (currentRuleset) {
        const newRuleset = {
          id: state.rulesets.length+1,
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
  addNewRule,
  updateRule,
  deleteRule,
  addNewRuleset,
  copyRuleset,
  updateRulesetName
} = rulesSlice.actions;

export default rulesSlice.reducer; 