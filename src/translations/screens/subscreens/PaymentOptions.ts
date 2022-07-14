import {translation as _} from '../../commons';

const PaymentOptionsTexts = {
  header: {
    title: _('Betalingsmåter', 'Payment options'),
  },
  noStoredCards: _(
    'Du har ingen lagrede betalingmåter.',
    'You have no stored payment options.',
  ),
  genericError: _(
    'Det oppstod en feil. Vennligst prøv igjen.',
    'An error occured. Please try again.',
  ),
  deleteModal: {
    title: _('Fjerne betalingsmåte?', 'Delete payment option?'),
    message: _(
      'Sikker på at du vil fjerne denne betalingsmåten?',
      'Are you sure you want to remove this payment option?',
    ),
    confirmButton: _('Fjern', 'Remove'),
    cancelButton: _('Avbryt', 'Cancel'),
  },
  a11y: {
    cardInfo: (paymentName: string, masked_pan: string) =>
      _(
        `${paymentName} som slutter på ${masked_pan}`,
        `${paymentName} ending in ${masked_pan}`,
      ),
    deleteCardIcon: (paymentName: string, masked_pan: string) =>
      _(
        `Aktiver for å fjerne ${paymentName} som slutter på ${masked_pan}`,
        `Activate to remove ${paymentName} ending in ${masked_pan}`,
      ),
  },
};

export default PaymentOptionsTexts;
