import {useMobileTokenContext} from '@atb/mobile-token';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';

import React from 'react';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {Button} from '@atb/components/button'; // re-add when new onboarding ready
import {InteractiveColor} from '@atb/theme/colors';
import {TravelTokenDeviceTitle} from './TravelTokenDeviceTitle';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {MessageInfoText} from '@atb/components/message-info-text';

export function TravelTokenBox({
  showIfThisDevice,
  alwaysShowErrors,
  interactiveColor,
}: {
  showIfThisDevice: boolean;
  alwaysShowErrors: boolean;
  interactiveColor: InteractiveColor;
}) {
  const {theme} = useThemeContext();
  const themeTextColor = interactiveColor ?? theme.color.interactive[2];

  const styles = useStyles(themeTextColor)();
  const {t} = useTranslation();
  const {mobileTokenStatus, isInspectable, tokens, retry} =
    useMobileTokenContext();

  const navigation = useNavigation<RootNavigationProps>();
  const onPressChangeButton = () =>
    navigation.navigate('Root_SelectTravelTokenScreen');

  if (mobileTokenStatus === 'loading') {
    return <ActivityIndicator size="large" />;
  }

  const showTokensNotWorkingError =
    mobileTokenStatus === 'error' ||
    (alwaysShowErrors && mobileTokenStatus === 'fallback');
  if (showTokensNotWorkingError) {
    return (
      <MessageInfoBox
        type="warning"
        title={t(TravelTokenBoxTexts.errorMessages.tokensNotLoadedTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.tokensNotLoaded)}
        onPressConfig={{
          action: retry,
          text: t(dictionary.retry),
        }}
      />
    );
  }

  if (isInspectable && !showIfThisDevice) {
    return null;
  }

  const inspectableToken = tokens.find((t) => t.isInspectable);
  const isTravelCard = inspectableToken?.type === 'travel-card';

  return (
    <View style={styles.container} testID="travelTokenBox">
      {inspectableToken ? (
        <View style={styles.content}>
          {isTravelCard ? (
            <ThemedTokenTravelCard
              style={{maxWidth: 90}}
              testID={inspectableToken.type + 'Icon'}
            />
          ) : (
            <ThemedTokenPhone testID={inspectableToken.type + 'Icon'} />
          )}
          <View style={styles.activeTravelTokenInfo}>
            <ThemeText
              typography="body__primary--bold"
              color={themeTextColor.default}
            >
              {t(TravelTokenBoxTexts.title) +
                t(
                  isTravelCard
                    ? TravelTokenBoxTexts.tcardName
                    : inspectableToken.isThisDevice
                    ? TravelTokenBoxTexts.thisDeviceSuffix
                    : TravelTokenBoxTexts.otherDeviceSuffix,
                )}
            </ThemeText>

            <TravelTokenDeviceTitle
              inspectableToken={inspectableToken}
              themeTextColor={themeTextColor.default}
            />
          </View>
        </View>
      ) : (
        <MessageInfoText
          type="error"
          textColor={interactiveColor.default}
          message={t(TravelTokenBoxTexts.errorMessages.noInspectableToken)}
        />
      )}
      <Button
        mode="secondary"
        backgroundColor={themeTextColor.default}
        onPress={onPressChangeButton}
        text={t(TravelTokenBoxTexts.change)}
        testID="continueWithoutChangingTravelTokenButton"
      />
    </View>
  );
}

const useStyles = (interactiveColor: InteractiveColor) =>
  StyleSheet.createThemeHook((theme: Theme) => ({
    container: {
      backgroundColor: interactiveColor.default.background,
      padding: theme.spacing.xLarge,
      rowGap: theme.spacing.medium,
      borderRadius: theme.border.radius.regular,
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      columnGap: theme.spacing.medium,
    },
    activeTravelTokenInfo: {
      flex: 1,
      rowGap: theme.spacing.xSmall,
    },
  }));
