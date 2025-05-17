import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleEditMode,
  copyRuleset,
  setSelectedRuleset,
  addNewRuleset,
} from "../store/rulesSlice";
import { Pencil, Copy, Plus } from "lucide-react";
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

const RulesViewMode = () => {
  const dispatch = useDispatch();
  const { rulesets, selectedRulesetId } = useSelector((state) => state.rules);
  const selectedRuleset = rulesets.find((rs) => rs.id === selectedRulesetId);

  const handleEditMode = () => {
    dispatch(toggleEditMode());
  };

  const handleCopyRuleset = () => {
    dispatch(copyRuleset());
  };

  const handleRulesetChange = (value) => {
    if (value === "new") {
      dispatch(addNewRuleset());
    } else {
      dispatch(setSelectedRuleset(parseInt(value)));
    }
  };

  const getDisplayComparator = (comparator) => {
    return comparator === "not present" ? "is" : comparator;
  };

  const getDisplayComparedValue = (comparator, comparedValue, unitName) => {
    if (comparator === "not present") {
      return "Not Present";
    }
    return unitName ? `${comparedValue} ${unitName}` : comparedValue;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Select
          value={selectedRulesetId?.toString()}
          onValueChange={handleRulesetChange}
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
              <Plus className="w-4 h-4" />
              New Ruleset
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="space-x-2">
          <Button onClick={handleEditMode} variant="default">
            <Pencil className="w-4 h-4" />
            Edit Rules
          </Button>
          <Button onClick={handleCopyRuleset} variant="secondary">
            <Copy className="w-4 h-4" />
            Copy Ruleset
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead colSpan={3} className={"text-center"}>Measurement Conditions</TableHead>
            <TableHead>Finding Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedRuleset?.rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No Rules Found For This Ruleset
              </TableCell>
            </TableRow>
          ) : (
            selectedRuleset?.rules.map((rule, i) => (
              <TableRow key={rule.id}>
                <TableCell>{i+1}</TableCell>
                <TableCell className={"text-center"}>{rule.measurement}</TableCell>
                <TableCell>{getDisplayComparator(rule.comparator)}</TableCell>
                <TableCell>
                  {getDisplayComparedValue(
                    rule.comparator,
                    rule.comparedValue,
                    rule.unitName
                  )}
                </TableCell>
                <TableCell>{rule.findingName}</TableCell>
                <TableCell>{rule.action}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RulesViewMode;
