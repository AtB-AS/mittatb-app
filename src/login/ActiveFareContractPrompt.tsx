import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {SimpleFareContract} from '@atb/fare-contracts';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function ActiveFareContractPrompt({
  headerLeftButton,
  doAfterSubmit,
  headerRightButton,
}: {
  doAfterSubmit: () => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();
  const {fareContracts} = useTicketingState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts);
  const firstActiveFc = activeFareContracts[0];
  const now = Date.now();

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
            {t(LoginTexts.activeFareContractPrompt.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText
            style={styles.description}
            color={themeColor}
            isMarkdown={true}
          >
            {t(LoginTexts.activeFareContractPrompt.body)}
          </ThemeText>
        </View>
        <View style={styles.fareContract}>
          {firstActiveFc && (
            <SimpleFareContract
              fareContract={firstActiveFc}
              now={now}
              hideDetails={true}
            />
          )}
        </View>
        <Button
          interactiveColor="interactive_0"
          onPress={navigation.goBack}
          text={t(LoginTexts.activeFareContractPrompt.laterButton)}
          rightIcon={{svg: ArrowRight}}
        />
        <TouchableOpacity
          style={styles.laterButton}
          onPress={onNext}
          accessibilityRole="button"
        >
          <ThemeText
            style={styles.laterButtonText}
            type="body__primary"
            color={themeColor}
          >
            {t(LoginTexts.activeFareContractPrompt.continueButton)}
          </ThemeText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
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
  fareContract: {
    marginVertical: theme.spacings.large,
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
