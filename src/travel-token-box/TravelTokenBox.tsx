import {useMobileTokenContextState} from '@atb/mobile-token';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';

import React from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {Button} from '@atb/components/button'; // re-add when new onboarding ready
import {InteractiveColor, getInteractiveColor} from '@atb/theme/colors';
import {TravelTokenDeviceTitle} from './TravelTokenDeviceTitle';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';

export function TravelTokenBox({
  showIfThisDevice,
  alwaysShowErrors,
  interactiveColor = 'interactive_1',
}: {
  showIfThisDevice: boolean;
  alwaysShowErrors?: boolean;
  interactiveColor?: InteractiveColor;
}) {
  const styles = useStyles(interactiveColor)();
  const {t} = useTranslation();
  const {deviceInspectionStatus, mobileTokenStatus, tokens, retry} =
    useMobileTokenContextState();

  const {themeName} = useTheme();
  const themeTextColor = getInteractiveColor(
    themeName,
    interactiveColor,
  ).default;

  const navigation = useNavigation<RootNavigationProps>();
  const onPressChangeButton = () =>
    navigation.navigate('Root_SelectTravelTokenScreen');

  if (deviceInspectionStatus === 'loading') {
    return (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const showTokensNotWorkingError =
    mobileTokenStatus === 'error' &&
    (alwaysShowErrors || deviceInspectionStatus === 'not-inspectable');
  if (showTokensNotWorkingError) {
    return (
      <MessageInfoBox
        type="warning"
        title={t(TravelTokenBoxTexts.errorMessages.tokensNotLoadedTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.tokensNotLoaded)}
        style={styles.errorMessage}
        onPressConfig={{
          action: retry,
          text: t(dictionary.retry),
        }}
      />
    );
  }

  if (deviceInspectionStatus === 'inspectable' && !showIfThisDevice) {
    return null;
  }

  const inspectableToken = tokens.find((t) => t.isInspectable);
  if (!inspectableToken)
    return (
      <MessageInfoBox
        type="warning"
        isMarkdown={true}
        title={t(TravelTokenBoxTexts.errorMessages.noInspectableTokenTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.noInspectableToken)}
        style={styles.errorMessage}
      />
    );

  const isTravelCard = inspectableToken.type === 'travel-card';

  return (
    <View style={styles.container} testID="travelTokenBox">
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
            type="body__primary--bold"
            color={themeTextColor}
            style={styles.travelTokenBoxTitle}
          >
            {t(TravelTokenBoxTexts.title) +
              t(
                isTravelCard
                  ? TravelTokenBoxTexts.tcardName
                  : inspectableToken?.isThisDevice
                  ? TravelTokenBoxTexts.thisDeviceSuffix
                  : TravelTokenBoxTexts.otherDeviceSuffix,
              )}
          </ThemeText>
          {inspectableToken && (
            <TravelTokenDeviceTitle
              inspectableToken={inspectableToken}
              themeTextColor={themeTextColor}
            />
          )}
        </View>
      </View>
      <Button
        mode="secondary"
        backgroundColor={interactiveColor}
        onPress={onPressChangeButton}
        text={t(TravelTokenBoxTexts.change)}
        testID="continueWithoutChangingTravelTokenButton"
      />
    </View>
  );
}

const useStyles = (interactiveColor: InteractiveColor) =>
  StyleSheet.createThemeHook((theme: Theme) => ({
    loadingIndicator: {
      marginBottom: theme.spacings.medium,
    },
    errorMessage: {
      marginBottom: theme.spacings.medium,
    },

    container: {
      backgroundColor: theme.interactive[interactiveColor].default.background,
      padding: theme.spacings.xLarge,
      borderRadius: theme.border.radius.regular,
      marginBottom: theme.spacings.medium,
    },
    content: {
      //marginBottom: theme.spacings.large, // re-add when new onboarding ready
      display: 'flex',
      flexDirection: 'row',
    },
    activeTravelTokenInfo: {
      flex: 1,
      marginLeft: theme.spacings.medium,
    },
    travelTokenBoxTitle: {
      marginBottom: theme.spacings.xSmall,
    },
  }));
