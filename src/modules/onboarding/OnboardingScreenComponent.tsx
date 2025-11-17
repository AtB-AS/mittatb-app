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
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeIcon} from '@atb/components/theme-icon';

type DescriptionLink = {
  text: string;
  a11yHint: string;
  onPress: () => void;
};

type OnboardingScreenComponentParams = {
  illustration?: React.JSX.Element;
  title: string;
  description?: string;
  descriptionLink?: DescriptionLink;
  footerDescription?: string;
  secondaryFooterButton?: ButtonProps;
  vippsButton?: ButtonProps;
  footerButton?: ButtonProps;
  testID?: string;
  headerProps?: ScreenHeaderProps;
  contentNode?: React.JSX.Element;
};

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];
const getInteractiveColor = (theme: Theme) => theme.color.interactive[0];

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
  const descriptionLinkColor = getInteractiveColor(theme).default.background;

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
          typography="heading__xl"
          color={themeColor}
          style={styles.title}
          accessibilityRole="header"
        >
          {title}
        </ThemeText>
      </View>
      {description && (
        <ThemeText
          typography="body__m"
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
          style={styles.descriptionLink}
        >
          <ThemeText
            typography="body__m__underline"
            color={descriptionLinkColor}
          >
            {descriptionLink.text}
          </ThemeText>
          <ThemeIcon
            svg={ExternalLink}
            size="normal"
            color={descriptionLinkColor}
          />
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
}));
