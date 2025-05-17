import React from "react";
import { Pencil, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Ruleset } from "@/types/rules";

/**
 * Props interface for the RulesetViewMode component
 */
interface RulesetViewModeProps {
  rulesets: Ruleset[];
  selectedRulesetId: number | null;
  onSelectedRulesetChange: (value: string) => void;
  onEditMode: () => void;
  onCopyRuleset: () => void;
  onAddNewRuleset: () => void
}

/**
 * Component for viewing rulesets in a read-only format
 * Displays rules in a table and provides options to edit, copy, or create new rulesets
 */
const RulesetViewMode: React.FC<RulesetViewModeProps> = ({
  rulesets,
  selectedRulesetId,
  onSelectedRulesetChange,
  onEditMode,
  onCopyRuleset,
  onAddNewRuleset
}) => {
  const selectedRuleset = rulesets.find((rs) => rs.id === selectedRulesetId);

  // Convert internal comparator value to display format
  const getDisplayComparator = (comparator: string): string => {
    return comparator === "not present" ? "is" : comparator;
  };

  // Format the compared value and unit for display
  const getDisplayComparedValue = (
    comparator: string,
    comparedValue: number,
    unitName: string
  ): string => {
    if (comparator === "not present") {
      return "Not Present";
    }
    return unitName ? `${comparedValue} ${unitName}` : comparedValue.toString();
  };

  // Handle ruleset selection or creation
  const onChange = (value: string) => {
    if(value === "new") {
      onAddNewRuleset();
    } else {
      onSelectedRulesetChange(value);
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Ruleset selection and action buttons */}
      <div className="flex justify-between items-center mb-4">
        <Select
          value={selectedRulesetId?.toString()}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a ruleset" />
          </SelectTrigger>
          <SelectContent>
            {rulesets.map((ruleset) => (
              <SelectItem key={ruleset.id} value={ruleset.id.toString()}>
                {ruleset.name}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value="new" className="text-primary">
              New Ruleset
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Action buttons for selected ruleset */}
        {selectedRuleset ? (
          <div className="space-x-2">
            <Button onClick={onEditMode} variant="default">
              <Pencil className="w-4 h-4" />
              Edit Rules
            </Button>
            <Button onClick={onCopyRuleset} variant="secondary">
              <Copy className="w-4 h-4" />
              Copy Ruleset
            </Button>
          </div>
        ) : null}
      </div>

      {/* Display ruleset content or empty state */}
      {!selectedRuleset ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <h3 className="text-lg font-semibold mb-2">No Ruleset Selected</h3>
          <p className="text-muted-foreground">
            Select a ruleset from the dropdown or create a new one to view its
            rules.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead colSpan={3} className={"text-center"}>
                Measurement Conditions
              </TableHead>
              <TableHead>Finding Name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedRuleset?.rules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No Rules Found For This Ruleset
                </TableCell>
              </TableRow>
            ) : (
              selectedRuleset?.rules.map((rule, i) => (
                <TableRow key={rule.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className={"text-center"}>
                    {rule.measurement}
                  </TableCell>
                  <TableCell>{getDisplayComparator(rule.comparator)}</TableCell>
                  <TableCell>
                    {getDisplayComparedValue(
                      rule.comparator,
                      rule.comparedValue,
                      rule.unitName
                    )}
                  </TableCell>
                  <TableCell>{rule.findingName}</TableCell>
                  <TableCell className="font-semibold">Select "{rule.action}"</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RulesetViewMode;
