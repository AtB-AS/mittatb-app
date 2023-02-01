import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {
  AccessibleText,
  screenReaderPause,
  ThemeText,
} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {SituationOrNoticeIcon} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  Language,
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {flatMap, interpose} from '@atb/utils/array';
import {
  formatToClock,
  isInThePast,
  secondsBetween,
  secondsToDuration,
  secondsToDurationShort,
} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';

import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityProps,
  Animated,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {SearchTime} from '@atb/journey-date-picker';
import {RailReplacementBusMessage} from './RailReplacementBusMessage';
import {
  getNoticesForLeg,
  getTimeRepresentationType,
  isSignificantFootLegWalkOrWaitTime,
  significantWaitTime,
  significantWalkTime,
} from '@atb/travel-details-screens/utils';
import {Destination} from '@atb/assets/svg/mono-icons/places';
import {CollapsedLegs} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/CollapsedLegs';
import TripDetails from '@atb/translations/screens/subscreens/TripDetails';
import useFontScale from '@atb/utils/use-font-scale';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
  searchTime: SearchTime;
  testID?: string;
};

const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  let start = tripPattern.legs[0];
  let startName = start.fromPlace.name;
  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    start = tripPattern.legs[1];
    startName = getQuayName(start.fromPlace.quay);
  }

  const durationText = secondsToDurationShort(tripPattern.duration, language);
  const transportName = t(getTranslatedModeName(start.mode));

  return (
    <View style={styles.resultHeader}>
      <ThemeText style={styles.fromPlaceText} type={'body__secondary--bold'}>
        {startName
          ? t(
              TripSearchTexts.results.resultItem.header.title(
                transportName,
                startName,
              ),
            )
          : transportName}
      </ThemeText>
      <View style={styles.durationContainer}>
        <AccessibleText
          type="body__secondary"
          color="secondary"
          testID="resultDuration"
          prefix={t(TripSearchTexts.results.resultItem.header.totalDuration)}
        >
          {durationText}
        </AccessibleText>
      </View>

      <RailReplacementBusMessage tripPattern={tripPattern} />

      <SituationOrNoticeIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        notices={flatMap(tripPattern.legs, getNoticesForLeg)}
        accessibilityLabel={t(
          TripSearchTexts.results.resultItem.hasSituationsTip,
        )}
        style={styles.warningIcon}
      />
    </View>
  );
};

const ResultItem: React.FC<ResultItemProps & AccessibilityProps> = ({
  tripPattern,
  onDetailsPressed,
  testID,
  searchTime,
  ...props
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const fontScale = useFontScale();
  const [legIconsParentWidth, setLegIconsParentWidth] = useState(0);
  const [legIconsContentWidth, setLegIconsContentWidth] = useState(0);

  const [numberOfExpandedLegs, setNumberOfExpandedLegs] = useState(
    tripPattern.legs.length,
  );
  const fadeInValue = useRef(new Animated.Value(0)).current;

  // Dynamically collapse legs to fit horizontally
  useEffect(() => {
    if (legIconsParentWidth && legIconsContentWidth) {
      if (legIconsContentWidth >= legIconsParentWidth) {
        setNumberOfExpandedLegs((val) => val - 1);
      } else {
        fadeIn.start();
      }
    }
  }, [legIconsParentWidth, legIconsContentWidth]);

  const fadeIn = Animated.timing(fadeInValue, {
    toValue: 1,
    duration: 250,
    useNativeDriver: true,
  });

  if (!tripPattern?.legs?.length) return null;

  const expandedLegs = tripPattern.legs.slice(0, numberOfExpandedLegs);
  const collapsedLegs = tripPattern.legs.slice(
    numberOfExpandedLegs,
    tripPattern.legs.length,
  );
  const legs = expandedLegs.filter((leg, i) =>
    isSignificantFootLegWalkOrWaitTime(leg, tripPattern.legs[i + 1]),
  );

  const isInPast =
    isInThePast(tripPattern.legs[0].expectedStartTime) &&
    searchTime?.option !== 'now';
  const iconHeight =
    theme.icon.size['normal'] * fontScale + theme.spacings.small * 2;

  return (
    <TouchableOpacity
      accessibilityLabel={tripSummary(tripPattern, t, language, isInPast)}
      accessibilityHint={t(
        TripSearchTexts.results.resultItem.footer.detailsHint,
      )}
      onPress={onDetailsPressed}
      accessible={true}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.result,
          isInPast && styles.resultInPast,
          {opacity: fadeInValue},
        ]}
        {...props}
        accessible={false}
      >
        <ResultItemHeader tripPattern={tripPattern} />
        <View style={styles.detailsContainer} {...screenReaderHidden}>
          <View
            style={styles.flexRow}
            onLayout={(ev) => {
              setLegIconsParentWidth(ev.nativeEvent.layout.width);
            }}
          >
            <View
              style={styles.legOutput}
              onLayout={(ev) => {
                setLegIconsContentWidth(
                  ev.nativeEvent.layout.width +
                    theme.spacings.small +
                    theme.spacings.small * 2,
                );
              }}
            >
              {interpose(
                legs.map((leg, i) => (
                  <View key={leg.aimedStartTime + leg.aimedEndTime}>
                    {leg.mode === 'foot' ? (
                      <FootLeg leg={leg} nextLeg={tripPattern.legs[i + 1]} />
                    ) : (
                      <TransportationLeg
                        wide={isSignificantDifference(leg)}
                        leg={leg}
                      />
                    )}
                    <View style={styles.departureTimes}>
                      <ThemeText type="body__tertiary" color="primary">
                        {formatToClock(leg.expectedStartTime, language)}
                      </ThemeText>
                      {isSignificantDifference(leg) && (
                        <ThemeText
                          style={styles.scheduledTime}
                          type="body__tertiary--strike"
                          color="secondary"
                        >
                          {formatToClock(leg.aimedStartTime, language)}
                        </ThemeText>
                      )}
                    </View>
                  </View>
                )),
                <View style={[styles.dashContainer, {height: iconHeight}]}>
                  <LegDash />
                </View>,
              )}
              {collapsedLegs.length ? (
                <View style={[styles.dashContainer, {height: iconHeight}]}>
                  <LegDash />
                </View>
              ) : null}
              <CollapsedLegs legs={collapsedLegs} />
            </View>
            <View style={[styles.lineContainer, {height: iconHeight}]}>
              <View
                style={[
                  styles.destinationLine,
                  {height: (theme.spacings.xSmall / 2) * fontScale},
                ]}
              ></View>
            </View>
          </View>
          <View>
            <DestinationIcon style={styles.iconContainer} />
            <View style={styles.departureTimes}>
              <ThemeText type="body__tertiary" color="primary">
                {formatToClock(tripPattern.expectedEndTime, language)}
              </ThemeText>
            </View>
          </View>
        </View>
        <ResultItemFooter />
      </Animated.View>
    </TouchableOpacity>
  );
};
function ResultItemFooter() {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.resultFooter}>
      <View style={styles.detailsTextWrapper}>
        <ThemeText type="body__secondary">
          {t(TripSearchTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} style={styles.detailsIcon} />
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  result: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.medium,
  },
  resultInPast: {
    backgroundColor: theme.static.background.background_2.background,
  },
  detailsContainer: {
    padding: theme.spacings.medium,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lineContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  destinationLine: {
    backgroundColor: theme.static.background.background_2.background,
    flexDirection: 'row',
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.small,
  },
  legLine: {
    backgroundColor: theme.static.background.background_2.background,
    flexDirection: 'row',
    borderRadius: theme.border.radius.regular,
    width: theme.spacings.xSmall,
  },
  iconContainer: {
    backgroundColor: theme.static.background.background_2.background,
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.small,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    borderBottomColor: theme.border.primary,
    borderBottomWidth: theme.border.width.slim,
  },
  row: {
    flexDirection: 'row',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  dashContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legOutput: {
    marginHorizontal: theme.spacings.small,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  departureTimes: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: theme.spacings.xSmall,
  },
  scheduledTime: {
    marginLeft: theme.spacings.xSmall,
  },
  resultFooter: {
    flexDirection: 'column',
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
    padding: theme.spacings.medium,
    alignItems: 'flex-end',
  },
  fromPlaceText: {
    flex: 3,
  },
  detailsTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.spacings.medium,
  },
  detailsIcon: {
    marginLeft: theme.spacings.xSmall,
  },
  durationContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  warningIcon: {
    marginLeft: theme.spacings.small,
  },
}));

const LegDash = () => {
  const styles = useThemeStyles();
  const {theme} = useTheme();
  const fontScale = useFontScale();
  const lineHeight = (theme.spacings.xSmall / 2) * fontScale;
  return (
    <>
      <View style={styles.lineContainer}>
        <View
          style={[
            styles.legLine,
            {
              height: lineHeight,
              marginLeft: theme.spacings.small,
              marginRight: theme.spacings.xSmall,
            },
          ]}
        ></View>
      </View>
      <View style={styles.lineContainer}>
        <View
          style={[
            styles.legLine,
            {
              height: lineHeight,
              marginRight: theme.spacings.small,
            },
          ]}
        ></View>
      </View>
    </>
  );
};
const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const styles = useThemeStyles();
  const showWaitTime = Boolean(nextLeg);
  const {t, language} = useTranslation();
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const waitDuration = secondsToDuration(waitTimeInSeconds, language);
  const walkDuration = secondsToDuration(leg.duration ?? 0, language);

  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  const a11yText =
    mustWalk && mustWait
      ? t(
          TripSearchTexts.results.resultItem.footLeg.walkandWaitLabel(
            walkDuration,
            waitDuration,
          ),
        )
      : mustWait
      ? t(TripSearchTexts.results.resultItem.footLeg.waitLabel(waitDuration))
      : t(TripSearchTexts.results.resultItem.footLeg.walkLabel(walkDuration));

  return (
    <ThemeIcon
      style={styles.iconContainer}
      accessibilityLabel={a11yText}
      testID="fLeg"
      svg={Walk}
    />
  );
};

const TransportationLeg = ({leg, wide}: {leg: Leg; wide?: boolean}) => {
  return (
    <TransportationIcon
      wide={wide}
      mode={leg.mode}
      subMode={leg.line?.transportSubmode}
      lineNumber={leg.line?.publicCode}
    />
  );
};

const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
) => {
  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const firstLeg = nonFootLegs[0];

  return `
    ${isInPast ? t(TripSearchTexts.results.resultItem.passedTrip) : ''}

    ${
      firstLeg
        ? isSignificantDifference(firstLeg)
          ? t(
              TripDetails.trip.leg.start.a11yLabel.realAndAimed(
                firstLeg.fromPlace?.name ?? '',
                formatToClock(firstLeg.expectedStartTime, language),
                formatToClock(firstLeg.aimedStartTime, language),
              ),
            )
          : t(
              TripDetails.trip.leg.start.a11yLabel.noRealTime(
                firstLeg.fromPlace?.name ?? '',
                formatToClock(firstLeg.expectedStartTime, language),
              ),
            )
        : ''
    }

    ${nonFootLegs
      ?.map((l) => {
        return `${t(getTranslatedModeName(l.mode))} ${
          l.line?.publicCode
            ? t(
                TripSearchTexts.results.resultItem.journeySummary.prefixedLineNumber(
                  l.line.publicCode,
                ),
              )
            : ''
        }

        ${l.fromEstimatedCall?.destinationDisplay?.frontText ?? l.line?.name}

        `;
      })
      .join(', ')}

      ${
        !nonFootLegs.length
          ? t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription
                .footLegsOnly,
            )
          : nonFootLegs.length === 1
          ? t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription
                .noSwitching,
            )
          : nonFootLegs.length === 2
          ? t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription
                .oneSwitch,
            )
          : t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription.someSwitches(
                nonFootLegs.length,
              ),
            )
      }

      ${t(
        TripSearchTexts.results.resultItem.journeySummary.totalWalkDistance(
          (tripPattern.walkDistance ?? 0).toFixed(),
        ),
      )}  ${screenReaderPause}
  `;
};

function isSignificantDifference(leg: Leg) {
  return (
    getTimeRepresentationType({
      missingRealTime: !leg.realtime,
      aimedTime: leg.aimedStartTime,
      expectedTime: leg.expectedStartTime,
    }) === 'significant-difference'
  );
}

const DestinationIcon = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return <ThemeIcon style={style} svg={Destination} />;
};

export default ResultItem;
