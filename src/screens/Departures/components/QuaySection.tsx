import * as Sections from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {
  CancelledDepartureTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {ExpandMore, ExpandLess} from '@atb/assets/svg/mono-icons/navigation';
import {EstimatedCall, Quay} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import EstimatedCallItem from './EstimatedCallItem';
import SectionSeparator from '@atb/components/sections/section-separator';
import {
  formatToClockOrLongRelativeMinutes,
  formatToSimpleDate,
} from '@atb/utils/date';
import {isToday, parseISO} from 'date-fns';

type QuaySectionProps = {
  quay: Quay;
  data: EstimatedCall[] | null;
  testID?: 'quaySection' | string;
  navigateToQuay?: (arg0: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
};

type EstimatedCallRenderItem = {
  item: EstimatedCall;
  index: number;
};

export default function QuaySection({
  quay,
  data,
  testID,
  navigateToQuay,
  navigateToDetails,
}: QuaySectionProps): JSX.Element {
  const [isHidden, setIsHidden] = useState(false);
  const styles = useStyles();
  const departures = getDeparturesForQuay(data, quay);
  const {t, language} = useTranslation();

  return (
    <View testID={testID}>
      <Sections.Section withPadding withBottomPadding>
        <Sections.GenericClickableItem
          type="inline"
          onPress={() => {
            setIsHidden(!isHidden);
          }}
          accessibilityHint={
            isHidden
              ? t(DeparturesTexts.quaySection.a11yExpand)
              : t(DeparturesTexts.quaySection.a11yMinimize)
          }
        >
          <View style={styles.stopPlaceHeader} testID={testID + 'HideAction'}>
            <View style={styles.stopPlaceHeaderText}>
              <ThemeText
                type="body__secondary--bold"
                color="secondary"
                style={styles.rightMargin}
                testID={testID + 'Name'}
              >
                {quay.publicCode
                  ? quay.name + ' ' + quay.publicCode
                  : quay.name}
              </ThemeText>
              {!!quay.description && (
                <ThemeText
                  style={styles.rightMargin}
                  type="body__secondary"
                  color="secondary"
                  testID={testID + 'Description'}
                >
                  {quay.description}
                </ThemeText>
              )}
            </View>
            <ThemeIcon svg={isHidden ? ExpandMore : ExpandLess} />
          </View>
        </Sections.GenericClickableItem>
        {!isHidden && (
          <FlatList
            ItemSeparatorComponent={SectionSeparator}
            data={departures}
            renderItem={({item: departure, index}: EstimatedCallRenderItem) => (
              <Sections.GenericClickableItem
                radius={
                  !navigateToQuay && index === departures.length - 1
                    ? 'bottom'
                    : undefined
                }
                testID={'departureItem' + index}
                onPress={() => {
                  if (departure?.serviceJourney)
                    navigateToDetails(
                      departure.serviceJourney?.id,
                      departure.date,
                      departure.expectedDepartureTime,
                      departure.quay?.id,
                      departure.cancellation,
                    );
                }}
                accessibilityHint={t(DeparturesTexts.a11yEstimatedCallItemHint)}
                accessibilityLabel={getA11yLineLabel(departure, t, language)}
              >
                <EstimatedCallItem
                  departure={departure}
                  testID={'departureItem' + index}
                />
              </Sections.GenericClickableItem>
            )}
            keyExtractor={(item: EstimatedCall) =>
              // ServiceJourney ID is not a unique key if a ServiceJourney
              // passes by the same stop several times, (e.g. Ringen in Oslo)
              // which is why it is used in combination with aimedDepartureTime.
              item.serviceJourney?.id + item.aimedDepartureTime
            }
            ListEmptyComponent={
              <>
                {data && (
                  <Sections.GenericItem
                    radius={!navigateToQuay ? 'bottom' : undefined}
                  >
                    <ThemeText color="secondary">
                      {t(DeparturesTexts.noDepartures)}
                    </ThemeText>
                  </Sections.GenericItem>
                )}
              </>
            }
          />
        )}
        {!data && (
          <Sections.GenericItem>
            <View style={{width: '100%'}}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </Sections.GenericItem>
        )}
        {navigateToQuay && !isHidden && (
          <Sections.LinkItem
            icon="arrow-right"
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            textType="body__primary--bold"
            onPress={() => navigateToQuay(quay)}
            accessibility={{
              accessibilityHint: t(DeparturesTexts.quaySection.a11yToQuayHint),
            }}
            testID={testID + 'More'}
          ></Sections.LinkItem>
        )}
      </Sections.Section>
    </View>
  );
}

function getA11yLineLabel(departure: any, t: any, language: any) {
  const line = departure.serviceJourney?.line;
  const a11yLine = line?.publicCode
    ? `${t(DeparturesTexts.line)} ${line?.publicCode},`
    : '';
  const a11yFrontText = departure.destinationDisplay?.frontText
    ? `${departure.destinationDisplay?.frontText}.`
    : '';

  let a11yDateInfo = '';
  if (departure.expectedDepartureTime) {
    const a11yClock = formatToClockOrLongRelativeMinutes(
      departure.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    );
    const a11yTimeWithRealtimePrefix = departure.realtime
      ? a11yClock
      : t(dictionary.a11yMissingRealTimePrefix) + a11yClock;
    const parsedDepartureTime = parseISO(departure.expectedDepartureTime);
    const a11yDate = !isToday(parsedDepartureTime)
      ? formatToSimpleDate(parsedDepartureTime, language) + ','
      : '';
    a11yDateInfo = `${a11yDate} ${a11yTimeWithRealtimePrefix}`;
  }

  return `${
    departure.cancellation ? t(CancelledDepartureTexts.message) : ''
  } ${a11yLine} ${a11yFrontText} ${a11yDateInfo}`;
}

function getDeparturesForQuay(
  departures: EstimatedCall[] | null,
  quay: Quay,
): EstimatedCall[] {
  if (!departures) return [];
  return departures.filter(
    (departure) => departure && departure.quay?.id === quay.id,
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  stopPlaceHeader: {
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
  },
  stopPlaceHeaderText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  rightMargin: {
    marginRight: theme.spacings.medium,
  },
}));
