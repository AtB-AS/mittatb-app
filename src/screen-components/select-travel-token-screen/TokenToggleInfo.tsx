import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {
  formatToShortDateWithYear,
  formatToVerboseFullDate,
} from '@atb/utils/date';
import {StyleSheet} from '@atb/theme';
import {ContrastColor, Statuses} from '@atb/theme/colors';
import {MessageInfoText} from '@atb/components/message-info-text';

type TokenToggleInfoProps = {
  textColor?: ContrastColor;
  toggleLimit: number;
  isLoading: boolean;
};

export const TokenToggleInfo = ({
  textColor,
  toggleLimit,
  isLoading,
}: TokenToggleInfoProps) => {
  const styles = useStyles();

  return isLoading ? (
    <View style={styles.loader} />
  ) : (
    <TokenToggleContent toggleLimit={toggleLimit} textColor={textColor} />
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
