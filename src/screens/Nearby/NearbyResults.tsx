import {useNavigation} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NearbyScreenNavigationProp} from '.';
import {
  DepartureGroup,
  QuayGroup,
  StopPlaceGroup,
} from '../../api/departures/types';
import * as Section from '../../components/sections';
import ThemeText from '../../components/text';
import MessageBox from '../../message-box';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import {dictionary, NearbyTexts, useTranslation} from '../../translations';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';
import LineItem from './section-items/line';
import QuayHeaderItem from './section-items/quay';

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
  // const navigation = useNavigation<NearbyScreenNavigationProp>();
  const {t} = useTranslation();

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
            <StopDepartures key={item.stopPlace.id} stopPlaceGroup={item} />
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
const StopDepartures = React.memo(({stopPlaceGroup}: StopDeparturesProps) => {
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
});

function QuayGroupItem({quayGroup}: {quayGroup: QuayGroup}) {
  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }
  return (
    <Fragment>
      <Section.Section>
        <QuayHeaderItem text={quayGroup.quay.name} />

        {quayGroup.group.map((group) => (
          <LineItem
            group={group}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
          />
        ))}
      </Section.Section>
      <View style={{marginBottom: 12}} />
    </Fragment>
  );
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
