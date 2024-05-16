import {
  GeofencingZoneCategoryKey,
  GeofencingZoneCategoryProps,
  shadows,
} from '@atb/components/map';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
} from '@atb/translations/screens/subscreens/MobilityTexts';

type GeofencingZoneExplanationProps = {
  geofencingZoneCategoryProps: GeofencingZoneCategoryProps<GeofencingZoneCategoryKey>;
};

export const GeofencingZoneExplanation = ({
  geofencingZoneCategoryProps,
}: GeofencingZoneExplanationProps) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {top} = useSafeAreaInsets();

  return (
    <View style={[styles.geofencingZoneExplanationContainer, {top}]}>
      <View style={styles.geofencingZoneExplanation}>
        <ThemeText
          type="body__primary--bold"
          color="primary"
          style={styles.text}
        >
          {t(
            GeofencingZoneExplanations[geofencingZoneCategoryProps.code].title,
          )}
        </ThemeText>
        <ThemeText type="body__secondary" color="secondary" style={styles.text}>
          {t(
            GeofencingZoneExplanations[geofencingZoneCategoryProps.code]
              .description,
          )}
          {geofencingZoneCategoryProps.isStationParking &&
            '. ' + t(GeofencingZoneExtraExplanations.isStationParking)}
        </ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  geofencingZoneExplanationContainer: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  geofencingZoneExplanation: {
    ...shadows,
    ...{
      padding: theme.spacings.medium,
      marginHorizontal: theme.spacings.medium,
      borderRadius: theme.border.radius.regular,
      alignItems: 'center',
      backgroundColor: theme.interactive.interactive_2.default.background,
      rowGap: theme.spacings.xSmall,
    },
  },
  text: {
    textAlign: 'left',
  },
}));
