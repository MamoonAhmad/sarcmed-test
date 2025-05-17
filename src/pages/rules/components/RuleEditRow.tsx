import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { Rule } from "@/types/rules";

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
    <>
      <TableCell>{index}</TableCell>
      <TableCell className="text-center">
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
    </>
  );
};

export default RuleEditRow; 