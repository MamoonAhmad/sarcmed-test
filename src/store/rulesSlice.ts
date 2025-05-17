import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RulesState, Ruleset } from "../types/rules";

const initialState: RulesState = {
  rulesets: [],
};

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

export const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    loadRuleSets: (state, action: PayloadAction<LoadRuleSetsPayload>) => {
      state.rulesets = action.payload.rule_sets;
    },
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
    deleteRuleSet: (state, action: PayloadAction<number>) => {
      const rulesetId = action.payload;
      state.rulesets = state.rulesets.filter((rs) => rs.id !== rulesetId);
    },
    addNewRuleset: (state, action: PayloadAction<NewRulesetPayload>) => {
      state.rulesets.push(action.payload.ruleset);
    },
  },
});

export const {
  loadRuleSets,
  updateRuleSet,
  deleteRuleSet,
  addNewRuleset,
} = rulesSlice.actions;

export default rulesSlice.reducer;
