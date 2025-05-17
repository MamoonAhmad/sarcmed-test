import React, { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Rule, Ruleset } from "@/types/rules";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableRuleRow from "./SortableRuleRow";

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLocalRuleset((prev) => {
        const oldIndex = prev.rules.findIndex((rule) => rule.id === active.id);
        const newIndex = prev.rules.findIndex((rule) => rule.id === over.id);
        
        return {
          ...prev,
          rules: arrayMove(prev.rules, oldIndex, newIndex),
        };
      });
    }
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
            <TableHead className="w-[50px]"></TableHead>
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
                colSpan={8}
                className="text-center text-muted-foreground py-8"
              >
                No Rules Found For This Ruleset
              </TableCell>
            </TableRow>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localRuleset.rules.map((rule) => rule.id)}
                strategy={verticalListSortingStrategy}
              >
                {localRuleset.rules.map((rule, i) => (
                  <SortableRuleRow
                    key={rule.id}
                    rule={rule}
                    index={i + 1}
                    isEditing={editingRuleIds.has(rule.id)}
                    onEdit={handleEditRule}
                    onDelete={handleRuleDelete}
                    onUpdate={handleRuleUpdate}
                    onSave={handleSaveRule}
                  />
                ))}
              </SortableContext>
            </DndContext>
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