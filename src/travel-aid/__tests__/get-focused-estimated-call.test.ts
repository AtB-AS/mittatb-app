import {
  TravelAidStatus,
  getFocusedEstimatedCall,
} from '../get-focused-estimated-call';

const onGoingJourney: any[] = [
  {
    aimedDepartureTime: '2024-10-18T12:15:00+02:00',
    actualArrivalTime: '2024-10-18T12:15:14+02:00',
    actualDepartureTime: '2024-10-18T12:15:14+02:00',
    realtime: true,
    quay: {id: 'NSR:Quay:102721', name: 'Østre Lund'},
  },
  {
    aimedDepartureTime: '2024-10-18T12:17:00+02:00',
    actualArrivalTime: undefined,
    actualDepartureTime: undefined,
    realtime: true,
    quay: {id: 'NSR:Quay:74027', name: 'Kattemsenteret'},
  },
];
describe('getFocusedEstimatedCall for ongoing journey', () => {
  it('next stop is Kattemsenteret', () => {
    const focus = getFocusedEstimatedCall(onGoingJourney, 0);
    expect(focus.status).toBe(TravelAidStatus.BetweenStops);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Kattemsenteret');
  });
  it('has not yet arrived at Kattemsenteret', () => {
    const focus = getFocusedEstimatedCall(onGoingJourney, 1);
    expect(focus.status).toBe(TravelAidStatus.NotYetArrived);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Kattemsenteret');
  });
});

const notStartedJourney: any[] = [
  {
    aimedDepartureTime: '2024-10-18T12:15:00+02:00',
    actualArrivalTime: undefined,
    actualDepartureTime: undefined,
    realtime: true,
    quay: {id: 'NSR:Quay:102721', name: 'Østre Lund'},
  },
  {
    aimedDepartureTime: '2024-10-18T12:17:00+02:00',
    actualArrivalTime: undefined,
    actualDepartureTime: undefined,
    realtime: true,
    quay: {id: 'NSR:Quay:74027', name: 'Kattemsenteret'},
  },
];
describe('getFocusedEstimatedCall for not started journey', () => {
  it('state is not-yet-arrived', () => {
    // Set current time to five minutes before first aimedDepartureTime
    jest.useFakeTimers().setSystemTime(new Date('2024-10-18T12:10:00+02:00'));
    const focus = getFocusedEstimatedCall(notStartedJourney, 0);

    expect(focus.status).toBe(TravelAidStatus.NotYetArrived);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Østre Lund');
  });

  it('state is not-getting-updates', () => {
    // Set current time to five minutes after first aimedDepartureTime
    jest.useFakeTimers().setSystemTime(new Date('2024-10-18T12:20:00+02:00'));

    const focus = getFocusedEstimatedCall(notStartedJourney, 0);
    expect(focus.status).toBe(TravelAidStatus.NotGettingUpdates);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Østre Lund');
  });
});

const endedJourney: any[] = [
  {
    aimedDepartureTime: '2024-10-18T12:15:00+02:00',
    actualArrivalTime: '2024-10-18T12:15:14+02:00',
    actualDepartureTime: '2024-10-18T12:15:14+02:00',
    realtime: true,
    quay: {id: 'NSR:Quay:102721', name: 'Østre Lund'},
  },
  {
    aimedDepartureTime: '2024-10-18T12:17:00+02:00',
    actualArrivalTime: '2024-10-18T12:16:48+02:00',
    actualDepartureTime: '2024-10-18T12:17:20+02:00',
    realtime: true,
    quay: {id: 'NSR:Quay:74027', name: 'Kattemsenteret'},
  },
];
describe('getFocusedEstimatedCall for ended journey', () => {
  it('end-of-line is Kattemsenteret', () => {
    const focus = getFocusedEstimatedCall(endedJourney, 0);
    expect(focus.status).toBe(TravelAidStatus.EndOfLine);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Kattemsenteret');
  });
});

const noRealtimeJourney: any[] = [
  {
    aimedDepartureTime: '2024-10-18T12:15:00+02:00',
    actualArrivalTime: undefined,
    actualDepartureTime: undefined,
    realtime: false,
    quay: {id: 'NSR:Quay:102721', name: 'Østre Lund'},
  },
  {
    aimedDepartureTime: '2024-10-18T12:17:00+02:00',
    actualArrivalTime: undefined,
    actualDepartureTime: undefined,
    realtime: false,
    quay: {id: 'NSR:Quay:74027', name: 'Kattemsenteret'},
  },
];
describe('getFocusedEstimatedCall for no realtime journey', () => {
  it('no realtime for Østre Lund', () => {
    const focus = getFocusedEstimatedCall(noRealtimeJourney, 1);
    expect(focus.status).toBe(TravelAidStatus.NoRealtime);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Kattemsenteret');
  });
});

const arrivedButNotDepartedJourney: any[] = [
  {
    aimedDepartureTime: '2024-10-18T12:15:00+02:00',
    actualArrivalTime: '2024-10-18T12:15:14+02:00',
    actualDepartureTime: '2024-10-18T12:15:14+02:00',
    realtime: true,
    quay: {id: 'NSR:Quay:102721', name: 'Østre Lund'},
  },
  {
    aimedDepartureTime: '2024-10-18T12:17:00+02:00',
    actualArrivalTime: '2024-10-18T12:16:48+02:00',
    actualDepartureTime: undefined,
    realtime: true,
    quay: {id: 'NSR:Quay:74027', name: 'Kattemsenteret'},
  },
];
describe('getFocusedEstimatedCall for arrived but not departed journey', () => {
  it('arrived at Kattemsenteret', () => {
    const focus = getFocusedEstimatedCall(arrivedButNotDepartedJourney, 0);
    expect(focus.status).toBe(TravelAidStatus.Arrived);
    expect(focus.focusedEstimatedCall.quay.name).toBe('Kattemsenteret');
  });
});
