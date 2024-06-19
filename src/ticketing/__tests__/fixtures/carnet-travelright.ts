export const carnetTravelRight = {
  startDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
  usedAccesses: [
    {
      startDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 21 days ago
      endDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
    },
    {
      startDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11), // 11 days ago
      endDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    },
    {
      startDateTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      endDateTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    },
  ],
  status: 5,
  usageValidityPeriodRef: '',
  type: 'CarnetTicket',
  fareZoneRefs: ['ATB:FareZone:10'],
  numberOfUsedAccesses: 3,
  userProfileRef: 'ATB:UserProfile:8ee842e3',
  authorityRef: 'ATB:Authority:2',
  tariffZoneRefs: ['ATB:TariffZone:1'],
  fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
  id: 'ATB:CustomerPurchasePackage:10185f96-ef65-43f9-b3b5-b7a9a4c7f48d',
  maximumNumberOfAccesses: 10,
  customerAccountId: 'ATB:CustomerAccount:Qw3fhcJudvgCYR7yHScbFd1mPtP2',
};
