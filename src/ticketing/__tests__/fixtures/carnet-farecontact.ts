import {carnetTravelRight} from './carnet-travelright';

export const carnetFareContract = {
  paymentType: ['MASTERCARD'],
  state: 2,
  purchasedBy: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  id: 'ATB:FareContract:E69J9NJH-Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  totalAmount: '430.00',
  version: '1',
  qrCode:
    'ChYKFBISGhBioVl1qEVO/6iNfWGTutfhEkYKPzA9AhxHUC0xlHwngf3rC7SJnzaH1wme48tOIjRWjS8mAh0AxfqUUU6iO6eA8JnbSxKtZCD3nFJQSRuqJqMx1RoBTjAB',
  customerAccountId: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  orderId: 'E69J9NJH',
  created: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
  travelRights: [carnetTravelRight],
  totalTaxAmount: '46.07',
};
