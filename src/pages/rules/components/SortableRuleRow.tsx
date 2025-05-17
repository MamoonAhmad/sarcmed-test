import React from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Rule } from "@/types/rules";
import RuleEditRow from "./RuleEditRow";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Props interface for the SortableRuleRow component
 */
interface SortableRuleRowProps {
  rule: Rule;
  index: number;
  isEditing: boolean;
  onEdit: (ruleId: number) => void;
  onDelete: (ruleId: number) => void;
  onUpdate: (ruleId: number, updates: Partial<Rule>) => void;
  onSave: (ruleId: number) => void;
}

/**
 * Sortable table row component that wraps the RuleEditRow
 * Handles drag and drop functionality for reordering rules
 */
const SortableRuleRow: React.FC<SortableRuleRowProps> = ({
  rule,
  index,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onSave,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[50px] cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4" />
      </TableCell>
      {isEditing ? (
        <RuleEditRow
          rule={rule}
          onUpdate={onUpdate}
          onSave={() => onSave(rule.id)}
          onDelete={onDelete}
          index={index}
        />
      ) : (
        <>
          <TableCell>{index}</TableCell>
          <TableCell className="text-center">{rule.measurement}</TableCell>
          <TableCell>
            {rule.comparator === "not present" ? "is" : rule.comparator}
          </TableCell>
          <TableCell>
            {rule.comparator === "not present"
              ? "Not Present"
              : `${rule.comparedValue} ${rule.unitName}`}
          </TableCell>
          <TableCell>{rule.findingName}</TableCell>
          <TableCell className="font-semibold">Select "{rule.action}"</TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <Button onClick={() => onEdit(rule.id)} variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button onClick={() => onDelete(rule.id)} variant="ghost" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default SortableRuleRow; 