import {translation as _} from '../../commons';

const PaymentOptionsTexts = {
  header: {
    title: _('Betalingsmåter', 'Payment options'),
  },
  noStoredCards: _(
    'Du har ingen lagrede betalingmåter.',
    'You have no stored payment options.',
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
    deleteCardIcon: (paymentName: string, masked_pan: string) =>
      _(
        `Aktiver for å fjerne ${paymentName} som slutter på ${masked_pan}`,
        `Activate to remove ${paymentName} ending in ${masked_pan}`,
      ),
  },
};

export default PaymentOptionsTexts;
