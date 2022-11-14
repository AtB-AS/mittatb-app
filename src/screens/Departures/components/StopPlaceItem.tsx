import ThemeIcon from '@atb/components/theme-icon';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {NearestStopPlaceNode, StopPlace} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {StyleSheet} from '@atb/theme';

type StopPlaceItemProps = {
  stopPlaceNode: NearestStopPlaceNode;
  onPress: (place: StopPlace) => void;
  testID: string;
};

export default function StopPlaceItem({
  stopPlaceNode,
  onPress,
  testID,
}: StopPlaceItemProps): JSX.Element {
  const styles = useStyles();
  const {t} = useTranslation();

  const place = stopPlaceNode.place;
  if (!place) return <></>;

  const description =
    place.description || t(DeparturesTexts.stopPlaceList.stopPlace);
  const distance = stopPlaceNode.distance?.toFixed(0);

  return (
    <Sections.Section withPadding>
      <Sections.GenericClickableItem
        onPress={() => onPress(place)}
        accessibilityLabel={`${place.name}, ${description}, ${
          distance ? distance + 'm' : ''
        }`}
        accessibilityHint={t(
          DeparturesTexts.stopPlaceList.a11yStopPlaceItemHint,
        )}
      >
        <View style={styles.stopPlaceContainer} testID={testID}>
          <View style={styles.stopPlaceInfo}>
            <ThemeText type="heading__component" testID={testID + 'Name'}>
              {place.name}
            </ThemeText>
            <ThemeText type="body__secondary" style={styles.stopDescription}>
              {description}
            </ThemeText>
            {distance && (
              <ThemeText type="body__secondary" color="secondary">
                {distance + ' m'}
              </ThemeText>
            )}
          </View>
          {place.transportMode?.map((mode) => (
            <ThemeIcon
              key={mode}
              style={styles.stopPlaceIcon}
              size="large"
              svg={getTransportModeSvg(mode) || Bus}
            />
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
