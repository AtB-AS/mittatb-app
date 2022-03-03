import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {
  TravelTokenCard,
  TravelTokenPhone,
} from '@atb/assets/svg/color/illustrations';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {TravelToken} from '@atb/mobile-token/types';
import {useTranslation} from '@atb/translations';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';

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
  const inspectableToken = travelTokens?.find((t) => t.inspectable);

  if (
    !inspectableToken ||
    (inspectableToken.isThisDevice && !showIfThisDevice)
  ) {
    return null;
  }

  const a11yLabel =
    (inspectableToken.type === 'travelCard'
      ? t(TravelTokenBoxTexts.tcard.a11yLabel)
      : t(TravelTokenBoxTexts.mobile.a11yLabel(inspectableToken.name))) +
    (showHowToChangeHint ? t(TravelTokenBoxTexts.howToChange) : '');

  const description =
    inspectableToken.type === 'travelCard'
      ? t(TravelTokenBoxTexts.tcard.description)
      : t(TravelTokenBoxTexts.mobile.description);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={a11yLabel}
    >
      <TravelCardTitle inspectableToken={inspectableToken} />
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View style={{alignItems: 'center'}}>
          {inspectableToken.type === 'travelCard' ? (
            <TravelTokenCard />
          ) : (
            <TravelTokenPhone />
          )}
        </View>
        <View style={styles.description}>
          <ThemeText color="primary_2">{description}</ThemeText>
        </View>
      </View>
      {showHowToChangeHint && (
        <ThemeText
          style={styles.howToChange}
          color="primary_2"
          type={'body__tertiary'}
        >
          {t(TravelTokenBoxTexts.howToChange)}
        </ThemeText>
      )}
    </View>
  );
}

const TravelCardTitle = ({
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
            color="primary_2"
            style={styles.title}
          >
            {t(TravelTokenBoxTexts.tcard.title)}
          </ThemeText>
          <ThemeText color="primary_2" style={styles.transparent}>
            {' XXXX XX'}
          </ThemeText>
          <ThemeText type="heading__title" color="primary_2">
            {inspectableToken.travelCardId?.substring(0, 2) +
              ' ' +
              inspectableToken.travelCardId?.substring(2)}
          </ThemeText>
          <ThemeText color="primary_2" style={styles.transparent}>
            {'X'}
          </ThemeText>
        </View>
      );
    case 'mobile':
      return (
        <ThemeText type="heading__title" color="primary_2" style={styles.title}>
          {inspectableToken.name}
        </ThemeText>
      );
  }
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  container: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
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
