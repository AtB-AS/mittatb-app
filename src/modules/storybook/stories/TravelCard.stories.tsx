import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {TravelCard} from '@atb/screen-components/travel-card';
import type {TripPattern, Leg} from '@atb/api/types/trips';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Statuses} from '@atb/theme';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {Meta} from '@storybook/react';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';

const now = Date.now();
const tomorrowTime = new Date(now + 25 * 3600 * 1000).toISOString();
const farTomorrowTime = new Date(now + 27 * 3600 * 1000).toISOString();
const futureTime = new Date(now + 3600 * 1000).toISOString();
const farFutureTime = new Date(now + 7200 * 1000).toISOString();
const pastTime = new Date(now - 3600 * 1000).toISOString();
const farPastTime = new Date(now - 7200 * 1000).toISOString();

function makeLeg(overrides: Partial<Leg> = {}): Leg {
  return {
    mode: 'bus',
    distance: 3500,
    duration: 3600,
    aimedStartTime: futureTime,
    aimedEndTime: farFutureTime,
    expectedStartTime: futureTime,
    expectedEndTime: farFutureTime,
    realtime: false,
    situations: [],
    fromPlace: {
      name: 'Marienborg',
      longitude: 10.39,
      latitude: 63.43,
      quay: {id: 'NSR:Quay:71184', name: 'Marienborg'},
    },
    toPlace: {
      name: 'Brattøra',
      longitude: 10.4,
      latitude: 63.44,
      quay: {id: 'NSR:Quay:71185', name: 'Brattøra'},
    },
    intermediateEstimatedCalls: [],
    serviceJourneyEstimatedCalls: [],
    line: {
      id: 'ATB:Line:2_1',
      publicCode: '1',
    },
    ...overrides,
  } as Leg;
}

function makeTripPattern(overrides: Partial<TripPattern> = {}): TripPattern {
  return {
    expectedStartTime: futureTime,
    expectedEndTime: farFutureTime,
    duration: 3600,
    legs: [makeLeg()],
    ...overrides,
  } as TripPattern;
}

const TRIP_SCENARIOS = {
  default: makeTripPattern(),
  multiLeg: makeTripPattern({
    duration: 5400,
    legs: [
      makeLeg(),
      makeLeg({mode: Mode.Foot, duration: 300, line: undefined as any}),
      makeLeg({
        mode: Mode.Tram,
        line: {id: 'ATB:Line:2_9', publicCode: '9'} as any,
      }),
    ],
  }),
  cancelled: makeTripPattern({
    legs: [
      makeLeg({
        fromEstimatedCall: {
          cancellation: true,
          aimedDepartureTime: futureTime,
          expectedDepartureTime: futureTime,
          stopPositionInPattern: 0,
          quay: {name: 'Marienborg'},
          notices: [],
          situations: [],
        } as any,
      }),
    ],
  }),
  started: makeTripPattern({
    expectedStartTime: pastTime,
    expectedEndTime: farFutureTime,
    duration: 7200,
  }),
  ended: makeTripPattern({
    expectedStartTime: farPastTime,
    expectedEndTime: pastTime,
    duration: 3600,
  }),
  impossible: makeTripPattern({
    status: 'impossible',
    legs: [
      makeLeg(),
      makeLeg({
        mode: Mode.Tram,
        expectedStartTime: futureTime,
        line: {id: 'ATB:Line:2_9', publicCode: '9'} as any,
      }),
    ],
  }),
  stale: makeTripPattern({status: 'stale'}),
  requiresBooking: makeTripPattern({
    legs: [
      makeLeg({
        bookingArrangements: {bookWhen: 'timeOfTravelOnly' as any},
      }),
    ],
  }),
  bookingDeadlineExceeded: makeTripPattern({
    legs: [
      makeLeg({
        aimedStartTime: farPastTime,
        bookingArrangements: {
          bookWhen: 'latestBookingTime' as any,
          latestBookingTime: '00:00:00',
        } as any,
      }),
    ],
  }),
  withAllNotices: makeTripPattern({
    expectedStartTime: tomorrowTime,
    expectedEndTime: farTomorrowTime,
    legs: [
      makeLeg({
        aimedStartTime: tomorrowTime,
        aimedEndTime: farTomorrowTime,
        expectedStartTime: tomorrowTime,
        expectedEndTime: farTomorrowTime,
        transportSubmode: TransportSubmode.RailReplacementBus,
        situations: [
          {
            id: 'mock-situation-1',
            summary: [{value: 'Forsinkelse'}],
            description: [{value: 'Det er forsinkelser grunnet trafikk'}],
            advice: [],
          },
        ],
      }),
    ],
  }),
} satisfies Record<string, TripPattern>;

function scenarioLabel(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function applyAimedTimeOverride(
  tripPattern: TripPattern,
  include: boolean,
): TripPattern {
  if (include) {
    const offsetMs = 5 * 60 * 1000;
    return {
      ...tripPattern,
      aimedStartTime: new Date(
        new Date(tripPattern.expectedStartTime).getTime() - offsetMs,
      ).toISOString(),
      aimedEndTime: new Date(
        new Date(tripPattern.expectedEndTime).getTime() - offsetMs,
      ).toISOString(),
    };
  }
  return {
    ...tripPattern,
    aimedStartTime: tripPattern.expectedStartTime,
    aimedEndTime: tripPattern.expectedEndTime,
  };
}

type TravelCardMetaProps = ThemedStoryProps<{
  hasTag: boolean;
  includeDayInfo: boolean;
  includeFromToInfo: boolean;
  includeLegNotifications: boolean;
  includeSituationNotices: boolean;
  isDisabled: boolean;
  includeAimedTime: boolean;
}>;

const TravelCardMeta: Meta = {
  title: 'TravelCard',
  component: TravelCard,
  argTypes: {
    hasTag: {control: 'boolean'},
    includeDayInfo: {control: 'boolean'},
    includeFromToInfo: {control: 'boolean'},
    includeLegNotifications: {control: 'boolean'},
    includeSituationNotices: {control: 'boolean'},
    isDisabled: {control: 'boolean'},
    includeAimedTime: {control: 'boolean'},
    ...themedStoryControls,
  },
  args: {
    hasTag: false,
    includeDayInfo: false,
    includeFromToInfo: false,
    includeLegNotifications: false,
    includeSituationNotices: false,
    isDisabled: false,
    includeAimedTime: false,
    ...themedStoryDefaultArgs,
    storyColor: 'background neutral 1',
  },
  decorators: [ThemedStoryDecorator as any],
};

export default TravelCardMeta;

const scenarioCount = Object.keys(TRIP_SCENARIOS).length;

const TravelCardStory = (args: TravelCardMetaProps) => {
  const {t} = useTranslation();
  return (
    <ScrollView contentContainerStyle={{paddingVertical: 12}}>
      {Object.entries(TRIP_SCENARIOS).map(([name, tripPattern], index) => {
        const pattern = applyAimedTimeOverride(
          tripPattern,
          args.includeAimedTime,
        );
        return (
          <View key={name}>
            <Text
              style={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 4,
                fontSize: 12,
                fontWeight: '600',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {scenarioLabel(name)}
            </Text>
            <TravelCard
              tripPattern={pattern}
              onDetailsPressed={() => {}}
              a11yLabelPrefix={`Trip ${index + 1} of ${scenarioCount}`}
              a11yHint={t(TravelCardTexts.card.a11yHint.tripDetails)}
              includeDayInfo={args.includeDayInfo}
              includeFromToInfo={args.includeFromToInfo}
              includeLegNotifications={args.includeLegNotifications}
              includeSituationNotices={args.includeSituationNotices}
              isDisabled={args.isDisabled}
              tag={
                args.hasTag
                  ? {label: 'Saved trip', type: 'valid' as Statuses}
                  : undefined
              }
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export const Default = {
  render: TravelCardStory,
};
