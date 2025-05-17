import React, { useState } from "react";
import { X, Trash2, Pencil, Check, Plus } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Rule, Ruleset } from "../types/rules";

/**
 * Props interface for the RuleEditRow component
 */
interface RuleEditRowProps {
  rule: Rule;
  onUpdate: (ruleId: number, updates: Partial<Rule>) => void;
  onSave: () => void;
  onDelete: (ruleId: number) => void;
  index: number;
}

/**
 * Component for editing individual rules within a ruleset
 * Handles validation and updates for rule fields
 */
const RuleEditRow: React.FC<RuleEditRowProps> = ({ rule, onUpdate, onSave, onDelete, index }) => {
  const [errors, setErrors] = useState({
    measurement: "",
    findingName: "",
    comparedValue: "",
    unitName: "",
  });

  // Validate rule fields and set error messages
  const validateRule = (): boolean => {
    const newErrors = {
      measurement: "",
      findingName: "",
      comparedValue: "",
      unitName: "",
    };

    let isValid = true;

    if (!rule.measurement.trim()) {
      newErrors.measurement = "Measurement is required";
      isValid = false;
    }

    if (!rule.findingName.trim()) {
      newErrors.findingName = "Finding name is required";
      isValid = false;
    }

    if (rule.comparator !== "not present") {
      if (!rule.comparedValue) {
        newErrors.comparedValue = "Value is required";
        isValid = false;
      }
      if (!rule.unitName.trim()) {
        newErrors.unitName = "Unit is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Save rule if validation passes
  const handleSave = () => {
    if (validateRule()) {
      onSave();
    }
  };

  // Handle comparator change and update related fields
  const handleComparatorChange = (value: string) => {
    const updates: Partial<Rule> = {};
    if (value === "is") {
      updates.comparator = "not present";
      updates.comparedValue = -1;
      updates.unitName = "";
    } else {
      updates.comparator = value as Rule['comparator'];
      updates.comparedValue = 0;
    }
    onUpdate(rule.id, updates);
  };

  // Convert internal comparator value to display format
  const getDisplayComparator = (comparator: string): string => {
    return comparator === "not present" ? "is" : comparator;
  };

  return (
    <TableRow>
      <TableCell>{index}</TableCell>
      <TableCell className={"text-center"}>
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            value={rule.measurement}
            onChange={(e) => onUpdate(rule.id, { measurement: e.target.value })}
            className={errors.measurement ? "border-red-500" : ""}
          />
          {errors.measurement && (
            <span className="text-xs text-red-500">{errors.measurement}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={getDisplayComparator(rule.comparator)}
          onValueChange={handleComparatorChange}
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
      </TableCell>
      <TableCell>
        {rule.comparator === "not present" ? (
          <Input
            type="text"
            value="Not Present"
            disabled
            className="bg-muted w-full"
          />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Input
                type="number"
                value={rule.comparedValue}
                onChange={(e) =>
                  onUpdate(rule.id, {
                    comparedValue: parseInt(e.target.value),
                  })
                }
                className={`w-[100px] ${
                  errors.comparedValue ? "border-red-500" : ""
                }`}
              />
              <Input
                type="text"
                value={rule.unitName}
                onChange={(e) =>
                  onUpdate(rule.id, {
                    unitName: e.target.value,
                  })
                }
                placeholder="Unit"
                className={`w-[80px] ${
                  errors.unitName ? "border-red-500" : ""
                }`}
              />
            </div>
            {(errors.comparedValue || errors.unitName) && (
              <div className="flex flex-col gap-0.5">
                {errors.comparedValue && (
                  <span className="text-xs text-red-500">
                    {errors.comparedValue}
                  </span>
                )}
                {errors.unitName && (
                  <span className="text-xs text-red-500">
                    {errors.unitName}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            value={rule.findingName}
            onChange={(e) => onUpdate(rule.id, { findingName: e.target.value })}
            className={errors.findingName ? "border-red-500" : ""}
          />
          {errors.findingName && (
            <span className="text-xs text-red-500">{errors.findingName}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={rule.action}
          onValueChange={(value) => onUpdate(rule.id, { action: value as Rule['action'] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Reflux">Reflux</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button onClick={handleSave} variant="ghost" size="icon">
            <Check className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(rule.id)} variant="ghost" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

/**
 * Props interface for the RulesetEditMode component
 */
interface RulesetEditModeProps {
  ruleset: Ruleset;
  onSave: (ruleset: Ruleset) => void;
  onCancel: () => void;
  onDelete: () => void;
}

/**
 * Component for editing a ruleset
 * Manages the editing state of individual rules and provides UI for modifying ruleset properties
 */
const RulesetEditMode: React.FC<RulesetEditModeProps> = ({ ruleset, onSave, onCancel, onDelete }) => {
  const [localRuleset, setLocalRuleset] = useState<Ruleset>(ruleset);
  const [editingRuleIds, setEditingRuleIds] = useState<Set<number>>(new Set());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Update ruleset name
  const handleRulesetNameChange = (name: string) => {
    setLocalRuleset((prev) => ({
      ...prev,
      name,
    }));
  };

  // Update a rule's properties
  const handleRuleUpdate = (ruleId: number, updates: Partial<Rule>) => {
    setLocalRuleset((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
    }));
  };

  // Remove a rule from the ruleset
  const handleRuleDelete = (ruleId: number) => {
    setLocalRuleset((prev) => ({
      ...prev,
      rules: prev.rules.filter((rule) => rule.id !== ruleId),
    }));
    setEditingRuleIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(ruleId);
      return newSet;
    });
  };

  // Put a rule in edit mode
  const handleEditRule = (ruleId: number) => {
    setEditingRuleIds((prev) => new Set([...prev, ruleId]));
  };

  // Save a rule and remove it from edit mode
  const handleSaveRule = (ruleId: number) => {
    setEditingRuleIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(ruleId);
      return newSet;
    });
  };

  // Add a new empty rule to the ruleset
  const handleAddNewRule = () => {
    const newRule: Rule = {
      id: Date.now(),
      measurement: "",
      comparator: "not present",
      comparedValue: -1,
      findingName: "",
      action: "Normal",
      unitName: "",
    };
    setLocalRuleset((prev) => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
    setEditingRuleIds((prev) => new Set([...prev, newRule.id]));
  };

  // Show save confirmation dialog
  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  // Show delete confirmation dialog
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Show cancel confirmation dialog
  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  // Check if any rules are currently being edited
  const hasRulesInEditMode = editingRuleIds.size > 0;

  return (
    <div className="container mx-auto p-4">
      {/* Ruleset header with name input and action buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-full">
          <Input
            type="text"
            value={localRuleset.name}
            onChange={(e) => handleRulesetNameChange(e.target.value)}
            className="w-[280px]"
            placeholder="Ruleset Name"
          />
        </div>
        <div className="flex items-center gap-4 h-7">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    onClick={handleSaveClick}
                    variant="default"
                    disabled={hasRulesInEditMode}
                  >
                    Save Changes
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {hasRulesInEditMode
                  ? "Please save or cancel all rule edits before saving the ruleset"
                  : "Save all changes to the ruleset"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={handleCancelClick} variant="outline">
            <X className="w-4 h-4" />
            Cancel
          </Button>

          <Separator orientation="vertical" />

          <Button onClick={handleAddNewRule} variant="default">
            <Plus className="w-4 h-4" />
            Add New Rule
          </Button>

          <Button onClick={handleDeleteClick} variant="destructive">
            <Trash2 className="w-4 h-4" />
            Delete Ruleset
          </Button>
        </div>
      </div>

      {/* Rules table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead colSpan={3} className="text-center">
              Measurement Conditions
            </TableHead>
            <TableHead>Finding Name</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localRuleset.rules.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No Rules Found For This Ruleset
              </TableCell>
            </TableRow>
          ) : (
            localRuleset.rules.map((rule, i) =>
              editingRuleIds.has(rule.id) ? (
                <RuleEditRow
                  key={rule.id}
                  rule={rule}
                  onUpdate={handleRuleUpdate}
                  onSave={() => handleSaveRule(rule.id)}
                  onDelete={handleRuleDelete}
                  index={i + 1}
                />
              ) : (
                <TableRow key={rule.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className={"text-center"}>
                    {rule.measurement}
                  </TableCell>
                  <TableCell>
                    {rule.comparator === "not present" ? "is" : rule.comparator}
                  </TableCell>
                  <TableCell>
                    {rule.comparator === "not present"
                      ? "Not Present"
                      : `${rule.comparedValue} ${rule.unitName}`}
                  </TableCell>
                  <TableCell>{rule.findingName}</TableCell>
                  <TableCell>{rule.action}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditRule(rule.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
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
              )
            )
          )}
        </TableBody>
      </Table>

      {/* Confirmation dialogs */}
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
            <Button onClick={() => {
              setShowSaveDialog(false);
              onSave(localRuleset);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ruleset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ruleset? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              setShowDeleteDialog(false);
              onDelete();
            }}>
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
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={() => {
              setShowCancelDialog(false);
              onCancel();
            }}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RulesetEditMode;
