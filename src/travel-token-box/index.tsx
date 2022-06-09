import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';

import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {TravelToken} from '@atb/mobile-token/types';
import {useTranslation} from '@atb/translations';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';
import MessageBox from '@atb/components/message-box';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';

export default function TravelTokenBox({
  showIfThisDevice,
  showHowToChangeHint,
}: {
  showIfThisDevice: boolean;
  showHowToChangeHint?: boolean;
}) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {travelTokens} = useMobileTokenContextState();

  const errorMessages = ErrorMessages();
  if (errorMessages) return <ErrorMessages />;

  let inspectableToken = travelTokens?.find((t) => t.inspectable)!; // Bang! non-inspectable tokens are handled by ErrorMessages

  if (inspectableToken.isThisDevice && !showIfThisDevice) {
    return null;
  }

  const a11yLabel =
    (inspectableToken.type === 'travelCard'
      ? t(TravelTokenBoxTexts.tcard.a11yLabel)
      : t(
          TravelTokenBoxTexts.mobile.a11yLabel(
            inspectableToken.name ||
              t(TravelTokenBoxTexts.mobile.unnamedDevice),
          ),
        )) + (showHowToChangeHint ? t(TravelTokenBoxTexts.howToChange) : '');

  const description =
    inspectableToken.type === 'travelCard'
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
          {inspectableToken.type === 'travelCard' ? (
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

export const TravelDeviceTitle = ({
  inspectableToken,
}: {
  inspectableToken: TravelToken;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  switch (inspectableToken.type) {
    case 'travelCard':
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
            {inspectableToken.travelCardId?.substring(0, 2) +
              ' ' +
              inspectableToken.travelCardId?.substring(2)}
          </ThemeText>
          <ThemeText color="background_accent_3" style={styles.transparent}>
            {'X'}
          </ThemeText>
        </View>
      );
    case 'mobile':
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

const ErrorMessages = () => {
  const {travelTokens, updateTravelTokens} = useMobileTokenContextState();
  const {t} = useTranslation();
  const styles = useStyles();

  if (!travelTokens) {
    return (
      <MessageBox
        type={'warning'}
        title={t(TravelTokenBoxTexts.errorMessages.tokensNotLoadedTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.tokensNotLoaded)}
        containerStyle={styles.errorMessage}
        onPress={updateTravelTokens}
      />
    );
  }

  if (!travelTokens.length) {
    return (
      <MessageBox
        type={'warning'}
        title={t(TravelTokenBoxTexts.errorMessages.emptyTokensTitle)}
        message={t(TravelTokenBoxTexts.errorMessages.emptyTokens)}
        containerStyle={styles.errorMessage}
      />
    );
  }

  const inspectableToken = travelTokens?.find((t) => t.inspectable);

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
