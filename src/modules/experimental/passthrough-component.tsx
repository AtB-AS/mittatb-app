import {isExperimentalEnabled} from './is-experimental-enabled';

type PassthroughComponentProps = React.PropsWithChildren<any>;

const isExperimental = isExperimentalEnabled();

export const PassthroughComponent: React.FC<PassthroughComponentProps> = ({
  children,
}) => {
  return children;
};

export const wrapWithPassthroughComponent = <T extends any>(
  component: React.FC<T>,
): React.FC<T> => {
  return isExperimental ? component : (PassthroughComponent as React.FC<T>);
};
