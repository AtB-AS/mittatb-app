import {StyleSheet} from '@atb/theme';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Button} from '@atb/components/button';
import {View, ScrollView} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type DescriptionLink = {
  text: string;
  a11yHint: string;
  onPress: () => void;
};

export type PermissionScreenParams = {
  illustration: JSX.Element;
  title: string;
  description: string;
  descriptionLink?: DescriptionLink;
  footerDescription?: string;
  buttonText: string;
  buttonOnPress: () => void;
};

export const PermissionScreen = ({
  illustration,
  title,
  description,
  descriptionLink,
  footerDescription,
  buttonText,
  buttonOnPress,
}: PermissionScreenParams) => {
  const styles = useThemeStyles();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          {illustration}
          <ThemeText
            type="body__primary--big--bold"
            color="background_accent_0"
            style={styles.title}
            accessibilityRole="header"
          >
            {title}
          </ThemeText>
          <ThemeText
            type="body__primary"
            color="background_accent_0"
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
                color="background_accent_0"
                style={styles.descriptionLink}
              >
                {descriptionLink.text}
              </ThemeText>
            </PressableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {footerDescription && (
          <ThemeText
            type="body__tertiary"
            color="background_accent_0"
            style={styles.footerDescription}
          >
            {footerDescription}
          </ThemeText>
        )}
        <Button
          interactiveColor="interactive_0"
          onPress={buttonOnPress}
          text={buttonText}
          testID="nextButton"
        />
      </View>
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacings.xLarge,
  },
  header: {
    marginTop: theme.spacings.large * 2,
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
  footerDescription: {
    padding: theme.spacings.medium,
    marginVertical: theme.spacings.small,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
}));
