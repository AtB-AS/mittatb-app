import React from 'react';
import {useFeatureTogglesContext} from '../feature-toggles';
import {isExperimentalEnabled} from './is-experimental-enabled';

const isExperimental = isExperimentalEnabled();

const NullComponent: React.FC<any> = () => {
  return null;
};

const ExperimentalFeatureToggledComponent: React.FC<
  React.PropsWithChildren
> = ({children}) => {
  const {isExperimentalFeaturesEnabled} = useFeatureTogglesContext();
  return isExperimentalFeaturesEnabled ? children : null;
};

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
