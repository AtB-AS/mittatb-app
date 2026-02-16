import React from 'react';
import {
  isExperimentalEnabled,
  useIsExperimentalEnabled,
} from './is-experimental-enabled';

const isExperimental = isExperimentalEnabled();

const NullComponent: React.FC<any> = () => {
  return null;
};

/**
 * A component that will only render its children if the experimental feature is enabled.
 * Can be overridden in the debug menu at runtime.
 */
const ExperimentalFeatureToggledComponent: React.FC<
  React.PropsWithChildren
> = ({children}) => {
  const isExperimental = useIsExperimentalEnabled();
  return isExperimental ? children : null;
};

/**
 * Wraps a component with an experimental feature toggled component.
 * If the experimental feature is enabled on app start, the component will be wrapped with an experimental feature toggled component.
 *
 * Else it will return a null component. In that case it cannot be overridden in the debug menu at runtime.
 */
export const wrapWithExperimentalFeatureToggledComponent = <T extends {}>(
  WrappedComponent: React.FC<T>,
): React.FC<T> => {
  return isExperimental
    ? (props: T) => (
        <ExperimentalFeatureToggledComponent>
          <WrappedComponent {...props} />
        </ExperimentalFeatureToggledComponent>
      )
    : (NullComponent as React.FC<T>);
};
