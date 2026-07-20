import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  enableSecureFlag(): void;
  disableSecureFlag(): void;
}

export const NativeSecureFlag = TurboModuleRegistry.get<Spec>(
  'SecureFlag',
) as Spec;
