import {FlatList} from 'react-native-gesture-handler';
import {ActivityIndicator, ViewStyle} from 'react-native';
import {Button} from '@atb/components/button';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {StopPlace, Quay} from '@atb/api/types/departures';

type quayChipData = {
  item: Quay;
};

const StopPlaceAndQuaySelection = ({
  place,
  selectedQuay,
  onPress,
  style,
}: {
  place: StopPlace;
  selectedQuay?: Quay;
  onPress: (selectedQuayId?: string) => void;
  style?: ViewStyle;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const isMissingQuays = place.quays === undefined;

  return (
    <FlatList
      data={place.quays}
      style={[styles.quayChipContainer, style]}
      horizontal={!isMissingQuays}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          {isMissingQuays ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button
              onPress={() => onPress()}
              text={t(DeparturesTexts.quayChips.allStops)}
              interactiveColor="interactive_1"
              active={!selectedQuay}
              style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
              accessibilityHint={t(DeparturesTexts.quayChips.a11yAllStopsHint)}
              testID="allStopsSelectionButton"
            ></Button>
          )}
        </>
      }
      renderItem={({item}: quayChipData) => (
        <Button
          onPress={() => onPress(item.id)}
          text={getQuayName(item)}
          interactiveColor="interactive_1"
          active={selectedQuay?.id === item.id}
          style={styles.quayChip}
          accessibilityHint={
            t(DeparturesTexts.quayChips.a11yHint) + getQuayName(item)
          }
          testID="quaySelectionButton"
        ></Button>
      )}
    />
  );
};

function getQuayName(quay: Quay): string {
  return quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  quayChipContainer: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flexShrink: 0,
    flexGrow: 0,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
}));

export {StopPlaceAndQuaySelection};
