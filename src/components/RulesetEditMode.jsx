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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const RulesetEditMode = () => {
  const dispatch = useDispatch();
  const { rulesets, selectedRulesetId } = useSelector((state) => state.rules);
  const [localRuleset, setLocalRuleset] = useState(null);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
        comparator: "not present",
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
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteRuleSet(selectedRulesetId));
    dispatch(toggleEditMode());
    setShowDeleteDialog(false);
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    dispatch(toggleEditMode());
    setShowCancelDialog(false);
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
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    if (localRuleset) {
      dispatch(updateRuleSet({
        rulesetId: selectedRulesetId,
        updates: localRuleset
      }));
    }
    dispatch(toggleEditMode());
    setShowSaveDialog(false);
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
            <TableHead colSpan={3} className="text-center">
              Measurement Conditions
            </TableHead>
            <TableHead>Finding Name</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localRuleset.rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No Rules Found For This Ruleset
              </TableCell>
            </TableRow>
          ) : (
            localRuleset.rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.id}</TableCell>
                <TableCell className={"text-center"}>
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
                    <Select
                      value={getDisplayComparator(rule.comparator)}
                      onValueChange={(value) => handleComparatorChange(rule.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select comparator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="is">is</SelectItem>
                        <SelectItem value=">=">{">="}</SelectItem>
                        <SelectItem value="<">{"<"}</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={rule.action}
                      onValueChange={(value) => handleRuleUpdate(rule.id, { action: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Reflux">Reflux</SelectItem>
                      </SelectContent>
                    </Select>
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
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save all changes to this ruleset?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ruleset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ruleset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? All unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RulesetEditMode;
