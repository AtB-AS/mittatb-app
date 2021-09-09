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

// background_0" | "background_1" | "background_2" | "background_3" | "background_gray" |
// "primary_1" | "primary_2" | "primary_3" | "primary_destructive" | "secondary_1" | "secondary_2"
// | ... 8 more ... | "transport_other"
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
          <ThemeText type={'body__primary--jumbo--bold'} color={themeColor}>
            Nå kan du kjøpe periodebilletter!
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            Når du logger inn kan du kjøpe periodebilletter på 7, 30 eller 180
            dagers varighet.
          </ThemeText>
        </View>
        <View style={styles.buttonView}>
          <Button
            color={'primary_2'}
            onPress={onNext}
            text={'Ta meg til innlogging'}
            icon={ArrowRight}
            iconPosition="right"
          />
        </View>
        <View style={styles.buttonView}>
          <Button
            color={'background_gray'}
            onPress={navigation.goBack}
            text={'Jeg vil logge inn senere'}
            iconPosition="right"
          />
        </View>
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
    margin: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  loginReason: {marginTop: theme.spacings.medium},
  description: {marginVertical: theme.spacings.medium},
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
}));
