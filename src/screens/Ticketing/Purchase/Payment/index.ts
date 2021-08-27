export {default as CreditCard} from './CreditCard';
export {default as Vipps} from './Vipps';
export {default as SelectCreditCard} from './SelectCreditCard'

export type PaymentOptionType = {
  type: string,
  id?: string,
  save?: boolean,
  description: string,
  accessibilityHint: string,
}
