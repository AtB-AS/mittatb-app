import {isExperimentalEnabled} from './is-experimental-enabled';

const isExperimental = isExperimentalEnabled();

export const NullComponent: React.FC<any> = () => {
  return null;
};

export const wrapWithNullComponent = <T extends any>(
  component: React.FC<T>,
): React.FC<T> => {
  return isExperimental ? component : (NullComponent as React.FC<T>);
};
