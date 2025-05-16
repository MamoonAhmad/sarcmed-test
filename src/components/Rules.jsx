import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadRules } from '../store/rulesSlice';
import RulesViewMode from './RulesViewMode';
import RulesEditMode from './RulesEditMode';
import mockData from '../data/mockRules.json';

const Rules = () => {
  const dispatch = useDispatch();
  const { isEditMode } = useSelector((state) => state.rules);

  useEffect(() => {
    dispatch(loadRules(mockData));
  }, [dispatch]);

  return isEditMode ? <RulesEditMode /> : <RulesViewMode />;
};

export default Rules; 