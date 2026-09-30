import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {Logo} from '@atb/assets/svg/mono-icons/logo';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ForceUpdateTexts, useTranslation} from '@atb/translations';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useOpenStoreListing} from '@atb/utils/use-open-store-listing';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

export const ForceUpdateScreen = () => {
  const {openStoreListing, isError} = useOpenStoreListing();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {t} = useTranslation();

  const iconDimension = 80;

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <ScrollView>
          <View style={styles.icon}>
            <Logo
              width={iconDimension}
              height={iconDimension}
              fill={themeColor.foreground.primary}
            />
          </View>
          <ThemeText
            typography="heading__xl"
            style={styles.title}
            color={themeColor}
          >
            {t(ForceUpdateTexts.header)}
          </ThemeText>
          <ThemeText style={styles.subText} color={themeColor}>
            {t(ForceUpdateTexts.subText)}
          </ThemeText>
          <Button
            expanded={true}
            rightIcon={{svg: ExternalLink}}
            onPress={openStoreListing}
            text={t(ForceUpdateTexts.externalButton)}
          />
          {isError && (
            <MessageInfoBox
              message={t(ForceUpdateTexts.errorMessage)}
              type="error"
              style={styles.messageBox}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.medium,
  },
  icon: {
    alignItems: 'center',
  },
  subText: {
    textAlign: 'center',
    paddingBottom: theme.spacing.medium,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  messageBox: {
    marginVertical: theme.spacing.medium,
  },
}));
