import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {
  formatToShortDateWithYear,
  formatToVerboseFullDate,
} from '@atb/utils/date';
import React from 'react';
import Warning from '@atb/assets/svg/color/icons/status/Warning';
import Info from '@atb/assets/svg/color/icons/status/Info';
import Error from '@atb/assets/svg/color/icons/status/Error';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';

const ChangeTokenAction = ({
  onChange,
  toggleLimit,
  shouldShowLoader,
}: {
  onChange: () => void;
  toggleLimit?: number;
  shouldShowLoader?: boolean;
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {isError, isLoading} = useMobileTokenContextState();
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
    <Section style={styles.changeTokenButton}>
      <LinkSectionItem
        type="spacious"
        text={t(TravelTokenTexts.travelToken.changeTokenButton)}
        disabled={isError || isLoading || toggleLimit === 0}
        onPress={onChange}
        testID="switchTokenButton"
        icon={<ThemeIcon svg={Swap} />}
      />

      {shouldShowLoader ? (
        <GenericSectionItem>
          <ActivityIndicator style={styles.loader} />
        </GenericSectionItem>
      ) : toggleLimit !== undefined ? (
        <GenericSectionItem>
          <View style={styles.tokenInfoView}>
            <ThemeIcon svg={getToggleInfoIcon(toggleLimit)} />
            <ThemeText
              style={styles.tokenInfo}
              accessibilityLabel={getToggleInfo(
                toggleLimit,
                countRenewalDateA11yLabel,
              )}
              accessible={true}
            >
              {getToggleInfo(toggleLimit, countRenewalDate)}
            </ThemeText>
          </View>
        </GenericSectionItem>
      ) : null}
    </Section>
  );
};

export {ChangeTokenAction};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  changeTokenButton: {
    marginBottom: theme.spacings.medium,
  },
  loader: {alignSelf: 'center', flex: 1},
  tokenInfoView: {flexDirection: 'row'},
  tokenInfo: {marginLeft: theme.spacings.xSmall, flex: 1},
}));
