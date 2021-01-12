import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LocationWithMetadata} from '../../../../favorites/types';
import {StyleSheet} from '../../../../theme';
import BackHeader from '../../BackHeader';
import {LocationSearchNavigationProp} from './';
import * as Sections from '../../../../components/sections';
import {fetchLinesOnStopPlace, StopPlaceLine} from '../../../../api/lines';

export type SelectLineRouteParams = {
  location: LocationWithMetadata;
};

export type SelectLineProps = {
  navigation: LocationSearchNavigationProp;
  route: {params: SelectLineRouteParams};
};

export default function SelectLine({navigation, route}: SelectLineProps) {
  const styles = useThemeStyles();
  const {location} = route.params;
  const lines = useLineData(location);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
      <BackHeader title="Legg til favorittavgang" />

      <Sections.Section withTopPadding withPadding>
        <Sections.LabelItem prefix="Fra" text={location.name} />
      </Sections.Section>
    </SafeAreaView>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
  },
}));

function useLineData(location: LocationWithMetadata) {
  const [lines, setLines] = useState<StopPlaceLine>();

  useEffect(() => {
    async function getData() {
      const data = await fetchLinesOnStopPlace(location.id);
      setLines(data);
    }

    getData();
  }, [location.id]);

  return lines;
}
