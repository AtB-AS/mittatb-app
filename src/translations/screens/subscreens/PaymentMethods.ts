import {translation as _} from '../../commons';

const PaymentMethodsTexts = {
  header: {
    title: _('Betalingskort', 'Payment cards', 'Betalingskort'),
  },
  noStoredCards: _(
    'Du har ingen lagrede betalingskort.',
    'You have no stored payment cards.',
    'Du har ingen lagra betalingskort.',
  ),
  genericError: _(
    'Det oppstod en feil. Vennligst prøv igjen.',
    'An error occurred. Please try again.',
    'Det oppstod ein feil. Ver venleg og prøv igjen.',
  ),
  deleteModal: {
    title: _(
      'Fjerne betalingskort?',
      'Delete payment card?',
      'Fjerne betalingskort?',
    ),
    message: _(
      'Sikker på at du vil fjerne dette betalingskortet?',
      'Are you sure you want to remove this payment card?',
      'Er du sikker på at du vil fjerne dette betalingskortet?',
    ),
    confirmButton: _('Fjern kort', 'Remove card', 'Fjern kort'),
    cancelButton: _('Avbryt', 'Cancel', 'Avbryt'),
  },
  a11y: {
    cardInfo: (paymentName: string, masked_pan: string) =>
      _(
        `${paymentName} som slutter på ${masked_pan}`,
        `${paymentName} ending in ${masked_pan}`,
        `${paymentName} som sluttar på ${masked_pan}`,
      ),
    deleteCardIcon: (paymentName: string, masked_pan: string) =>
      _(
        `Aktiver for å fjerne ${paymentName} som slutter på ${masked_pan}`,
        `Activate to remove ${paymentName} ending in ${masked_pan}`,
        `Aktiver for å fjerne ${paymentName} som sluttar på ${masked_pan}`,
      ),
  },
  addPaymentMethod: _(
    'Legg til betalingskort',
    'Add payment card',
    'Legg til betalingskort',
  ),
  vippsInfo: _(
    'Betaling med Vipps er tilgjengelig ved kjøp av billett',
    'Payment with Vipps is available when purchasing a ticket',
    'Betaling med Vipps er tilgjengeleg ved kjøp av billett',
  ),
  editPaymentMethod: _('Endre', 'Edit', 'Endre'),
};

export default PaymentMethodsTexts;
