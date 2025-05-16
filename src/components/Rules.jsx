import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleEditMode,
  addNewRule,
  updateRule,
  deleteRule,
  addNewRuleset,
  copyRuleset,
  deleteRuleset,
  setSelectedRuleset
} from '../store/rulesSlice';
import { Pencil, Trash2, Plus, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const Rules = () => {
  const dispatch = useDispatch();
  const { rulesets, selectedRulesetId, isEditMode } = useSelector((state) => state.rules);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const selectedRuleset = rulesets.find(rs => rs.id === selectedRulesetId);

  const handleEditMode = () => {
    dispatch(toggleEditMode());
  };

  const handleAddNewRule = () => {
    dispatch(addNewRule());
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };

  const handleCopyRuleset = () => {
    dispatch(copyRuleset());
  };

  const handleDeleteRuleset = () => {
    dispatch(deleteRuleset());
  };

  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    dispatch(toggleEditMode());
    setShowConfirmDialog(false);
  };

  const handleRuleUpdate = (ruleId, updates) => {
    dispatch(updateRule({
      rulesetId: selectedRulesetId,
      ruleId,
      updates
    }));
  };

  const handleRuleDelete = (ruleId) => {
    dispatch(deleteRule({
      rulesetId: selectedRulesetId,
      ruleId
    }));
  };

  const handleRulesetChange = (e) => {
    if (e.target.value === 'new') {
      dispatch(addNewRuleset());
    } else {
      dispatch(setSelectedRuleset(e.target.value));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedRulesetId}
          onChange={handleRulesetChange}
          className="border rounded p-2"
        >
          {rulesets.map(ruleset => (
            <option key={ruleset.id} value={ruleset.id}>
              {ruleset.name}
            </option>
          ))}
          <option value="new">+Add New Ruleset</option>
        </select>

        <div className="space-x-2">
          {!isEditMode ? (
            <>
              <Button onClick={handleEditMode} variant="default">
                <Pencil className="w-4 h-4" />
                Edit Rules
              </Button>
              <Button onClick={handleCopyRuleset} variant="secondary">
                <Copy className="w-4 h-4" />
                Copy Ruleset
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
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
            {isEditMode && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedRuleset?.rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={rule.measurementName}
                    onChange={(e) => handleRuleUpdate(rule.id, { measurementName: e.target.value })}
                  />
                ) : (
                  rule.measurementName
                )}
              </TableCell>
              <TableCell>
                {isEditMode ? (
                  <select
                    value={rule.comparator}
                    onChange={(e) => handleRuleUpdate(rule.id, { comparator: e.target.value })}
                    className="w-full p-1 border rounded"
                  >
                    <option value="is">is</option>
                    <option value=">=">{">="}</option>
                    <option value="<">{"<"}</option>
                  </select>
                ) : (
                  rule.comparator
                )}
              </TableCell>
              <TableCell>
                {isEditMode ? (
                  rule.comparator === 'is' ? (
                    <Input
                      type="text"
                      value="Not Present"
                      disabled
                      className="bg-muted"
                    />
                  ) : (
                    <Input
                      type="number"
                      value={rule.comparedValue}
                      onChange={(e) => handleRuleUpdate(rule.id, { comparedValue: e.target.value })}
                    />
                  )
                ) : (
                  rule.comparedValue
                )}
              </TableCell>
              <TableCell>
                {isEditMode && rule.comparator !== 'is' ? (
                  <Input
                    type="text"
                    value={rule.unit}
                    onChange={(e) => handleRuleUpdate(rule.id, { unit: e.target.value })}
                  />
                ) : (
                  rule.unit
                )}
              </TableCell>
              <TableCell>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={rule.findingName}
                    onChange={(e) => handleRuleUpdate(rule.id, { findingName: e.target.value })}
                  />
                ) : (
                  rule.findingName
                )}
              </TableCell>
              <TableCell>
                {isEditMode ? (
                  <select
                    value={rule.action}
                    onChange={(e) => handleRuleUpdate(rule.id, { action: e.target.value })}
                    className="w-full p-1 border rounded"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Reflux">Reflux</option>
                  </select>
                ) : (
                  rule.action
                )}
              </TableCell>
              {isEditMode && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleRuleDelete(rule.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Cancel</h3>
            <p className="mb-4">Are you sure you want to cancel? All unsaved changes will be lost.</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
              >
                No, Continue Editing
              </Button>
              <Button
                onClick={handleConfirmCancel}
                variant="destructive"
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules; 