import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator} from 'react-native';
import {
  formatToShortDateWithYear,
  formatToVerboseFullDate,
} from '@atb/utils/date';
import {StyleSheet} from '@atb/theme';
import {ContrastColor, Statuses} from '@atb/theme/colors';
import {useTokenToggleDetailsQuery} from '@atb/modules/mobile-token';
import {MessageInfoText} from '@atb/components/message-info-text';

type TokenToggleInfoProps = {
  textColor?: ContrastColor;
};

export const TokenToggleInfo = ({textColor}: TokenToggleInfoProps) => {
  const styles = useStyles();
  const {data, isLoading} = useTokenToggleDetailsQuery();

  const limit = data?.toggleLimit ?? 0;

  return isLoading ? (
    <ActivityIndicator style={styles.loader} />
  ) : (
    <TokenToggleContent toggleLimit={limit} textColor={textColor} />
  );
};

type TokenToggleContentProps = {
  toggleLimit: number;
  textColor?: ContrastColor;
};

const TokenToggleContent = ({
  toggleLimit,
  textColor,
}: TokenToggleContentProps) => {
  const {t, language} = useTranslation();
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
    <MessageInfoText
      message={getToggleInfo(toggleLimit, countRenewalDate)}
      type={getToggleInfoIcon(toggleLimit)}
      a11yLabel={getToggleInfo(toggleLimit, countRenewalDateA11yLabel)}
      textColor={textColor}
      testID="tokenToggleInfo"
    />
  );
};

const getToggleInfoIcon = (toggleLimit: number): Statuses => {
  switch (toggleLimit) {
    case 0:
      return 'error';
    case 1:
      return 'warning';
    default:
      return 'info';
  }
};

const useStyles = StyleSheet.createThemeHook(() => ({
  loader: {
    alignSelf: 'center',
    flex: 1,
  },
}));
