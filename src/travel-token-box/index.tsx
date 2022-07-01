import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {ActivityIndicator, View} from 'react-native';
import ThemeText from '@atb/components/text';

import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';
import MessageBox from '@atb/components/message-box';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {
  findInspectable,
  getDeviceName,
  getTravelCardId,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {RemoteToken} from '@atb/mobile-token/types';

export default function TravelTokenBox({
  showIfThisDevice,
  showHowToChangeHint,
  alwaysShowErrors,
}: {
  showIfThisDevice: boolean;
  showHowToChangeHint?: boolean;
  alwaysShowErrors?: boolean;
}) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {deviceIsInspectable, remoteTokens, isLoading, fallbackEnabled} =
    useMobileTokenContextState();

  if (isLoading) {
    return (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const errorMessages = ErrorMessages(
    fallbackEnabled,
    alwaysShowErrors,
    remoteTokens,
  );
  if (errorMessages) return errorMessages;

  if (deviceIsInspectable && !showIfThisDevice) {
    return null;
  }

  const inspectableToken = findInspectable(remoteTokens);
  if (!inspectableToken) return null;

  const a11yLabel =
    (isTravelCardToken(inspectableToken)
      ? t(TravelTokenBoxTexts.tcard.a11yLabel)
      : t(
          TravelTokenBoxTexts.mobile.a11yLabel(
            getDeviceName(inspectableToken) ||
              t(TravelTokenBoxTexts.mobile.unnamedDevice),
          ),
        )) + (showHowToChangeHint ? t(TravelTokenBoxTexts.howToChange) : '');

  const description = isTravelCardToken(inspectableToken)
    ? t(TravelTokenBoxTexts.tcard.description)
    : t(TravelTokenBoxTexts.mobile.description);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={a11yLabel}
      testID="travelTokenBox"
    >
      <TravelDeviceTitle inspectableToken={inspectableToken} />
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View
          style={{alignItems: 'center'}}
          testID={inspectableToken.type + 'Icon'}
        >
          {isTravelCardToken(inspectableToken) ? (
            <ThemedTokenTravelCard />
          ) : (
            <ThemedTokenPhone />
          )}
        </View>
        <View style={styles.description}>
          <ThemeText color="background_accent_3">{description}</ThemeText>
        </View>
      </View>
      {showHowToChangeHint && (
        <ThemeText
          style={styles.howToChange}
          color="background_accent_3"
          type={'body__tertiary'}
          isMarkdown={true}
        >
          {t(TravelTokenBoxTexts.howToChange)}
        </ThemeText>
      )}
    </View>
  );
}

const TravelDeviceTitle = ({
  inspectableToken,
}: {
  inspectableToken: RemoteToken;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  if (isTravelCardToken(inspectableToken)) {
    const travelCardId = getTravelCardId(inspectableToken);
    return (
      <View style={styles.travelCardTitleContainer}>
        <ThemeText
          type="heading__title"
          color="background_accent_3"
          style={styles.title}
        >
          {t(TravelTokenBoxTexts.tcard.title)}
        </ThemeText>
        <ThemeText color="background_accent_3" style={styles.transparent}>
          {' XXXX XX'}
        </ThemeText>
        <ThemeText
          type="heading__title"
          color="background_accent_3"
          testID="travelCardNumber"
        >
          {travelCardId?.substring(0, 2) + ' ' + travelCardId?.substring(2)}
        </ThemeText>
        <ThemeText color="background_accent_3" style={styles.transparent}>
          {'X'}
        </ThemeText>
      </View>
    );
  } else {
    return (
      <ThemeText
        type="heading__title"
        color="background_accent_3"
        style={styles.title}
        testID="mobileTokenName"
      >
        {getDeviceName(inspectableToken) ||
          t(TravelTokenBoxTexts.mobile.unnamedDevice)}
      </ThemeText>
    );
  }
};

const ErrorMessages = (
  fallbackEnabled: boolean,
  alwaysShowErrors?: boolean,
  remoteTokens?: RemoteToken[],
) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {isError, retry} = useMobileTokenContextState();

  if (isError) {
    return fallbackEnabled && !alwaysShowErrors ? null : (
      <MessageBox
        type={'warning'}
        title={t(TravelTokenBoxTexts.errorMessages.tokensNotLoadedTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.tokensNotLoaded)}
        containerStyle={styles.errorMessage}
        onPress={retry}
      />
    );
  }

  const inspectableToken = findInspectable(remoteTokens);

  if (!inspectableToken) {
    return (
      <MessageBox
        type={'warning'}
        isMarkdown={true}
        title={t(TravelTokenBoxTexts.errorMessages.noInspectableTokenTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.noInspectableToken)}
        containerStyle={styles.errorMessage}
      />
    );
  }

  return null;
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  loadingIndicator: {
    marginBottom: theme.spacings.medium,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  container: {
    backgroundColor: theme.static.background.background_accent_3.background,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    marginBottom: theme.spacings.medium,
  },
  travelCardTitleContainer: {
    flexDirection: 'row',
  },
  title: {
    marginBottom: theme.spacings.large,
  },
  description: {
    marginLeft: theme.spacings.medium,
    flex: 1,
    justifyContent: 'center',
  },
  howToChange: {
    marginTop: theme.spacings.xLarge,
  },
  transparent: {
    opacity: 0.6,
  },
}));
