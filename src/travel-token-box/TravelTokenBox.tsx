import {Token, useMobileTokenContextState} from '@atb/mobile-token';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';

import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';
import {MessageBox} from '@atb/components/message-box';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';

export function TravelTokenBox({
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
  const {deviceInspectionStatus, mobileTokenStatus, tokens, retry} =
    useMobileTokenContextState();

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
      <MessageBox
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
      <MessageBox
        type="warning"
        isMarkdown={true}
        title={t(TravelTokenBoxTexts.errorMessages.noInspectableTokenTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.noInspectableToken)}
        style={styles.errorMessage}
      />
    );

  const a11yLabel =
    (inspectableToken.type === 'travel-card'
      ? t(TravelTokenBoxTexts.tcard.a11yLabel)
      : t(
          TravelTokenBoxTexts.mobile.a11yLabel(
            inspectableToken.name ||
              t(TravelTokenBoxTexts.mobile.unnamedDevice),
          ),
        )) + (showHowToChangeHint ? t(TravelTokenBoxTexts.howToChange) : '');

  const description =
    inspectableToken.type === 'travel-card'
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
          {inspectableToken.type === 'travel-card' ? (
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
          type="body__tertiary"
          isMarkdown={true}
        >
          {t(TravelTokenBoxTexts.howToChange)}
        </ThemeText>
      )}
    </View>
  );
}

export const TravelDeviceTitle = ({
  inspectableToken,
}: {
  inspectableToken: Token;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  if (inspectableToken.type === 'travel-card') {
    const travelCardId = inspectableToken.travelCardId;
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
          X
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
        {inspectableToken.name || t(TravelTokenBoxTexts.mobile.unnamedDevice)}
      </ThemeText>
    );
  }
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
