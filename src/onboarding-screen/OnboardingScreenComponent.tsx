import {StyleSheet} from '@atb/theme';
import React from 'react';

import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {StaticColorByType} from '@atb/theme/colors';
import {OnboardingFullScreenView} from '@atb/onboarding-screen';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type DescriptionLink = {
  text: string;
  a11yHint: string;
  onPress: () => void;
};

type OnboardingScreenComponentParams = {
  illustration: JSX.Element;
  title: string;
  description: string;
  descriptionLink?: DescriptionLink;
  footerDescription?: string;
  buttonText: string;
  buttonOnPress: () => void;
  testID?: string;
};

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const OnboardingScreenComponent = ({
  illustration,
  title,
  description,
  descriptionLink,
  footerDescription,
  buttonText,
  buttonOnPress,
  testID,
}: OnboardingScreenComponentParams) => {
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: buttonOnPress,
        text: buttonText,
      }}
      footerDescription={footerDescription}
      testID={testID ? `${testID}` : 'next'}
    >
      <View style={styles.header}>{illustration}</View>
      <View ref={focusRef} accessible collapsable={false}>
        <ThemeText
          type="body__primary--big--bold"
          color={themeColor}
          style={styles.title}
          accessibilityRole="header"
        >
          {title}
        </ThemeText>
      </View>
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
    </OnboardingFullScreenView>
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
