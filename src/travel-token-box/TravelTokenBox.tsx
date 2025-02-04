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
import {TravelTokenDeviceTitle} from './TravelTokenDeviceTitle';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {MessageInfoText} from '@atb/components/message-info-text';

const getInteractiveColor = (th: Theme) => th.color.interactive[2];

export function TravelTokenBox({
  showIfThisDevice,
  alwaysShowErrors,
}: {
  showIfThisDevice: boolean;
  alwaysShowErrors: boolean;
}) {
  const {theme} = useThemeContext();
  const interactiveColor = getInteractiveColor(theme);

  const styles = useStyles();
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
              color={interactiveColor.default}
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
              themeTextColor={interactiveColor.default}
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
        expanded={true}
        mode="secondary"
        backgroundColor={interactiveColor.default}
        onPress={onPressChangeButton}
        text={
          inspectableToken
            ? t(TravelTokenBoxTexts.change)
            : t(TravelTokenBoxTexts.select)
        }
        testID="continueWithoutChangingTravelTokenButton"
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: getInteractiveColor(theme).default.background,
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
