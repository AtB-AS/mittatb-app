import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  startPayment(
    items: {
      price: number;
      label: string;
    }[],
    onComplete: (paymentData: string | null) => void,
  ): void;
  canMakePayments(): boolean;
}

export const NativeApplePayHandler = TurboModuleRegistry.get<Spec>(
  'ApplePayHandler',
) as Spec;
