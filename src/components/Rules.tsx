import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadRuleSets,
  updateRuleSet,
  deleteRuleSet,
  addNewRuleset,
} from "../store/rulesSlice";
import RulesViewMode from "./RulesetViewMode";
import RulesetEditMode from "./RulesetEditMode";
import { mockData } from "../data/mockRules";
import { RootState, Ruleset } from "../types/rules";

const Rules: React.FC = () => {
  const dispatch = useDispatch();
  const { rulesets } = useSelector((state: RootState) => state.rules);
  const [localRuleset, setLocalRuleset] = useState<Ruleset | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRulesetId, setSelectedRulesetId] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(loadRuleSets(mockData));
  }, [dispatch]);

  useEffect(() => {
    if (selectedRulesetId) {
      const selectedRuleset = rulesets.find(
        (rs) => rs.id === selectedRulesetId
      );
      if (selectedRuleset) {
        if (isEditMode) {
          setLocalRuleset(JSON.parse(JSON.stringify(selectedRuleset)));
        } else {
          setLocalRuleset(selectedRuleset);
        }
      } else {
        setSelectedRulesetId(null);
      }
    } else if (rulesets.length) {
      setInitialRulesetId();
    } else {
      setLocalRuleset(null);
    }
  }, [rulesets, selectedRulesetId, isEditMode]);

  const setInitialRulesetId = () => {
    if (rulesets.length) {
      setSelectedRulesetId(rulesets[0]?.id);
    }
  };

  const handleSelectedRulesetChange = (value: string) => {
    setSelectedRulesetId(parseInt(value));
  };

  const handleAddNewRuleset = () => {
    const newRuleset: Ruleset = {
      id: Date.now(),
      name: `Rule Set ${rulesets.length}`,
      rules: [],
    };
    dispatch(addNewRuleset({ ruleset: newRuleset }));
    setSelectedRulesetId(newRuleset.id);
  };

  const handleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCopyRuleset = () => {
    if (localRuleset) {
      const newRuleset: Ruleset = {
        id: Date.now(),
        name: `${localRuleset.name}_(1)`,
        rules: JSON.parse(JSON.stringify(localRuleset.rules)),
      };
      dispatch(
        addNewRuleset({
          ruleset: newRuleset,
        })
      );
      setSelectedRulesetId(newRuleset.id);
    }
  };

  const handleSave = (ruleset: Ruleset) => {
    if (localRuleset && selectedRulesetId) {
      dispatch(
        updateRuleSet({
          rulesetId: selectedRulesetId,
          updates: ruleset,
        })
      );
      setLocalRuleset(ruleset);
      handleEditMode();
    }
  };

  const handleCancel = () => {
    handleEditMode();
  };

  const handleDelete = () => {
    if (selectedRulesetId) {
      dispatch(deleteRuleSet(selectedRulesetId));
      handleEditMode();
    }
  };

  return isEditMode && localRuleset ? (
    <RulesetEditMode
      ruleset={localRuleset}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  ) : (
    <RulesViewMode
      rulesets={rulesets}
      selectedRulesetId={selectedRulesetId}
      onSelectedRulesetChange={handleSelectedRulesetChange}
      onEditMode={handleEditMode}
      onCopyRuleset={handleCopyRuleset}
      onAddNewRuleset={handleAddNewRuleset}
    />
  );
};

export default Rules;
