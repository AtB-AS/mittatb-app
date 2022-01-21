import ThemeIcon from '@atb/components/theme-icon';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {BusSide} from '@atb/assets/svg/icons/transportation';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {StopPlacePosition} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {StyleSheet} from '@atb/theme';

type StopPlaceItemProps = {
  stopPlace: StopPlacePosition;
  onPress: (stopPlace: StopPlacePosition) => void;
};

export default function StopPlaceItem({
  stopPlace,
  onPress,
}: StopPlaceItemProps): JSX.Element {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <Sections.Section withPadding key={stopPlace.node?.place?.id}>
      <Sections.GenericClickableItem onPress={() => onPress(stopPlace)}>
        <View style={styles.stopPlaceContainer}>
          <View style={styles.stopPlaceInfo}>
            <ThemeText type="heading__component">
              {stopPlace.node?.place?.name}
            </ThemeText>
            <ThemeText type="body__secondary" style={styles.stopDescription}>
              {stopPlace.node?.place?.description ||
                t(DeparturesTexts.stopPlaceList.stopPlace)}
            </ThemeText>
            <ThemeText type="body__secondary" color="secondary">
              {stopPlace.node?.distance?.toFixed(0) + ' m'}
            </ThemeText>
          </View>
          {stopPlace.node?.place?.transportMode?.map((mode) => (
            <ThemeIcon
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
