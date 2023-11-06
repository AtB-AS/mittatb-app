import {StyleSheet} from '@atb/theme';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Button} from '@atb/components/button';
import {View, ScrollView} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

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
  const focusRef = useFocusOnLoad(true, 200);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.headerScrollViewContainer}>
        <View style={styles.header} ref={focusRef} accessible>
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
          <ScrollView style={styles.footerScrollView}>
            <ThemeText
              type="body__tertiary"
              color="background_accent_0"
              style={styles.footerDescription}
            >
              {footerDescription}
            </ThemeText>
          </ScrollView>
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
  headerScrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  footerScrollView: {
    marginBottom: theme.spacings.small,
    maxHeight: 180,
  },
  footerDescription: {
    padding: theme.spacings.medium,
  },
  footer: {
    paddingTop: theme.spacings.small,
    justifyContent: 'flex-end',
  },
}));
