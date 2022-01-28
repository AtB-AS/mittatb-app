import ThemeIcon from '@atb/components/theme-icon';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {BusSide} from '@atb/assets/svg/icons/transportation';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {Place, StopPlacePosition} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {StyleSheet} from '@atb/theme';

type StopPlaceItemProps = {
  stopPlacePosition: StopPlacePosition;
  onPress: (place: Place) => void;
};

export default function StopPlaceItem({
  stopPlacePosition,
  onPress,
}: StopPlaceItemProps): JSX.Element {
  const styles = useStyles();
  const {t} = useTranslation();

  const place = stopPlacePosition.node?.place;
  if (!place) return <></>;

  return (
    <Sections.Section withPadding>
      <Sections.GenericClickableItem
        onPress={() => onPress(place)}
        accessibilityHint={t(
          DeparturesTexts.stopPlaceList.a11yStopPlaceItemHint,
        )}
      >
        <View style={styles.stopPlaceContainer}>
          <View style={styles.stopPlaceInfo}>
            <ThemeText type="heading__component">{place.name}</ThemeText>
            <ThemeText type="body__secondary" style={styles.stopDescription}>
              {place.description || t(DeparturesTexts.stopPlaceList.stopPlace)}
            </ThemeText>
            <ThemeText type="body__secondary" color="secondary">
              {stopPlacePosition.node?.distance?.toFixed(0) + ' m'}
            </ThemeText>
          </View>
          {place.transportMode?.map((mode) => (
            <ThemeIcon
              key={mode}
              style={styles.stopPlaceIcon}
              size="large"
              svg={getTransportModeSvg(mode) || BusSide}
            ></ThemeIcon>
          ))}
        </View>
      </Sections.GenericClickableItem>
    </Sections.Section>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  stopPlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexGrow: 1,
  },
  stopPlaceInfo: {
    flexShrink: 1,
    flexGrow: 1,
  },
  stopDescription: {
    marginVertical: theme.spacings.xSmall,
  },
  stopPlaceIcon: {
    marginLeft: theme.spacings.medium,
  },
}));
