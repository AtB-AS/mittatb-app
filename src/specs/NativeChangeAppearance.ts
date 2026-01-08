import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  changeAppearance(mode: string | null): void;
}

export const ChangeAppearance = TurboModuleRegistry.getEnforcing<Spec>(
  'ChangeAppearanceSpec',
);
