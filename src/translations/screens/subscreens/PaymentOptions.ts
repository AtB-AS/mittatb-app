import {translation as _} from '../../commons';

const PaymentOptionsTexts = {
  header: {
    title: _('Betalingsmåter', 'Payment options', 'Betalingsmåtar'),
  },
  noStoredCards: _(
    'Du har ingen lagrede betalingmåter.',
    'You have no stored payment options.',
    'Du har ingen lagra betalingsmåtar.',
  ),
  genericError: _(
    'Det oppstod en feil. Vennligst prøv igjen.',
    'An error occurred. Please try again.',
    'Det oppstod ein feil. Ver venleg og prøv igjen.',
  ),
  deleteModal: {
    title: _(
      'Fjerne betalingsmåte?',
      'Delete payment option?',
      'Fjerne betalingsmåte?',
    ),
    message: _(
      'Sikker på at du vil fjerne denne betalingsmåten?',
      'Are you sure you want to remove this payment option?',
      'Er du sikker på at du vil fjerne denne betalingsmetoden?',
    ),
    confirmButton: _('Fjern', 'Remove', 'Fjern'),
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
};

export default PaymentOptionsTexts;
