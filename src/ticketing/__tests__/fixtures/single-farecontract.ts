import {singleTravelRight} from './single-travelright';

export const singleFareContract = {
  paymentType: ['MASTERCARD'],
  state: 2,
  purchasedBy: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  id: 'ATB:FareContract:1MNPXN7A-Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  totalAmount: '85.00',
  version: '1',
  qrCode:
    'ChYKFBISGhD21zmOb3NHrZqJ7Zp0kR/dEkUKPjA8Ahsup12ve5onG3q1++dKV8Ya/UJpDUNsOi3jsgoCHQCIDNWKPBObWQyrGgBr+yKIxPz94Au4rh++HtIMGgFOMAE=',
  customerAccountId: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  orderId: '1MNPXN7A',
  created: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
  travelRights: [
    {
      ...singleTravelRight,
      userProfileRef: 'ATB:UserProfile:8ee842e3',
      id: 'ATB:CustomerPurchasePackage:dbb29b35-2d4a-451f-a3ae-c4bb2f323c41',
    },
    {
      ...singleTravelRight,
      userProfileRef: 'ATB:UserProfile:d3e4ec09',
      id: 'ATB:CustomerPurchasePackage:d12aca63-79ee-488b-9a26-a17db1622d2c',
    },
    {
      ...singleTravelRight,
      userProfileRef: 'ATB:UserProfile:d3e4ec09',
      id: 'ATB:CustomerPurchasePackage:556ebc7d-6d55-4096-98fc-d5bf6243b36b',
    },
  ],
  totalTaxAmount: '9.11',
};
