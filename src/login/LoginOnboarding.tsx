import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {TicketIllustration, Psst} from '@atb/assets/svg/illustrations';
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

      <ScrollView centerContent={true} contentContainerStyle={styles.mainView}>
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
        <TicketIllustration style={styles.illustation}></TicketIllustration>
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
          style={styles.laterButton}
          onPress={navigation.goBack}
          accessibilityRole="button"
        >
          <ThemeText
            style={styles.laterButtonText}
            type="body__primary"
            color={themeColor}
          >
            {'Jeg vil logge inn senere'}
          </ThemeText>
        </TouchableOpacity>
        <View style={styles.carrotInfo}>
          <Psst></Psst>
          <ThemeText
            style={styles.carrotTitle}
            type="body__primary--bold"
            color={themeColor}
          >
            Det er lurt å logge inn
          </ThemeText>
          <ThemeText type="body__primary" color={themeColor}>
            Da kan du også lagre betalingskort og etter hvert andre smarte
            reiseting slik at du enkelt finner dem igjen – selv ved bytte av
            mobil.
          </ThemeText>
        </View>
      </ScrollView>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    flex: 1,
  },
  mainView: {
    padding: theme.spacings.large,
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
  laterButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
  },
  laterButtonText: {textAlign: 'center'},
  carrotInfo: {
    margin: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge,
  },
  carrotTitle: {
    marginVertical: theme.spacings.medium,
  },
}));
