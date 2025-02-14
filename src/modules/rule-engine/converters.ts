import {Rule, RuleOperator} from './rules';
import {isArray} from 'lodash';

export function mapToRules(data: any): Rule[] {
  if (!isArray(data)) return [];
  return data.map((rule: any) => mapToRule(rule)).filter(Boolean) as Rule[];
}

export function mapToRule(data: any): Rule | undefined {
  if (typeof data !== 'object') return;

  const {variable, operator, value, groupId} = data;
  if (typeof variable !== 'string') return;
  if (!(operator in RuleOperator)) return;
  if (
    !(['string', 'number', 'boolean'].includes(typeof value) || value === null)
  )
    return;
  if (groupId !== undefined && typeof groupId !== 'string') return;

  return {variable, operator, value, groupId};
}
