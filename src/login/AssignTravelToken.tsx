import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {useTicketState} from '@atb/tickets';
import {ActiveTicketCard} from '@atb/screens/Ticketing/Tickets/TravelCardInformation';
import Button from '@atb/components/button';

const themeColor: ThemeColor = 'background_gray';

export default function AssignTravelToken({
  headerLeftButton,
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

  const {customerProfile} = useTicketState();
  const hasTravelCard = !!customerProfile?.travelcard;

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
            {hasTravelCard ? 'Ditt t:kort er satt som reisebevis' : 'No t:card'}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            {hasTravelCard
              ? 'Ta med deg t:kortet når du er ute på reise'
              : 'No t:card'}
          </ThemeText>
        </View>
        {hasTravelCard && customerProfile?.travelcard?.id && (
          <View style={styles.tcardContainer}>
            <ActiveTicketCard
              cardId={customerProfile.travelcard.id.toString()}
              color="background_3"
              type="large"
            ></ActiveTicketCard>
          </View>
        )}
        <Button color={'primary_2'} onPress={() => {}} text={'OK'} />
        <ThemeText
          style={styles.description}
          color="primary_2"
          isMarkdown={true}
        >
          Les mer om reisebevis på
          [atb.no/reisebevis](https://atb.no/reisebevis)
        </ThemeText>
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
    marginVertical: theme.spacings.large,
    textAlign: 'center',
  },
  tcardContainer: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge * 3,
    alignSelf: 'center',
  },
}));
