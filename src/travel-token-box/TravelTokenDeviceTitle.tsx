import {ThemeText} from '@atb/components/text';
import {useTranslation, TravelTokenTexts} from '@atb/translations';
import {Token} from '@atb/mobile-token';
import {View} from 'react-native';
import {ContrastColor, Theme} from '@atb/theme/colors';
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
    const prefixX = ' XXXX XX';
    const travelCardIdOuttake =
      travelCardId?.substring(0, 2) + ' ' + travelCardId?.substring(2);
    const postfixX = 'X';
    const a11yLabel = prefixX + travelCardIdOuttake + postfixX;
    return (
      <View
        style={styles.travelCardTitleContainer}
        accessible
        accessibilityLabel={a11yLabel}
      >
        <ThemeText
          type="body__secondary"
          color={themeTextColor}
          style={styles.transparent}
        >
          {prefixX}
        </ThemeText>
        <ThemeText
          type="body__secondary--bold"
          color={themeTextColor}
          testID="travelCardNumber"
        >
          {travelCardIdOuttake}
        </ThemeText>
        <ThemeText
          type="body__secondary"
          color={themeTextColor}
          style={styles.transparent}
        >
          {postfixX}
        </ThemeText>
      </View>
    );
  } else {
    return (
      <ThemeText
        type="body__secondary"
        color={themeTextColor}
        style={styles.tokenName}
        testID="mobileTokenName"
      >
        {inspectableToken?.name ||
          t(TravelTokenTexts.toggleToken.unnamedDevice)}
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
    marginBottom: theme.spacing.large,
  },
  transparent: {
    opacity: 0.6,
  },
}));
