import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';

import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {OnboardingFullScreenView} from '@atb/modules/onboarding';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Theme} from '@atb/theme/colors';
import {ScreenHeaderProps} from '@atb/components/screen-header';
import {ButtonProps} from '@atb/components/button';

type DescriptionLink = {
  text: string;
  a11yHint: string;
  onPress: () => void;
};

type OnboardingScreenComponentParams = {
  illustration?: JSX.Element;
  title: string;
  description?: string;
  descriptionLink?: DescriptionLink;
  footerDescription?: string;
  secondaryFooterButton?: ButtonProps;
  vippsButton?: ButtonProps;
  footerButton?: ButtonProps;
  testID?: string;
  headerProps?: ScreenHeaderProps;
  contentNode?: JSX.Element;
  isVippsButton?: boolean;
};

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const OnboardingScreenComponent = ({
  illustration,
  title,
  description,
  descriptionLink,
  footerDescription,
  secondaryFooterButton,
  footerButton,
  vippsButton,
  testID,
  headerProps,
  contentNode,
}: OnboardingScreenComponentParams) => {
  const styles = useThemeStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const focusRef = useFocusOnLoad();

  return (
    <OnboardingFullScreenView
      footerButton={footerButton}
      secondaryFooterButton={secondaryFooterButton}
      vippsButton={vippsButton}
      footerDescription={footerDescription}
      fullScreenHeaderProps={headerProps}
      testID={testID ? `${testID}` : 'next'}
    >
      <View style={styles.header}>{illustration}</View>
      <View ref={focusRef} accessible collapsable={false}>
        <ThemeText
          typography="body__primary--big--bold"
          color={themeColor}
          style={styles.title}
          accessibilityRole="header"
        >
          {title}
        </ThemeText>
      </View>
      {description && (
        <ThemeText
          typography="body__primary"
          color={themeColor}
          style={styles.description}
        >
          {description}
        </ThemeText>
      )}
      {contentNode}
      {descriptionLink && (
        <PressableOpacity
          onPress={descriptionLink.onPress}
          accessibilityRole="link"
          accessibilityHint={descriptionLink.a11yHint}
        >
          <ThemeText
            typography="body__primary--underline"
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
    marginTop: theme.spacing.xLarge + theme.spacing.large,
    textAlign: 'center',
  },
  description: {
    marginVertical: theme.spacing.medium,
    textAlign: 'center',
  },
  descriptionLink: {
    textAlign: 'center',
  },
}));
