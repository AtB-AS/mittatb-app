import {useNavigation} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NearbyScreenNavigationProp} from '.';
import {
  DepartureGroup,
  QuayGroup,
  StopPlaceGroup,
} from '../../api/departures/types';
import {Expand} from '../../assets/svg/icons/navigation';
import * as Section from '../../components/sections';
import {GenericItemProps} from '../../components/sections/generic-item';
import ThemeText from '../../components/text';
import ThemeIcon from '../../components/theme-icon';
import MessageBox from '../../message-box';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import {dictionary, NearbyTexts, useTranslation} from '../../translations';
import {formatToClock} from '../../utils/date';
import insets from '../../utils/insets';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';

type NearbyResultsProps = {
  departures: StopPlaceGroup[] | null;
  onShowMoreOnQuay?(quayId: string): void;
  isFetchingMore?: boolean;
  error?: string;
  isInitialScreen: boolean;
};

export default function NearbyResults({
  departures,
  onShowMoreOnQuay,
  isFetchingMore = false,
  error,
  isInitialScreen,
}: NearbyResultsProps) {
  const styles = useResultsStyle();
  const navigation = useNavigation<NearbyScreenNavigationProp>();
  const {t} = useTranslation();
  const onPress = (departure: EstimatedCall) => {
    const {publicCode, name} = getLineNameFromEstimatedCall(departure);
    const title = publicCode
      ? `${publicCode} ${name}`
      : name
      ? name
      : t(dictionary.travel.line.defaultName);
    navigation.navigate('DepartureDetailsModal', {
      title,
      serviceJourneyId: departure.serviceJourney.id,
      date: departure.date,
      fromQuayId: departure.quay?.id,
    });
  };

  if (isInitialScreen) {
    return (
      <View style={styles.container}>
        <MessageBox type="info">
          <ThemeText>{t(NearbyTexts.results.messages.initial)}</ThemeText>
        </MessageBox>
      </View>
    );
  }

  if (hasNoQuays(departures)) {
    return (
      <View style={styles.container}>
        <MessageBox type="info">
          <ThemeText>{t(NearbyTexts.results.messages.emptyResult)}</ThemeText>
        </MessageBox>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <MessageBox
          type="warning"
          message={error}
          containerStyle={{marginBottom: 24}}
        />
      )}

      {departures && (
        <>
          {departures.map((item) => (
            <StopDepartures
              key={item.stopPlace.id}
              stopPlaceGroup={item}
              onPress={onPress}
              // onShowMoreOnQuay={onShowMoreOnQuay}
            />
          ))}
          <FooterLoader isFetchingMore={isFetchingMore} />
        </>
      )}
    </View>
  );
}
const useResultsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
  },
  centerText: {
    textAlign: 'center',
  },
}));

type FooterLoaderProps = {
  isFetchingMore: boolean;
};
function FooterLoader({isFetchingMore}: FooterLoaderProps) {
  if (!isFetchingMore) {
    return null;
  }
  return <ActivityIndicator style={{marginVertical: 20}} />;
}

type StopDeparturesProps = {
  stopPlaceGroup: StopPlaceGroup;
  onPress?(departure: EstimatedCall): void;
  onShowMoreOnQuay?(quayId: string): void;
};
const StopDepartures = React.memo(
  ({stopPlaceGroup, onPress, onShowMoreOnQuay}: StopDeparturesProps) => {
    if (!stopPlaceGroup.quays.length) {
      return null;
    }
    if (hasNoGroupsWithDepartures(stopPlaceGroup.quays)) {
      return null;
    }

    return (
      <View>
        <Section.ActionItem
          transparent
          text={stopPlaceGroup.stopPlace.name}
          mode="heading-expand"
        />

        {stopPlaceGroup.quays.map((quayGroup) => (
          <QuayGroupItem key={quayGroup.quay.id} quayGroup={quayGroup} />
        ))}
      </View>
    );
  },
);

function QuayGroupItem({quayGroup}: {quayGroup: QuayGroup}) {
  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }
  return (
    <Fragment>
      <Section.Section>
        <Section.HeaderItem text={quayGroup.quay.name} mode="subheading" />

        {quayGroup.group.map((group) => (
          <DepartureGroupItemProps
            group={group}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
          />
        ))}
      </Section.Section>
      <View style={{marginBottom: 12}} />
    </Fragment>
  );
}

type DepartureGroupItemProps = GenericItemProps & {
  group: DepartureGroup;
};
function DepartureGroupItemProps({group, ...props}: DepartureGroupItemProps) {
  if (hasNoDepartures(group)) {
    return null;
  }
  return (
    <Section.GenericItem {...props}>
      <Text>
        {group.lineInfo?.lineNumber} {group.lineInfo?.lineName}
      </Text>
      <ScrollView horizontal>
        {group.departures.map((departure) => (
          <View key={departure.serviceJourneyId} style={{marginHorizontal: 8}}>
            <Text>{formatToClock(departure.aimedTime)}</Text>
          </View>
        ))}
      </ScrollView>
    </Section.GenericItem>
  );
}

type ShowMoreButtonProps = {
  text: string;
  onPress(): void;
};
const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({text, onPress}) => {
  const style = useShowMoreButtonStyle();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={insets.symmetric(8, 12)}
    >
      <View style={style.showMoreButton}>
        <ThemeText type="body">{text}</ThemeText>
        <ThemeIcon svg={Expand} />
      </View>
    </TouchableOpacity>
  );
};
const useShowMoreButtonStyle = StyleSheet.createThemeHook((theme) => ({
  showMoreButton: {
    padding: theme.spacings.medium,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

function humanizeDistance(distanceInMeters: number): string {
  if (distanceInMeters >= 1000) {
    return Math.round(distanceInMeters / 1000) + ' km';
  }
  return Math.ceil(distanceInMeters) + 'm';
}

function hasNoQuays(departures: StopPlaceGroup[] | null) {
  return (
    departures !== null &&
    (departures.length === 0 ||
      departures.every((deps) => deps.quays.length === 0))
  );
}
function hasNoGroupsWithDepartures(departures: QuayGroup[]) {
  return departures.every((q) => !q.group.some((g) => g.departures.length));
}
function hasNoDepartures(group: DepartureGroup) {
  return !Boolean(group.departures.length);
}
