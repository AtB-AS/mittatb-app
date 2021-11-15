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
import {ActivityIndicator, View} from 'react-native';
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
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
import {EstimatedCall, Quay} from '@entur/sdk';
import {TransportMode, TransportSubmode} from '@atb/sdk';
import {useTransportationColor} from '@atb/utils/use-transportation-color';

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
  const {state, refresh, loadMore} = useDepartureData(
    stopPlaceDetails,
    selectedQuay,
  );
  const [expandedQuays, setExpandedQuays] = useState(
    new Array<number>(stopPlaceDetails.quays?.length || 0).fill(5),
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
      <ScrollView>
        {stopPlaceDetails.quays?.map((quay, index) => {
          if (selectedQuay && selectedQuay.id !== quay.id) return;
          return (
            <Sections.Section
              withPadding
              withTopPadding
              key={quay.id.toString()}
            >
              <Sections.HeaderItem
                text={
                  quay.publicCode
                    ? quay.name + ' ' + quay.publicCode
                    : quay.name
                }
                type="inline"
              />
              {!!quay.description && (
                <Sections.ActionItem text={quay.description} />
              )}
              {getDeparturesForQuay(state, quay)
                .slice(0, selectedQuay ? -1 : expandedQuays[index])
                .map((departure) => (
                  <Sections.GenericItem key={departure.serviceJourney.id}>
                    <EstimatedCallLine
                      departure={departure}
                    ></EstimatedCallLine>
                  </Sections.GenericItem>
                ))}
              {getDeparturesForQuay(state, quay).length === 0 && (
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
                    getDeparturesForQuay(state, quay).length,
                  );
                }}
              ></Sections.LinkItem>
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

function getDeparturesForQuay(state: DepartureDataState, quay: Quay) {
  if (!state.data) return [];
  return state.data.filter(
    (departure) => departure.quay && departure.quay?.id === quay.id,
  );
}

function expandQuay(
  quay: Quay,
  index: number,
  expandedQuays: number[],
  setExpandedQuays: Dispatch<SetStateAction<number[]>>,
  loadedDeparturesCount: number,
) {
  const targetCount =
    expandedQuays[index] + DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW;

  if (loadedDeparturesCount >= targetCount) {
    setExpandedQuays(
      expandedQuays.map((value, quayIndex) =>
        quayIndex === index ? loadedDeparturesCount : value,
      ),
    );
  } else {
    // console.log('LOAD MORE DEPARTURES FOR QUAY ' + quay.id);
  }
}

function EstimatedCallLine({departure}: EstimatedCallLineProps): JSX.Element {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const journeyPattern = departure.serviceJourney.journeyPattern;
  if (!journeyPattern) return <></>;

  return (
    <View style={styles.estimatedCallLine}>
      <LineChip
        publicCode={journeyPattern.line.publicCode}
        transportMode={journeyPattern.line.transportMode}
        transportSubmode={journeyPattern.line.transportSubmode}
      ></LineChip>
      <ThemeText style={styles.lineName}>
        {departure.destinationDisplay.frontText}
      </ThemeText>
      <ThemeText type="body__primary--bold">
        {departure.realtime && t(dictionary.missingRealTimePrefix)}
        {formatToClock(departure.expectedDepartureTime, language)}
      </ThemeText>
    </View>
  );
}

type LineChipProps = {
  publicCode?: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
};

function LineChip({
  publicCode,
  transportMode,
  transportSubmode,
}: LineChipProps): JSX.Element {
  const styles = useStyles();
  const svg = getTransportModeSvg(transportMode);
  const transportColor = useTransportationColor(
    transportMode,
    transportSubmode,
  );

  return (
    <View style={[styles.lineChip, {backgroundColor: transportColor}]}>
      {svg && (
        <ThemeIcon
          colorType="primary_2"
          style={styles.lineChipIcon}
          svg={svg || BusSide}
        ></ThemeIcon>
      )}
      <ThemeText style={styles.lineChipText} type="body__primary--bold">
        {publicCode}
      </ThemeText>
    </View>
  );
}

function publicCodeCompare(a: string, b: string): number {
  // Show quays with no public code first
  if (!a) return -1;
  if (!b) return 1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(a) && parseInt(b)) {
    return parseInt(a) - parseInt(b);
  }
  // Otherwise compare as strings (e.g. K1 < K2)
  return a.localeCompare(b);
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  quayChipContainer: {
    backgroundColor: theme.colors.secondary_1.backgroundColor,
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
  },
  lineChip: {
    flexDirection: 'row',
    padding: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.medium,
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 70,
  },
  lineChipIcon: {
    marginRight: theme.spacings.small,
  },
  lineChipText: {
    color: theme.colors.primary_2.color,
    textAlign: 'right',
  },
}));
