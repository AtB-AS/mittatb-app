import {ThemeText} from '@atb/components/text';
import {useTranslation, TravelTokenTexts} from '@atb/translations';
import {Token} from '@atb/mobile-token';
import {View} from 'react-native';
import {ContrastColor, Theme} from '@atb-as/theme';
import {StyleSheet} from '@atb/theme';

export const TravelTokenDeviceTitle = ({
  inspectableToken,
  themeTextColor,
}: {
  inspectableToken: Token;
  themeTextColor: ContrastColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  if (inspectableToken.type === 'travel-card') {
    const travelCardId = inspectableToken.travelCardId;
    return (
      <View style={styles.travelCardTitleContainer}>
        <ThemeText color={themeTextColor} style={styles.transparent}>
          {' XXXX XX'}
        </ThemeText>
        <ThemeText
          type="heading__title"
          color={themeTextColor}
          testID="travelCardNumber"
        >
          {travelCardId?.substring(0, 2) + ' ' + travelCardId?.substring(2)}
        </ThemeText>
        <ThemeText color={themeTextColor} style={styles.transparent}>
          X
        </ThemeText>
      </View>
    );
  } else {
    return (
      <ThemeText
        type="heading__title"
        color={themeTextColor}
        style={styles.tokenName}
        testID="mobileTokenName"
      >
        {(inspectableToken?.name ||
          t(TravelTokenTexts.toggleToken.unnamedDevice)) +
          (inspectableToken?.isThisDevice
            ? t(
                TravelTokenTexts.toggleToken.radioBox.phone.selection
                  .thisDeviceSuffix,
              )
            : t(
                TravelTokenTexts.toggleToken.radioBox.phone.selection
                  .otherDeviceSuffix,
              ))}
      </ThemeText>
    );
  }
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  travelCardTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tokenName: {
    marginBottom: theme.spacings.large,
  },
  transparent: {
    opacity: 0.6,
  },
}));
