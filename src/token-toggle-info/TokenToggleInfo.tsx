import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {
  formatToShortDateWithYear,
  formatToVerboseFullDate,
} from '@atb/utils/date';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ContrastColor, Mode} from '@atb/theme/colors';
import {useTokenToggleDetailsQuery} from '@atb/mobile-token/use-token-toggle-details';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';

type TokenToggleInfoProps = {
  style?: StyleProp<ViewStyle>;
  textColor?: ContrastColor;
};

export const TokenToggleInfo = ({style, textColor}: TokenToggleInfoProps) => {
  const styles = useStyles();
  const {data, isLoading} = useTokenToggleDetailsQuery();

  const limit = data?.toggleLimit ?? 0;

  return isLoading ? (
    <ActivityIndicator style={[styles.loader, style]} />
  ) : (
    <TokenToggleContent
      toggleLimit={limit}
      textColor={textColor}
      style={style}
    />
  );
};

type TokenToggleContentProps = {
  style?: StyleProp<ViewStyle>;
  toggleLimit: number;
  textColor?: ContrastColor;
};

const TokenToggleContent = ({
  style,
  toggleLimit,
  textColor,
}: TokenToggleContentProps) => {
  const {t, language} = useTranslation();
  const {themeName} = useThemeContext();
  const styles = useStyles();
  const now = new Date();
  const nextMonthStartDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const countRenewalDate = formatToShortDateWithYear(
    nextMonthStartDate,
    language,
  );

  const countRenewalDateA11yLabel = formatToVerboseFullDate(
    nextMonthStartDate,
    language,
  );

  const getToggleInfo = (toggleLimit: number, countRenewalDate: string) => {
    switch (toggleLimit) {
      case 0:
        return t(
          TravelTokenTexts.travelToken.zeroToggleCountLeftInfo(
            countRenewalDate,
          ),
        );
      case 1:
        return t(
          TravelTokenTexts.travelToken.oneToggleCountLeftInfo(countRenewalDate),
        );
      default:
        return t(
          TravelTokenTexts.travelToken.toggleCountLimitInfo(
            toggleLimit,
            countRenewalDate,
          ),
        );
    }
  };

  return (
    <View style={style}>
      <ThemeIcon svg={getToggleInfoIcon(toggleLimit, themeName)} />
      <ThemeText
        style={styles.content}
        accessibilityLabel={getToggleInfo(
          toggleLimit,
          countRenewalDateA11yLabel,
        )}
        color={textColor}
        accessible={true}
      >
        {getToggleInfo(toggleLimit, countRenewalDate)}
      </ThemeText>
    </View>
  );
};

const getToggleInfoIcon = (toggleLimit: number, themeName: Mode) => {
  switch (toggleLimit) {
    case 0:
      return messageTypeToIcon('error', true, themeName);
    case 1:
      return messageTypeToIcon('warning', true, themeName);
    default:
      return messageTypeToIcon('info', true, themeName);
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    marginLeft: theme.spacing.xSmall,
    flex: 1,
  },
  loader: {
    alignSelf: 'center',
    flex: 1,
  },
}));
