import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RulesState, Ruleset } from "../types/rules";

// Initial state for the rules slice
const initialState: RulesState = {
  rulesets: [],
};

// Type definitions for action payloads
interface LoadRuleSetsPayload {
  rule_sets: Ruleset[];
}

interface UpdateRuleSetPayload {
  rulesetId: number;
  updates: Partial<Ruleset>;
}

interface NewRulesetPayload {
  ruleset: Ruleset;
}

// Redux slice for managing rules state
export const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    // Load initial rulesets into the store
    loadRuleSets: (state, action: PayloadAction<LoadRuleSetsPayload>) => {
      state.rulesets = action.payload.rule_sets;
    },

    // Update an existing ruleset with new data
    updateRuleSet: (state, action: PayloadAction<UpdateRuleSetPayload>) => {
      const { rulesetId, updates } = action.payload;
      const rulesetIndex = state.rulesets.findIndex(
        (rs) => rs.id === rulesetId
      );
      if (rulesetIndex !== -1) {
        state.rulesets[rulesetIndex] = {
          ...state.rulesets[rulesetIndex],
          ...updates,
        };
      }
    },

    // Remove a ruleset from the store
    deleteRuleSet: (state, action: PayloadAction<number>) => {
      const rulesetId = action.payload;
      state.rulesets = state.rulesets.filter((rs) => rs.id !== rulesetId);
    },

    // Add a new ruleset to the store
    addNewRuleset: (state, action: PayloadAction<NewRulesetPayload>) => {
      state.rulesets.push(action.payload.ruleset);
    },
  },
});

// Export actions for use in components
export const {
  loadRuleSets,
  updateRuleSet,
  deleteRuleSet,
  addNewRuleset,
} = rulesSlice.actions;

export default rulesSlice.reducer;
