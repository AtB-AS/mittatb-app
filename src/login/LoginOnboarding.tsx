import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {Ticket} from '@atb/assets/svg/illustrations';
import {TouchableOpacity} from 'react-native';

const themeColor: ThemeColor = 'background_gray';

export default function LoginOnboarding({
  loginReason,
  headerLeftButton,
  doAfterSubmit,
  headerRightButton,
}: {
  loginReason?: string;
  doAfterSubmit: () => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  const onNext = async () => {
    doAfterSubmit();
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={headerLeftButton}
        rightButton={headerRightButton}
        setFocusOnLoad={false}
        color={themeColor}
      />

      <View style={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            style={styles.title}
            color={themeColor}
          >
            Nå kan du kjøpe periodebilletter!
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            Når du logger inn kan du kjøpe periodebilletter på 7, 30 eller 180
            dagers varighet.
          </ThemeText>
        </View>
        <Ticket style={styles.illustation}></Ticket>
        <View style={styles.buttonView}>
          <Button
            color={'primary_2'}
            onPress={onNext}
            text={'Ta meg til innlogging'}
            icon={ArrowRight}
            iconPosition="right"
          />
        </View>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={navigation.goBack}
          accessibilityRole="button"
        >
          <ThemeText
            style={styles.resendButtonText}
            type="body__primary"
            color={themeColor}
          >
            {'Jeg vil logge inn senere'}
          </ThemeText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    margin: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  loginReason: {
    marginTop: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.medium,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  illustation: {
    alignSelf: 'center',
    marginVertical: theme.spacings.medium,
  },
  resendButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
