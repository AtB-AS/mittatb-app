import {FlatList} from 'react-native-gesture-handler';
import {ActivityIndicator, ViewStyle} from 'react-native';
import {Button} from '@atb/components/button';
import React from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
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
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[1];

  const isMissingQuays = place.quays === undefined;

  return (
    <FlatList
      data={place.quays}
      style={[styles.quayChipContainer, style]}
      horizontal={!isMissingQuays}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.quayChipContentContainer}
      ListHeaderComponent={
        <>
          {isMissingQuays ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button
              expanded={true}
              onPress={() => onPress()}
              text={t(DeparturesTexts.quayChips.allStops)}
              interactiveColor={interactiveColor}
              active={!selectedQuay}
              accessibilityHint={t(DeparturesTexts.quayChips.a11yAllStopsHint)}
              testID="allStopsSelectionButton"
            />
          )}
        </>
      }
      renderItem={({item}: quayChipData) => (
        <Button
          expanded={true}
          onPress={() => onPress(item.id)}
          text={getQuayName(item)}
          interactiveColor={interactiveColor}
          active={selectedQuay?.id === item.id}
          accessibilityHint={
            t(DeparturesTexts.quayChips.a11yHint) + getQuayName(item)
          }
          testID="quaySelectionButton"
        />
      )}
    />
  );
};

function getQuayName(quay: Quay): string {
  return quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  quayChipContainer: {
    backgroundColor: theme.color.background.accent[0].background,
    flexShrink: 0,
    flexGrow: 0,
    gap: theme.spacing.medium,
  },
  quayChipContentContainer: {
    gap: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
}));

export {StopPlaceAndQuaySelection};
