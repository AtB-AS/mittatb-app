import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
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
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketState,
} from '@atb/tickets';

const themeColor: ThemeColor = 'background_accent';

export default function LoginOnboarding({
  headerLeftButton,
  doAfterSubmit,
  headerRightButton,
}: {
  doAfterSubmit: (hasActiveFareContracts: boolean) => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  const {fareContracts} = useTicketState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
  );
  const onNext = async () => {
    doAfterSubmit(activeFareContracts.length > 0);
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
            {t(LoginTexts.onboarding.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            {t(LoginTexts.onboarding.description)}
          </ThemeText>
        </View>
        <TicketIllustration style={styles.illustation}></TicketIllustration>
        <View style={styles.buttonView}>
          <Button
            color={'primary_2'}
            onPress={onNext}
            text={t(LoginTexts.onboarding.button)}
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
            {t(LoginTexts.onboarding.laterButton)}
          </ThemeText>
        </TouchableOpacity>
        <View style={styles.carrotInfo}>
          <Psst></Psst>
          <ThemeText
            style={styles.carrotTitle}
            type="body__primary--bold"
            color={themeColor}
          >
            {t(LoginTexts.onboarding.carrotTitle)}
          </ThemeText>
          <ThemeText type="body__primary" color={themeColor}>
            {t(LoginTexts.onboarding.carrotBody)}
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
