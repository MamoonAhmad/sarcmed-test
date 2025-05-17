export interface Rule {
  id: number;
  measurement: string;
  comparator: 'not present' | '>=' | '<';
  comparedValue: number;
  findingName: string;
  action: 'Normal' | 'Reflux';
  unitName: string;
}

export interface Ruleset {
  id: number;
  name: string;
  rules: Rule[];
}

export interface RulesState {
  rulesets: Ruleset[];
}

export interface RootState {
  rules: RulesState;
} 