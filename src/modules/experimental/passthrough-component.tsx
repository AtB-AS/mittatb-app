import {isExperimentalEnabled} from './is-experimental-enabled';

type PassthroughComponentProps = React.PropsWithChildren<any>;

const isExperimental = isExperimentalEnabled();

const PassthroughComponent: React.FC<PassthroughComponentProps> = ({
  children,
}) => {
  return children;
};

/**
 * Wraps a component with a passthrough component.
 * If the experimental feature is enabled on app start, the component will be returned as is.
 *
 * Else it will return the component wrapped in a passthrough component, which returns children as is (the passed in component will not be rendered).
 * This also means it cannot be overridden in the debug menu at runtime.
 */
export const wrapWithPassthroughComponent = <T extends any>(
  component: React.FC<T>,
): React.FC<T> => {
  return isExperimental ? component : (PassthroughComponent as React.FC<T>);
};
