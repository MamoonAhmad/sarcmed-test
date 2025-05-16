import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleEditMode,
  updateRuleSet,
  deleteRuleSet,
} from "../store/rulesSlice";
import { Plus, X, Trash2, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const RulesEditMode = () => {
  const dispatch = useDispatch();
  const { rulesets, selectedRulesetId } = useSelector((state) => state.rules);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [localRuleset, setLocalRuleset] = useState(null);

  useEffect(() => {
    const selectedRuleset = rulesets.find((rs) => rs.id === selectedRulesetId);
    if (selectedRuleset) {
      setLocalRuleset(JSON.parse(JSON.stringify(selectedRuleset)));
    }
  }, [rulesets, selectedRulesetId]);

  const handleAddNewRule = () => {
    if (localRuleset) {
      const newRule = {
        id: localRuleset.rules.length + 1,
        measurement: "",
        comparator: "is",
        comparedValue: -1,
        findingName: "",
        action: "Normal",
        unitName: ""
      };
      setLocalRuleset({
        ...localRuleset,
        rules: [...localRuleset.rules, newRule]
      });
    }
  };

  const handleDeleteRuleset = () => {
    dispatch(deleteRuleSet(selectedRulesetId));
  };

  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    dispatch(toggleEditMode());
    setShowConfirmDialog(false);
  };

  const handleRuleUpdate = (ruleId, updates) => {
    if (localRuleset) {
      setLocalRuleset({
        ...localRuleset,
        rules: localRuleset.rules.map(rule => 
          rule.id === ruleId ? { ...rule, ...updates } : rule
        )
      });
    }
  };

  const handleRuleDelete = (ruleId) => {
    if (localRuleset) {
      setLocalRuleset({
        ...localRuleset,
        rules: localRuleset.rules.filter(rule => rule.id !== ruleId)
      });
    }
  };

  const handleRulesetNameChange = (e) => {
    if (localRuleset) {
      setLocalRuleset({
        ...localRuleset,
        name: e.target.value
      });
    }
  };

  const handleComparatorChange = (ruleId, value) => {
    const updates = {};
    if (value === "is") {
      updates.comparator = "not present";
      updates.comparedValue = -1;
      updates.unitName = "";
    } else {
      updates.comparator = value;
      updates.comparedValue = "";
    }
    handleRuleUpdate(ruleId, updates);
  };

  const getDisplayComparator = (comparator) => {
    return comparator === "not present" ? "is" : comparator;
  };

  const handleEditRule = (ruleId) => {
    setEditingRuleId(ruleId);
  };

  const handleSaveRule = () => {
    setEditingRuleId(null);
  };

  const handleSaveAllChanges = () => {
    if (localRuleset) {
      dispatch(updateRuleSet({
        rulesetId: selectedRulesetId,
        updates: localRuleset
      }));
    }
    dispatch(toggleEditMode());
  };

  if (!localRuleset) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={localRuleset.name}
            onChange={handleRulesetNameChange}
            className="w-[280px]"
            placeholder="Ruleset Name"
          />
        </div>

        <div className="space-x-2">
          <Button onClick={handleAddNewRule} variant="default">
            <Plus className="w-4 h-4" />
            Add New Rule
          </Button>
          <Button onClick={handleCancel} variant="outline">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={handleDeleteRuleset} variant="destructive">
            <Trash2 className="w-4 h-4" />
            Delete Ruleset
          </Button>
          <Button onClick={handleSaveAllChanges} variant="default">
            Save Changes
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Measurement</TableHead>
            <TableHead colSpan={2} className="text-center">
              Measurement Conditions
            </TableHead>
            <TableHead>Finding Name</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localRuleset.rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.id}</TableCell>
              <TableCell>
                {editingRuleId === rule.id ? (
                  <Input
                    type="text"
                    value={rule.measurement}
                    onChange={(e) =>
                      handleRuleUpdate(rule.id, { measurement: e.target.value })
                    }
                  />
                ) : (
                  rule.measurement
                )}
              </TableCell>
              <TableCell>
                {editingRuleId === rule.id ? (
                  <select
                    value={getDisplayComparator(rule.comparator)}
                    onChange={(e) =>
                      handleComparatorChange(rule.id, e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  >
                    <option value="is">is</option>
                    <option value=">=">{">="}</option>
                    <option value="<">{"<"}</option>
                  </select>
                ) : (
                  getDisplayComparator(rule.comparator)
                )}
              </TableCell>
              <TableCell>
                {editingRuleId === rule.id ? (
                  rule.comparator === "not present" ? (
                    <Input
                      type="text"
                      value="Not Present"
                      disabled
                      className="bg-muted w-full"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={rule.comparedValue}
                        onChange={(e) =>
                          handleRuleUpdate(rule.id, {
                            comparedValue: parseInt(e.target.value),
                          })
                        }
                        className="w-[100px]"
                      />
                      <Input
                        type="text"
                        value={rule.unitName}
                        onChange={(e) =>
                          handleRuleUpdate(rule.id, {
                            unitName: e.target.value,
                          })
                        }
                        placeholder="Unit"
                        className="w-[80px]"
                      />
                    </div>
                  )
                ) : rule.comparator === "not present" ? (
                  "Not Present"
                ) : (
                  `${rule.comparedValue} ${rule.unitName}`
                )}
              </TableCell>
              <TableCell>
                {editingRuleId === rule.id ? (
                  <Input
                    type="text"
                    value={rule.findingName}
                    onChange={(e) =>
                      handleRuleUpdate(rule.id, { findingName: e.target.value })
                    }
                  />
                ) : (
                  rule.findingName
                )}
              </TableCell>
              <TableCell>
                {editingRuleId === rule.id ? (
                  <select
                    value={rule.action}
                    onChange={(e) =>
                      handleRuleUpdate(rule.id, { action: e.target.value })
                    }
                    className="w-full p-1 border rounded"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Reflux">Reflux</option>
                  </select>
                ) : (
                  rule.action
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {editingRuleId === rule.id ? (
                    <Button
                      onClick={handleSaveRule}
                      variant="ghost"
                      size="icon"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEditRule(rule.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRuleDelete(rule.id)}
                    variant="ghost"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Cancel</h3>
            <p className="mb-4">
              Are you sure you want to cancel? All unsaved changes will be lost.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
              >
                No, Continue Editing
              </Button>
              <Button onClick={handleConfirmCancel} variant="destructive">
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesEditMode;
