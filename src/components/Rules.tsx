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

/**
 * Main Rules component that manages the rules interface
 * Handles switching between view and edit modes, and manages ruleset selection
 */
const Rules: React.FC = () => {
  const dispatch = useDispatch();
  const { rulesets } = useSelector((state: RootState) => state.rules);
  const [localRuleset, setLocalRuleset] = useState<Ruleset | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRulesetId, setSelectedRulesetId] = useState<number | null>(null);

  // Load initial rulesets from mock data
  useEffect(() => {
    dispatch(loadRuleSets(mockData));
  }, [dispatch]);

  // Update local ruleset when selection or edit mode changes
  useEffect(() => {
    if (selectedRulesetId) {
      const selectedRuleset = rulesets.find(
        (rs) => rs.id === selectedRulesetId
      );
      if (selectedRuleset) {
        // Create a deep copy when in edit mode to prevent direct state mutations
        if (isEditMode) {
          setLocalRuleset(JSON.parse(JSON.stringify(selectedRuleset)));
        } else {
          setLocalRuleset(selectedRuleset);
        }
      } else {
        // this will trigger setInitialRulesetId in next render
        setInitialRulesetId();
      }
    } else if (rulesets.length) {
      setInitialRulesetId();
    } else {
      setLocalRuleset(null);
    }
  }, [rulesets, selectedRulesetId, isEditMode]);

  // Set initial ruleset ID when rulesets are loaded
  const setInitialRulesetId = () => {
    if (rulesets.length) {
      setSelectedRulesetId(rulesets[0]?.id);
    }
  };

  // Handle ruleset selection change
  const handleSelectedRulesetChange = (value: string) => {
    setSelectedRulesetId(parseInt(value));
  };

  // Create a new empty ruleset
  const handleAddNewRuleset = () => {
    const newRuleset: Ruleset = {
      id: Date.now(),
      name: `Rule Set ${rulesets.length}`,
      rules: [],
    };
    dispatch(addNewRuleset({ ruleset: newRuleset }));
    setSelectedRulesetId(newRuleset.id);
  };

  // Toggle between view and edit modes
  const handleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Create a copy of the current ruleset
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

  // Save changes to the current ruleset
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

  // Cancel editing and return to view mode
  const handleCancel = () => {
    handleEditMode();
  };

  // Delete the current ruleset
  const handleDelete = () => {
    if (selectedRulesetId) {
      dispatch(deleteRuleSet(selectedRulesetId));
      handleEditMode();
    }
  };

  // Render either edit mode or view mode based on state
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
