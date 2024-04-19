import {GeofencingZoneCategoryCode} from '@atb/components/map';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GeofencingZoneExplanations} from '@atb/translations/screens/subscreens/MobilityTexts';

type GeofencingZoneExplanationProps = {
  geofencingZoneCategoryCode: GeofencingZoneCategoryCode;
};

export const GeofencingZoneExplanation = ({
  geofencingZoneCategoryCode,
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
          {t(GeofencingZoneExplanations[geofencingZoneCategoryCode].title)}
        </ThemeText>
        <ThemeText type="body__secondary" color="secondary" style={styles.text}>
          {t(
            GeofencingZoneExplanations[geofencingZoneCategoryCode].description,
          )}
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
    padding: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    alignItems: 'center',
    backgroundColor: theme.interactive.interactive_2.default.background,
    // borderWidth: 2,
    // borderColor: theme.interactive.interactive_2.default.text,
    rowGap: theme.spacings.xSmall,
  },
  text: {
    textAlign: 'center',
  },
}));
