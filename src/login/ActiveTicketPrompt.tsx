import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
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
import {TouchableOpacity} from 'react-native';
import {useTicketState} from '@atb/tickets';
import SimpleTicket from '@atb/screens/Ticketing/Ticket';

const themeColor: ThemeColor = 'background_gray';

export default function ActiveTicketPrompt({
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
  const {fareContracts} = useTicketState();
  const [now, setNow] = useState<number>(Date.now());

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
            {t(LoginTexts.activeTicketPrompt.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText
            style={styles.description}
            color={themeColor}
            isMarkdown={true}
          >
            {t(LoginTexts.activeTicketPrompt.body)}
          </ThemeText>
        </View>
        <View style={styles.ticket}>
          <SimpleTicket
            fareContract={fareContracts[0]}
            now={now}
            hideDetails={true}
          />
        </View>
        <Button
          color={'primary_2'}
          onPress={navigation.goBack}
          text={t(LoginTexts.activeTicketPrompt.laterButton)}
          icon={ArrowRight}
          iconPosition="right"
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
            {t(LoginTexts.activeTicketPrompt.continueButton)}
          </ThemeText>
        </TouchableOpacity>
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
  ticket: {
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
