import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  isNonProductionReleaseChannel(): boolean;
}

export const ExperimentalFeature = TurboModuleRegistry.getEnforcing<Spec>(
  'ExperimentalFeature',
);
