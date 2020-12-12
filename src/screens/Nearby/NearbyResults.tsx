import React, {Fragment, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {QuayGroup, StopPlaceGroup} from '../../api/departures/types';
import * as Section from '../../components/sections';
import ThemeText from '../../components/text';
import {Location} from '../../favorites/types';
import MessageBox from '../../message-box';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import {NearbyTexts, useTranslation} from '../../translations';
import LineItem from './section-items/line';
import MoreItem from './section-items/more';
import QuayHeaderItem from './section-items/quay';

type NearbyResultsProps = {
  departures: StopPlaceGroup[] | null;
  currentLocation?: Location;
  isFetchingMore?: boolean;
  error?: string;
  isInitialScreen: boolean;
};

export default function NearbyResults({
  departures,
  isFetchingMore = false,
  error,
  isInitialScreen,
  currentLocation,
}: NearbyResultsProps) {
  const styles = useResultsStyle();
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
            <StopDepartures
              key={item.stopPlace.id}
              stopPlaceGroup={item}
              currentLocation={currentLocation}
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
  currentLocation?: Location;
};
const StopDepartures = React.memo(
  ({stopPlaceGroup, currentLocation}: StopDeparturesProps) => {
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
          <QuayGroupItem
            key={quayGroup.quay.id}
            quayGroup={quayGroup}
            currentLocation={currentLocation}
          />
        ))}
      </View>
    );
  },
);

const LIMIT_SIZE = 5;

function QuayGroupItem({
  quayGroup,
  currentLocation,
}: {
  quayGroup: QuayGroup;
  currentLocation?: Location;
}) {
  const [limit, setLimit] = useState(LIMIT_SIZE);

  useEffect(() => {
    setLimit(LIMIT_SIZE);
  }, [quayGroup.quay.id]);

  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }
  return (
    <Fragment>
      <Section.Section>
        <QuayHeaderItem
          quay={quayGroup.quay}
          currentLocation={currentLocation}
        />

        {quayGroup.group.slice(0, limit).map((group) => (
          <LineItem
            group={group}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
          />
        ))}
        {quayGroup.group.length >= limit && (
          <MoreItem
            onPress={() => setLimit(limit + LIMIT_SIZE)}
            text="Vis flere avganger"
          />
        )}
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
