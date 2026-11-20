output.tickets = {
  fareProduct: fareProduct,
  toPayment: 'goToPaymentButton',
  offerPrice: 'offerTotalPriceText',
  selectTraveller: 'selectTravellerButton',
  selectedTravellers: 'selectedTravellers',
  counter: counter,
  selectZones: 'selectZonesButton',
  selectedZone: 'selectedZone',
  searchFrom: 'searchFromButton',
  searchTo: 'searchToButton',
  fareZone: fareZone,
  saveZones: 'saveZonesButton',
  summary: {
    choosePayment: 'choosePaymentMethodButton',
    recurringPayment: recurringPayment,
    confirmPayment: 'confirmButton',
    selectedPayment: 'paymentSelectionItem',
    confirmPurchase: 'confirmPaymentButton',
  },
  ticket: ticket,
};

output.ticket = {
  valid: 'validTicket',
  productName: 'productName',
  details: details,
  mobileToken: 'mobileTokenBarcode',
};

function fareProduct(type) {
  return type + 'FareProduct';
}

function counter(profile, action) {
  return 'counterInput_' + profile + '_' + action;
}

function fareZone(name) {
  return 'fareZone' + name + 'Button';
}

function recurringPayment(index) {
  return 'recurringPayment' + index;
}

function ticket(index) {
  return 'ticket' + index;
}

function details(index) {
  return 'ticket' + index + 'Details';
}
