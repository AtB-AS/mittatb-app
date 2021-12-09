import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ActivityIndicator, RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StopPlaceDetails} from '@atb/sdk';
import {StackNavigationProp} from '@react-navigation/stack';
import {NearbyStackParams} from '../Nearby';
import {RouteProp} from '@react-navigation/native';
import Button from '@atb/components/button';
import {DepartureDataState, useDepartureData} from './DepartureState';
import ThemeText from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {BusSide} from '@atb/assets/svg/icons/transportation';
import {dictionary, Language, useTranslation} from '@atb/translations';
import {
  formatToClock,
  formatToClockOrRelativeMinutes,
  formatToShortDate,
} from '@atb/utils/date';
import {Quay} from '@entur/sdk';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  ExpandLess,
} from '@atb/assets/svg/icons/navigation';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {EstimatedCall} from '@atb/api/types/departures';
import {Date as DateIcon} from '@atb/assets/svg/icons/time';
import {SearchTime} from './Departures';
import {addDays, isSameDay, isToday, parseISO} from 'date-fns';
import DepartureTimeSheet from '../Nearby/DepartureTimeSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW = 5;

export type StopPlaceScreenParams = {
  stopPlaceDetails: StopPlaceDetails;
  selectedQuay?: Quay;
};

type StopPlaceScreenRouteProps = RouteProp<
  NearbyStackParams,
  'StopPlaceScreen'
>;

export type LoginOnboardingProps = {
  navigation: StackNavigationProp<NearbyStackParams>;
  route: StopPlaceScreenRouteProps;
};

export default function StopPlaceScreen({
  navigation,
  route: {
    params: {stopPlaceDetails, selectedQuay},
  },
}: LoginOnboardingProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const {state, refresh, loadMore} = useDepartureData(
    stopPlaceDetails,
    selectedQuay,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );
  const [expandedQuays, setExpandedQuays] = useState(
    new Array<number>(stopPlaceDetails.quays?.length || 0).fill(5),
  );
  const [hiddenQuays, setHiddenQuays] = useState(
    new Array<boolean>(stopPlaceDetails.quays?.length || 0).fill(false),
  );

  useEffect(() => {
    refresh();
  }, [selectedQuay, stopPlaceDetails]);

  useMemo(
    () =>
      stopPlaceDetails.quays?.sort((a, b) =>
        publicCodeCompare(a.publicCode, b.publicCode),
      ),
    [stopPlaceDetails],
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={stopPlaceDetails.name}
        leftButton={{type: 'back'}}
      />
      <ScrollView
        style={styles.quayChipContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Button
          onPress={() => {
            navigation.navigate('StopPlaceScreen', {
              stopPlaceDetails,
              selectedQuay: undefined,
            });
          }}
          text="Alle stopp"
          color={selectedQuay ? 'secondary_4' : 'secondary_3'}
          style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
        ></Button>
        {stopPlaceDetails.quays?.map((quay) => (
          <Button
            key={quay.id}
            onPress={() => {
              navigation.navigate('StopPlaceScreen', {
                stopPlaceDetails,
                selectedQuay: quay,
              });
            }}
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            color={selectedQuay?.id === quay.id ? 'secondary_3' : 'secondary_4'}
            style={styles.quayChip}
          ></Button>
        ))}
      </ScrollView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
        }
      >
        <DateNavigationSection
          searchTime={searchTime}
          setSearchTime={setSearchTime}
        ></DateNavigationSection>
        {stopPlaceDetails.quays?.map((quay, index) => {
          if (selectedQuay && selectedQuay.id !== quay.id) return;
          return (
            <Sections.Section withPadding key={quay.id.toString()}>
              <Sections.GenericClickableItem
                type="inline"
                onPress={() => {
                  setHiddenQuays(
                    hiddenQuays.map((value, quayIndex) =>
                      quayIndex === index ? !value : value,
                    ),
                  );
                }}
              >
                <View style={styles.stopPlaceHeader}>
                  <View style={styles.stopPlaceHeaderText}>
                    <ThemeText
                      type="body__secondary--bold"
                      color="secondary"
                      style={styles.rightMargin}
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
                      >
                        {quay.description}
                      </ThemeText>
                    )}
                  </View>
                  <ThemeIcon
                    svg={hiddenQuays[index] ? Expand : ExpandLess}
                  ></ThemeIcon>
                </View>
              </Sections.GenericClickableItem>
              {!hiddenQuays[index] &&
                getDeparturesForQuay(state.data, quay)
                  .slice(
                    0,
                    selectedQuay ? state.data?.length : expandedQuays[index],
                  )
                  .map((departure) => (
                    <Sections.GenericItem key={departure.serviceJourney?.id}>
                      <EstimatedCallLine
                        departure={departure}
                      ></EstimatedCallLine>
                    </Sections.GenericItem>
                  ))}
              {getDeparturesForQuay(state.data, quay).length === 0 &&
                !hiddenQuays[index] && (
                  <Sections.GenericItem>
                    <ThemeText color="secondary" style={{width: '100%'}}>
                      Ingen avganger i nærmeste fremtid
                    </ThemeText>
                  </Sections.GenericItem>
                )}
              {!state.data && (
                <Sections.GenericItem>
                  <View style={{width: '100%'}}>
                    <ActivityIndicator></ActivityIndicator>
                  </View>
                </Sections.GenericItem>
              )}
              {!selectedQuay && !hiddenQuays[index] && (
                <Sections.LinkItem
                  icon="expand-more"
                  text="Vis flere avganger"
                  textType="body__primary--bold"
                  onPress={() => {
                    expandQuay(
                      quay,
                      index,
                      expandedQuays,
                      setExpandedQuays,
                      getDeparturesForQuay(state.data, quay).length,
                    );
                  }}
                ></Sections.LinkItem>
              )}
            </Sections.Section>
          );
        })}
      </ScrollView>
    </View>
  );
}

type EstimatedCallLineProps = {
  departure: EstimatedCall;
};

function getDeparturesForQuay(
  departures: EstimatedCall[] | null,
  quay: Quay,
): EstimatedCall[] {
  if (!departures) return [];
  return departures.filter(
    (departure) => departure && departure.quay?.id === quay.id,
  );
}

type DateNavigationSectionProps = {
  searchTime: SearchTime;
  setSearchTime: Dispatch<SetStateAction<SearchTime>>;
};

function DateNavigationSection({
  searchTime,
  setSearchTime,
}: DateNavigationSectionProps): JSX.Element {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();

  const {open: openBottomSheet} = useBottomSheet();
  const onLaterTimePress = () => {
    openBottomSheet((close, focusRef) => (
      <DepartureTimeSheet
        ref={focusRef}
        close={close}
        initialTime={searchTime}
        setSearchTime={setSearchTime}
      ></DepartureTimeSheet>
    ));
  };

  return (
    <View style={styles.dateNavigator}>
      <Button
        onPress={() => {
          setSearchTime(changeDay(searchTime, -1));
        }}
        text="Forrige dag"
        type="inline"
        mode="tertiary"
        icon={ArrowLeft}
        disabled={isToday(parseISO(searchTime.date))}
        textStyle={{
          marginLeft: theme.spacings.xSmall,
        }}
      ></Button>
      <Button
        onPress={onLaterTimePress}
        text={
          searchTime.option === 'now'
            ? 'I dag'
            : formatToTwoLineDateTime(searchTime.date, language)
        }
        type="compact"
        mode="tertiary"
        iconPosition="right"
        icon={DateIcon}
        textStyle={{
          textAlign: 'center',
          marginRight: theme.spacings.xSmall,
        }}
      ></Button>
      <Button
        onPress={() => {
          setSearchTime(changeDay(searchTime, 1));
        }}
        text="Neste dag"
        type="compact"
        iconPosition="right"
        mode="tertiary"
        icon={ArrowRight}
        disabled={false}
        textStyle={{
          marginRight: theme.spacings.xSmall,
        }}
      ></Button>
    </View>
  );
}

function changeDay(searchTime: SearchTime, days: number): SearchTime {
  const date = addDays(parseISO(searchTime.date).setHours(0, 0), days);
  return {
    option: isToday(date) ? 'now' : 'departure',
    date: isToday(date) ? new Date().toISOString() : date.toISOString(),
  };
}

function expandQuay(
  quay: Quay,
  index: number,
  expandedQuays: number[],
  setExpandedQuays: Dispatch<SetStateAction<number[]>>,
  loadedDeparturesCount: number,
) {
  const targetCount =
    expandedQuays[index] + DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW * 2;

  setExpandedQuays(
    expandedQuays.map((value, quayIndex) =>
      quayIndex === index ? targetCount : value,
    ),
  );
}

function EstimatedCallLine({departure}: EstimatedCallLineProps): JSX.Element {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const line = departure.serviceJourney?.line;

  // const clock = formatToClock(departure.expectedDepartureTime, language);
  const time = formatToClockOrRelativeMinutes(
    departure.expectedDepartureTime,
    language,
    t(dictionary.date.units.now),
  );
  const timeWithRealtimePrefix = departure.realtime
    ? time
    : t(dictionary.missingRealTimePrefix) + time;

  return (
    <View style={styles.estimatedCallLine}>
      {line && (
        <LineChip
          publicCode={line.publicCode}
          transportMode={line.transportMode}
          transportSubmode={line?.transportSubmode}
        ></LineChip>
      )}
      <ThemeText style={styles.lineName}>
        {departure.destinationDisplay?.frontText}
      </ThemeText>
      <ThemeText type="body__primary--bold">{timeWithRealtimePrefix}</ThemeText>
    </View>
  );
}

type LineChipProps = {
  publicCode?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
};

function LineChip({
  publicCode,
  transportMode,
  transportSubmode,
}: LineChipProps): JSX.Element {
  const styles = useStyles();
  const svg = getTransportModeSvg(transportMode as Mode_v2 | undefined);
  const transportColor = useTransportationColor(
    transportMode as Mode_v2 | undefined,
    transportSubmode,
  );
  const transportTextColor = useTransportationColor(
    transportMode as Mode_v2 | undefined,
    transportSubmode,
    'color',
  );

  return (
    <View style={[styles.lineChip, {backgroundColor: transportColor}]}>
      <View style={styles.chipContent}>
        {svg && (
          <ThemeIcon
            fill={transportTextColor}
            style={styles.lineChipIcon}
            svg={svg || BusSide}
          ></ThemeIcon>
        )}
        <ThemeText
          style={[styles.lineChipText, {color: transportTextColor}]}
          type="body__primary--bold"
        >
          {publicCode}
        </ThemeText>
      </View>
    </View>
  );
}

function publicCodeCompare(a: string, b: string): number {
  // Show quays with no public code last
  if (!a) return 1;
  if (!b) return -1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(a) && parseInt(b)) {
    return parseInt(a) - parseInt(b);
  }
  // Otherwise compare as strings (e.g. K1 < K2)
  return a.localeCompare(b);
}

function formatToTwoLineDateTime(isoDate: string, language: Language) {
  const parsed = parseISO(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed, language);
  }
  return (
    formatToShortDate(parsed, language) + '\n' + formatToClock(parsed, language)
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  quayChipContainer: {
    backgroundColor: theme.colors.background_accent.backgroundColor,
    paddingVertical: theme.spacings.medium,
    flexShrink: 0,
    flexGrow: 0,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
  estimatedCallLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacings.medium,
  },
  lineChip: {
    minWidth: 70,
    padding: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.medium,
  },
  chipContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineChipIcon: {
    marginRight: theme.spacings.small,
  },
  lineChipText: {
    color: theme.colors.primary_2.color,
    textAlign: 'right',
  },
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
  dateNavigator: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacings.medium,
  },
}));
