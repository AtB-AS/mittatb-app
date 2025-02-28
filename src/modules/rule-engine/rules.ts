type RuleValue = string | number | boolean | null;

export type RuleVariables = {
  [key: string]: RuleValue | RuleValue[];
};

export type Rule = {
  variable: string; // key of RuleVariables
  operator: RuleOperator;
  value: RuleValue;
  groupId?: string;
};

export enum RuleOperator {
  equalTo = 'equalTo',
  notEqualTo = 'notEqualTo',
  greaterThan = 'greaterThan',
  lessThan = 'lessThan',
  greaterThanOrEqualTo = 'greaterThanOrEqualTo',
  lessThanOrEqualTo = 'lessThanOrEqualTo',
  contains = 'contains',
  notContains = 'notContains',
  onlyContains = 'onlyContains',
}

export const checkRules = (
  rules: Rule[],
  localVariables: RuleVariables,
): boolean => {
  // Verify that all ungrouped rules pass
  const ungroupedRules = rules.filter((rule) => rule.groupId === undefined);
  const allOfUngrouped = ungroupedRules.every((rule) =>
    checkRule(rule, localVariables),
  );
  if (!allOfUngrouped) return false;

  // Verify that groups pass one of their rules
  const uniqueGroups = new Set<String>();
  rules.forEach((rule) => {
    if (rule.groupId) uniqueGroups.add(rule.groupId);
  });
  for (const groupId of uniqueGroups) {
    const groupRules = rules.filter((rule) => rule.groupId === groupId);
    const oneOfRuleInGroup = groupRules.find((rule) =>
      checkRule(rule, localVariables),
    );
    if (!oneOfRuleInGroup) return false;
  }
  return true;
};

const checkRule = (
  globalMessageRule: Rule,
  localVariables: RuleVariables,
): boolean => {
  const {
    operator,
    value: ruleValue,
    variable: variableName,
  } = globalMessageRule;
  if (!(variableName in localVariables)) return false;
  const localValue = localVariables[variableName];
  switch (operator) {
    case RuleOperator.equalTo:
      if (
        ['string', 'number', 'boolean'].includes(typeof localValue) ||
        localValue === null
      )
        return localValue === ruleValue;
      return false;
    case RuleOperator.notEqualTo:
      if (
        ['string', 'number', 'boolean'].includes(typeof localValue) ||
        localValue === null
      )
        return localValue !== ruleValue;
      return false;
    case RuleOperator.greaterThan:
      if (
        ['string', 'number'].includes(typeof localValue) &&
        ['string', 'number'].includes(typeof ruleValue)
      )
        return (localValue as string | number) > (ruleValue as string | number);
      return false;
    case RuleOperator.lessThan:
      if (
        ['string', 'number'].includes(typeof localValue) &&
        ['string', 'number'].includes(typeof ruleValue)
      )
        return (localValue as string | number) < (ruleValue as string | number);
      return false;
    case RuleOperator.greaterThanOrEqualTo:
      if (
        ['string', 'number'].includes(typeof localValue) &&
        ['string', 'number'].includes(typeof ruleValue)
      )
        return (
          (localValue as string | number) >= (ruleValue as string | number)
        );
      return false;
    case RuleOperator.lessThanOrEqualTo:
      if (
        ['string', 'number'].includes(typeof localValue) &&
        ['string', 'number'].includes(typeof ruleValue)
      )
        return (
          (localValue as string | number) <= (ruleValue as string | number)
        );
      return false;
    case RuleOperator.contains:
      if (Array.isArray(localValue)) return localValue.includes(ruleValue);
      return false;
    case RuleOperator.notContains:
      if (Array.isArray(localValue)) return !localValue.includes(ruleValue);
      return false;
    case RuleOperator.onlyContains:
      if (Array.isArray(localValue))
        return localValue.every((v) => v === ruleValue);
      return false;
    default:
      return false;
  }
};
