import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  startPayment(price: number, onComplete: (success: boolean) => void): void;
}

export const NativePaymentHandler = TurboModuleRegistry.get<Spec>(
  'PaymentHandler',
) as Spec;
