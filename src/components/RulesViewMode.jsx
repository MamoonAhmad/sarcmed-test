import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleEditMode, copyRuleset, setSelectedRuleset } from '../store/rulesSlice';
import { Pencil, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const RulesViewMode = () => {
  const dispatch = useDispatch();
  const { rulesets, selectedRulesetId } = useSelector((state) => state.rules);
  const selectedRuleset = rulesets.find(rs => rs.id === selectedRulesetId);

  const handleEditMode = () => {
    dispatch(toggleEditMode());
  };

  const handleCopyRuleset = () => {
    dispatch(copyRuleset());
  };

  const handleRulesetChange = (value) => {
    dispatch(setSelectedRuleset(parseInt(value)));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Select value={selectedRulesetId?.toString()} onValueChange={handleRulesetChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a ruleset" />
          </SelectTrigger>
          <SelectContent>
            {rulesets.map(ruleset => (
              <SelectItem key={ruleset.id} value={ruleset.id.toString()}>
                {ruleset.name}
              </SelectItem>
            ))}
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
            <TableHead>Measurement Name</TableHead>
            <TableHead>Comparator</TableHead>
            <TableHead>Compared Value</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Finding Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedRuleset?.rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.measurement}</TableCell>
              <TableCell>{rule.comparator}</TableCell>
              <TableCell>{rule.comparedValue}</TableCell>
              <TableCell>{rule.unitName}</TableCell>
              <TableCell>{rule.findingName}</TableCell>
              <TableCell>{rule.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RulesViewMode; 