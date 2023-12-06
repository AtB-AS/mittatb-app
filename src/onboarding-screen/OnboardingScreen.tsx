import {StyleSheet} from '@atb/theme';
import React from 'react';

import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {StaticColorByType} from '@atb/theme/colors';
import {OnboardingFrame} from '@atb/onboarding-frame';

type DescriptionLink = {
  text: string;
  a11yHint: string;
  onPress: () => void;
};

export type OnboardingScreenParams = {
  illustration: JSX.Element;
  title: string;
  description: string;
  descriptionLink?: DescriptionLink;
  footerDescription?: string;
  buttonText: string;
  buttonOnPress: () => void;
};

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const OnboardingScreen = ({
  illustration,
  title,
  description,
  descriptionLink,
  footerDescription,
  buttonText,
  buttonOnPress,
}: OnboardingScreenParams) => {
  const styles = useThemeStyles();

  return (
    <OnboardingFrame
      footerButton={{
        onPress: buttonOnPress,
        text: buttonText,
      }}
      footerDescription={footerDescription}
    >
      <View style={styles.header}>{illustration}</View>
      <ThemeText
        type="body__primary--big--bold"
        color={themeColor}
        style={styles.title}
        accessibilityRole="header"
      >
        {title}
      </ThemeText>
      <ThemeText
        type="body__primary"
        color={themeColor}
        style={styles.description}
      >
        {description}
      </ThemeText>
      {descriptionLink && (
        <PressableOpacity
          onPress={descriptionLink.onPress}
          accessibilityRole="link"
          accessibilityHint={descriptionLink.a11yHint}
        >
          <ThemeText
            type="body__primary--underline"
            color={themeColor}
            style={styles.descriptionLink}
          >
            {descriptionLink.text}
          </ThemeText>
        </PressableOpacity>
      )}
    </OnboardingFrame>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    alignItems: 'center',
  },
  title: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  description: {
    marginVertical: theme.spacings.medium,
    textAlign: 'center',
  },
  descriptionLink: {
    textAlign: 'center',
  },
}));
