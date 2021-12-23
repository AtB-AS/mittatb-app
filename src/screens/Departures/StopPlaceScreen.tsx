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
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  SectionListData,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {NearbyStackParams} from '../Nearby';
import {RouteProp} from '@react-navigation/native';
import Button from '@atb/components/button';
import {useDepartureData} from './DepartureState';
import ThemeText from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {dictionary, Language, useTranslation} from '@atb/translations';
import {
  formatToClock,
  formatToClockOrRelativeMinutes,
  formatToShortDate,
} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  ExpandLess,
} from '@atb/assets/svg/icons/navigation';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {
  EstimatedCall,
  Quay,
  StopPlacePosition,
} from '@atb/api/types/departures';
import {Date as DateIcon} from '@atb/assets/svg/icons/time';
import {SearchTime} from './Departures';
import {addDays, isSameDay, isToday, parseISO} from 'date-fns';
import DepartureTimeSheet from '../Nearby/DepartureTimeSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import useFontScale from '@atb/utils/use-font-scale';
import DeparturesTexts from '@atb/translations/screens/Departures';

export type StopPlaceScreenParams = {
  stopPlacePosition: StopPlacePosition;
  selectedQuay?: Quay;
};

type StopPlaceScreenRouteProps = RouteProp<
  NearbyStackParams,
  'StopPlaceScreen'
>;

type quayChipData = {
  item: Quay;
};

export type StopPlaceScreenProps = {
  navigation: StackNavigationProp<NearbyStackParams>;
  route: StopPlaceScreenRouteProps;
};

export default function StopPlaceScreen({
  navigation,
  route: {
    params: {stopPlacePosition, selectedQuay},
  },
}: StopPlaceScreenProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const stopPlace = stopPlacePosition.node?.place;
  const {state, refresh} = useDepartureData(
    stopPlacePosition,
    selectedQuay,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );
  const quayListData: SectionListData<Quay>[] | undefined = stopPlace?.quays
    ? [{data: stopPlace.quays}]
    : undefined;

  useEffect(() => {
    refresh();
  }, [selectedQuay, stopPlace]);

  useMemo(
    () =>
      stopPlace?.quays?.sort((a, b) =>
        publicCodeCompare(a.publicCode, b.publicCode),
      ),
    [stopPlace],
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader title={stopPlace?.name} leftButton={{type: 'back'}} />
      <FlatList
        data={stopPlace?.quays}
        style={styles.quayChipContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Button
            onPress={() => {
              navigation.navigate('StopPlaceScreen', {
                stopPlacePosition,
                selectedQuay: undefined,
              });
            }}
            text={t(DeparturesTexts.quayChips.allStops)}
            color={selectedQuay ? 'secondary_2' : 'secondary_3'}
            style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
          ></Button>
        }
        renderItem={({item}: quayChipData) => (
          <Button
            onPress={() => {
              navigation.navigate('StopPlaceScreen', {
                stopPlacePosition,
                selectedQuay: item,
              });
            }}
            text={
              item.publicCode ? item.name + ' ' + item.publicCode : item.name
            }
            color={selectedQuay?.id === item.id ? 'secondary_3' : 'secondary_2'}
            style={styles.quayChip}
          ></Button>
        )}
      />
      {quayListData && (
        <SectionList
          stickySectionHeadersEnabled={true}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View>
              <DateNavigationSection
                searchTime={searchTime}
                setSearchTime={setSearchTime}
              ></DateNavigationSection>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
          }
          sections={quayListData}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <QuaySection
              quay={item}
              selectedQuayId={selectedQuay?.id}
              data={state.data}
              navigateToQuay={(quay) => {
                navigation.navigate('StopPlaceScreen', {
                  stopPlacePosition,
                  selectedQuay: quay,
                });
              }}
            />
          )}
        />
      )}
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
        text={t(DeparturesTexts.stopPlaceScreen.dateNavigation.prevDay)}
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
            ? t(DeparturesTexts.stopPlaceScreen.dateNavigation.today)
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
        text={t(DeparturesTexts.stopPlaceScreen.dateNavigation.nextDay)}
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

function SeparatorLine(): JSX.Element {
  const {theme} = useTheme();
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: theme.colors.background_1.backgroundColor,
      }}
    />
  );
}

type QuaySectionProps = {
  quay: Quay;
  selectedQuayId: String | undefined;
  data: EstimatedCall[] | null;
  navigateToQuay: (arg0: Quay) => void;
};

function QuaySection({
  quay,
  selectedQuayId,
  data,
  navigateToQuay,
}: QuaySectionProps): JSX.Element {
  const [isHidden, setIsHidden] = useState(false);
  const styles = useStyles();
  const {theme} = useTheme();
  const isSelected = selectedQuayId === quay.id;
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();

  if (selectedQuayId && !isSelected) return <></>;

  return (
    <View>
      <Sections.Section withPadding>
        <Sections.GenericClickableItem
          type="inline"
          onPress={() => {
            setIsHidden(!isHidden);
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
            <ThemeIcon svg={isHidden ? Expand : ExpandLess}></ThemeIcon>
          </View>
        </Sections.GenericClickableItem>
        {!isHidden && (
          <FlatList
            ItemSeparatorComponent={SeparatorLine}
            data={departures}
            renderItem={({item, index}) => (
              <Sections.GenericItem
                radius={
                  selectedQuayId && index === departures.length - 1
                    ? 'bottom'
                    : undefined
                }
              >
                <EstimatedCallLine departure={item}></EstimatedCallLine>
              </Sections.GenericItem>
            )}
            keyExtractor={(item) => item.serviceJourney?.id || ''}
            ListEmptyComponent={
              <>
                {data && (
                  <Sections.GenericItem radius={selectedQuayId && 'bottom'}>
                    <ThemeText color="secondary">
                      {t(DeparturesTexts.stopPlaceScreen.noDepartures)}
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
        {!isSelected && !isHidden && (
          <Sections.LinkItem
            icon="arrow-right"
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            textType="body__primary--bold"
            onPress={() => navigateToQuay(quay)}
          ></Sections.LinkItem>
        )}
      </Sections.Section>
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

function EstimatedCallLine({departure}: EstimatedCallLineProps): JSX.Element {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const line = departure.serviceJourney?.line;

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
  const fontScale = useFontScale();
  const {theme} = useTheme();
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
      {svg && (
        <ThemeIcon
          fill={transportTextColor}
          style={{marginRight: publicCode ? theme.spacings.small : 0}}
          svg={svg}
        ></ThemeIcon>
      )}
      {publicCode && (
        <ThemeText
          style={[
            styles.lineChipText,
            {color: transportTextColor, minWidth: fontScale * 20},
          ]}
          type="body__primary--bold"
        >
          {publicCode}
        </ThemeText>
      )}
    </View>
  );
}

function publicCodeCompare(a?: string, b?: string): number {
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
    padding: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.medium,
    flexDirection: 'row',
  },
  lineChipText: {
    color: theme.colors.primary_2.color,
    textAlign: 'center',
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
