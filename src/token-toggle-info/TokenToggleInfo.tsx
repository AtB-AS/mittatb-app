import Warning from '@atb/assets/svg/color/icons/status/Warning';
import Info from '@atb/assets/svg/color/icons/status/Info';
import Error from '@atb/assets/svg/color/icons/status/Error';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {
  formatToShortDateWithYear,
  formatToVerboseFullDate,
} from '@atb/utils/date';
import {StyleSheet} from '@atb/theme';
import {StaticColor} from '@atb/theme/colors';
import {useTokenToggleDetails} from '@atb/mobile-token/use-token-toggle-details';

type TokenToggleInfoProps = {
  style?: StyleProp<ViewStyle>;
  textColor?: StaticColor;
};

export const TokenToggleInfo = ({style, textColor}: TokenToggleInfoProps) => {
  const styles = useStyles();
  const {data: tokenToggleDetails, isLoading} = useTokenToggleDetails();

  const limit = tokenToggleDetails?.toggleLimit ?? 0;

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
  textColor?: StaticColor;
};

const TokenToggleContent = ({
  style,
  toggleLimit,
  textColor,
}: TokenToggleContentProps) => {
  const {t, language} = useTranslation();
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
      <ThemeIcon svg={getToggleInfoIcon(toggleLimit)} />
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

const getToggleInfoIcon = (toggleLimit: number) => {
  switch (toggleLimit) {
    case 0:
      return Error;
    case 1:
      return Warning;
    default:
      return Info;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    marginLeft: theme.spacings.xSmall,
    flex: 1,
  },
  loader: {
    alignSelf: 'center',
    flex: 1,
  },
}));
