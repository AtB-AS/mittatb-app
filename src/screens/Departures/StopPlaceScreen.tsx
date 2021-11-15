import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import React, {useMemo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StopPlaceDetails} from '@atb/sdk';
import {StackNavigationProp} from '@react-navigation/stack';
import {NearbyStackParams} from '../Nearby';
import {RouteProp} from '@react-navigation/native';
import Button from '@atb/components/button';
import {useDepartureData} from './DepartureState';
import ThemeText from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {BusSide} from '@atb/assets/svg/icons/transportation';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
import {EstimatedCall} from '@entur/sdk';
import {TransportMode, TransportSubmode} from '@atb/sdk';
import {useTransportationColor} from '@atb/utils/use-transportation-color';

export type StopPlaceScreenParams = {
  stopPlaceDetails: StopPlaceDetails;
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
    params: {stopPlaceDetails},
  },
}: LoginOnboardingProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const {state, refresh, loadMore} = useDepartureData(stopPlaceDetails);

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
            console.log('refresh');
            console.log(state.data);
            refresh();
          }}
          text="Alle stopp"
          color="secondary_3"
          style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
        ></Button>
        {stopPlaceDetails.quays?.map((quay) => (
          <Button
            key={quay.id}
            onPress={() => {}}
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            color="secondary_4"
            style={styles.quayChip}
          ></Button>
        ))}
      </ScrollView>
      <ScrollView>
        {stopPlaceDetails.quays?.map((quay) => (
          <Sections.Section withPadding withTopPadding key={quay.id.toString()}>
            <Sections.HeaderItem
              text={
                quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
              }
            />
            {!!quay.description && (
              <Sections.ActionItem text={quay.description} />
            )}
            {state.data &&
              state.data
                .filter(
                  (departure) =>
                    departure.quay && departure.quay?.id === quay.id,
                )
                .map((departure) => (
                  <Sections.GenericItem key={departure.serviceJourney.id}>
                    <EstimatedCallLine
                      departure={departure}
                    ></EstimatedCallLine>
                  </Sections.GenericItem>
                ))}
            {state.data &&
              state.data.filter(
                (departure) => departure.quay && departure.quay?.id === quay.id,
              ).length === 0 && (
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
          </Sections.Section>
        ))}
      </ScrollView>
    </View>
  );
}

type EstimatedCallLineProps = {
  departure: EstimatedCall;
};

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
