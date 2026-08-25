output.tickets = {
    fareProduct: fareProduct,
    toPayment: 'goToPaymentButton',
    offerPrice: 'offerTotalPriceText',
    summary: {
        choosePayment: 'choosePaymentMethodButton',
        recurringPayment: recurringPayment,
        confirmPayment: 'confirmButton',
        selectedPayment: 'paymentSelectionItem',
        confirmPurchase: 'confirmPaymentButton',
    },
    ticket: ticket
}

output.ticket = {
    valid: 'validTicket',
    productName: 'productName',
    details: details,
    mobileToken: 'mobileTokenBarcode',
};

function fareProduct(type) {
    return type + 'FareProduct';
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