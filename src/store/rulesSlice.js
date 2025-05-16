import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rulesets: [
    {
      id: '1',
      name: 'Default Ruleset',
      rules: [
        {
          id: '1',
          measurementName: 'Example Measurement',
          comparator: 'is',
          comparedValue: 'Not Present',
          findingName: 'Example Finding',
          action: 'Normal',
          unit: ''
        }
      ]
    }
  ],
  selectedRulesetId: '1',
  isEditMode: false
};

export const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    setSelectedRuleset: (state, action) => {
      state.selectedRulesetId = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    addNewRule: (state) => {
      const ruleset = state.rulesets.find(rs => rs.id === state.selectedRulesetId);
      if (ruleset) {
        ruleset.rules.push({
          id: Date.now().toString(),
          measurementName: '',
          comparator: 'is',
          comparedValue: 'Not Present',
          findingName: '',
          action: 'Normal',
          unit: ''
        });
      }
    },
    updateRule: (state, action) => {
      const { rulesetId, ruleId, updates } = action.payload;
      const ruleset = state.rulesets.find(rs => rs.id === rulesetId);
      if (ruleset) {
        const rule = ruleset.rules.find(r => r.id === ruleId);
        if (rule) {
          Object.assign(rule, updates);
        }
      }
    },
    deleteRule: (state, action) => {
      const { rulesetId, ruleId } = action.payload;
      const ruleset = state.rulesets.find(rs => rs.id === rulesetId);
      if (ruleset) {
        ruleset.rules = ruleset.rules.filter(r => r.id !== ruleId);
      }
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
          id: Date.now().toString(),
          name: `${currentRuleset.name}_(1)`,
          rules: JSON.parse(JSON.stringify(currentRuleset.rules))
        };
        state.rulesets.push(newRuleset);
        state.selectedRulesetId = newRuleset.id;
      }
    },
    deleteRuleset: (state) => {
      state.rulesets = state.rulesets.filter(rs => rs.id !== state.selectedRulesetId);
      if (state.rulesets.length > 0) {
        state.selectedRulesetId = state.rulesets[0].id;
      }
    },
    updateRulesetName: (state, action) => {
      const { rulesetId, newName } = action.payload;
      const ruleset = state.rulesets.find(rs => rs.id === rulesetId);
      if (ruleset) {
        ruleset.name = newName;
      }
    }
  }
});

export const {
  setSelectedRuleset,
  toggleEditMode,
  addNewRule,
  updateRule,
  deleteRule,
  addNewRuleset,
  copyRuleset,
  deleteRuleset,
  updateRulesetName
} = rulesSlice.actions;

export default rulesSlice.reducer; 