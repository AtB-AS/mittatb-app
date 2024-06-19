import {TravelRightDirection} from '../../types';

export const periodBoatTravelRight = {
  startDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // in 10 days
  direction: TravelRightDirection.Both,
  usageValidityPeriodRef: '',
  type: 'PeriodBoatTicket',
  userProfileRef: 'ATB:UserProfile:8ee842e3',
  authorityRef: 'ATB:Authority:2',
  fareProductRef: 'ATB:PreassignedFareProduct:fadc1d66',
  id: 'ATB:CustomerPurchasePackage:38cb4739-aae5-47f2-a752-6882b9bf02c6',
  startPointRef: 'NSR:StopPlace:74007',
  status: 5,
  endPointRef: 'NSR:StopPlace:37539',
  customerAccountId: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
};
