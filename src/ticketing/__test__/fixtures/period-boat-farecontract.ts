import {periodBoat} from './period-boat-travelright';

export const periodBoatFareContract = {
  paymentType: ['MASTERCARD'],
  eventTimestamp: {seconds: 1717146273, nanoseconds: 4296000},
  state: 2,
  purchasedBy: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  id: 'ATB:FareContract:8MTTWRI4-Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  totalAmount: '8361.00',
  version: '1',
  qrCode:
    'ChYKFBISGhANvqDoNVlNJqZxxTQcXpuiEkYKPzA9Ah0A1jaI46tFV5bNuVmhphKdGY+QestjJ9q52HG/4QIcT0/0ykhobiOB+zXaewI7Wf3sGHOxgcv2LZ3NIxoBTjAB',
  minimumSecurityLevel: -200,
  customerAccountId: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
  orderId: '8MTTWRI4',
  created: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
  travelRights: [periodBoat],
  paymentTypeGroup: ['PAYMENTCARD'],
  totalTaxAmount: '895.82',
};
