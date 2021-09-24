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
import TicketInfo, {
  TicketInfoView,
} from '@atb/screens/Ticketing/Ticket/TicketInfo';
import {
  filterActiveFareContracts,
  isPreactivatedTicket,
  useTicketState,
} from '@atb/tickets';
import SimpleTicket from '@atb/screens/Ticketing/Ticket';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';

const themeColor: ThemeColor = 'background_gray';

export default function ActiveTicketPrompt({
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
  const {fareContracts, isRefreshingTickets, refreshTickets} = useTicketState();
  const [now, setNow] = useState<number>(Date.now());

  // const firstTravelRight = fareContracts[0].travelRights?.[0];
  // if (isPreactivatedTicket(firstTravelRight)) {
  //   const {startDateTime, endDateTime} = firstTravelRight;
  //   const validTo = endDateTime.toMillis();
  //   const validFrom = startDateTime.toMillis();
  //   const validityStatus = getValidityStatus(
  //     now,
  //     validFrom,
  //     validTo,
  //     fareContracts[0].state,
  //   );
  // }

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
            Du har en aktiv billett
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText
            style={styles.description}
            color={themeColor}
            isMarkdown={true}
          >
            Når du logger inn vil dine anonyme billetter **ikke** kunne
            overføres til din profil. Hvis du ønsker å beholde din aktive
            billett venter du med innloggingen til billetten har utløpt.
          </ThemeText>
        </View>
        <View style={styles.ticket}>
          <SimpleTicket
            fareContract={fareContracts[0]}
            now={now}
            onPressDetails={() =>
              navigation.navigate('TicketModal', {
                screen: 'TicketDetails',
                params: {orderId: fareContracts[0].orderId},
              })
            }
          />
        </View>
        <Button
          color={'primary_2'}
          onPress={navigation.goBack}
          text={'Logg inn senere'}
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
            Jeg vil logge inn likevel
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
