import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadRuleSets } from '../store/rulesSlice';
import RulesViewMode from './RulesetViewMode';
import RulesEditMode from './RulesetEditMode';
import mockData from '../data/mockRules.json';

const Rules = () => {
  const dispatch = useDispatch();
  const { isEditMode } = useSelector((state) => state.rules);

  useEffect(() => {
    dispatch(loadRuleSets(mockData));
  }, [dispatch]);

  return isEditMode ? <RulesEditMode /> : <RulesViewMode />;
};

export default Rules; 