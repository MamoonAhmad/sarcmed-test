import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadRuleSets } from "../store/rulesSlice";
import RulesViewMode from "./RulesetViewMode";
import RulesEditMode from "./RulesetEditMode";
import { mockData } from "../data/mockRules";
import { RootState } from "../types/rules";

const Rules: React.FC = () => {
  const dispatch = useDispatch();
  const { isEditMode } = useSelector((state: RootState) => state.rules);

  useEffect(() => {
    dispatch(loadRuleSets(mockData));
  }, [dispatch]);

  return isEditMode ? <RulesEditMode /> : <RulesViewMode />;
};

export default Rules;
