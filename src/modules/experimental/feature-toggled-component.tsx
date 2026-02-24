import React from 'react';
import {useIsExperimentalEnabled} from './use-is-experimental-enabled';

type FeatureToggleType =
  | 'render-children-if-disabled'
  | 'render-nothing-if-disabled';

type FeatureToggleComponentProps<TProps> = {
  featureToggleType: FeatureToggleType;
  Component: React.FC<React.PropsWithChildren<TProps>>;
  componentProps: React.PropsWithChildren<TProps>;
};

/**
 * A component that will only render its children if the experimental feature is enabled.
 * Can be overridden in the debug menu at runtime.
 */
const ExperimentalFeatureToggledComponent = <TProps extends {}>({
  componentProps,
  Component,
  featureToggleType,
}: FeatureToggleComponentProps<TProps>) => {
  const isExperimental = useIsExperimentalEnabled();
  if (isExperimental) {
    return <Component {...componentProps} />;
  }
  return featureToggleType === 'render-children-if-disabled'
    ? componentProps.children
    : null;
};

/**
 * Wraps a component with an experimental feature toggled component.
 * Can be overridden in the debug menu at runtime.
 */
export const wrapWithExperimentalFeatureToggledComponent = <T extends {}>(
  featureToggleType: FeatureToggleType,
  WrappedComponent: React.FC<T>,
): React.FC<T> => {
  return (props: T) => (
    <ExperimentalFeatureToggledComponent<T>
      featureToggleType={featureToggleType}
      Component={WrappedComponent}
      componentProps={props}
    />
  );
};
