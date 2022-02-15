import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {useTicketState} from '@atb/tickets';
import {ActiveTicketCard} from '@atb/screens/Ticketing/Tickets/TravelCardInformation';
import Button from '@atb/components/button';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';

const themeColor: ThemeColor = 'background_accent';

export default function TravelTokenOnboarding({
  doAfterSubmit,
  headerLeftButton,
  headerRightButton,
  selectedDeviceId,
}: {
  doAfterSubmit: () => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
  selectedDeviceId: number;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  const [page, setPage] = useState(0);

  const {customerProfile} = useTicketState();
  const hasTravelCard = !customerProfile?.travelcard;

  const getPageContent = (page: number) => {
    switch (page) {
      case 0:
        return <Info1 />;
      case 1:
        return hasTravelCard ? (
          <TCardInfoBox travelCardId="1231232" />
        ) : (
          <PhoneInfoBox phoneName="phonename" />
        );
      default:
        return <View />;
    }
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
        {getPageContent(page)}
      </ScrollView>

      <FullScreenFooter>
        <Button
          color={'primary_2'}
          style={styles.marginVertical}
          onPress={() => {
            setPage(page + 1);
          }}
          text="Neste"
        />
      </FullScreenFooter>
    </View>
  );
}

function Info1(): JSX.Element {
  return <ThemeText>Hva er et reisebevis?</ThemeText>;
}

function PhoneInfoBox({phoneName}: {phoneName: string}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View>
      <View accessible={true} accessibilityRole="header">
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(LoginTexts.assignTravelToken.phoneIsSet)}
        </ThemeText>
      </View>
      <View>
        <ThemeText style={styles.description} color={themeColor}>
          {t(LoginTexts.assignTravelToken.bringPhone)}
        </ThemeText>
      </View>
      <View style={styles.phoneInfoBox}>
        <View style={styles.phoneLine}></View>
        <View style={styles.phoneInfoBoxInner}>
          <ThemeText type="heading__title">{phoneName}</ThemeText>
        </View>
      </View>
    </View>
  );
}

function TCardInfoBox({travelCardId}: {travelCardId: string}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View>
      <View accessible={true} accessibilityRole="header">
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(LoginTexts.assignTravelToken.tcardIsSet)}
        </ThemeText>
      </View>
      <View>
        <ThemeText style={styles.description} color={themeColor}>
          {t(LoginTexts.assignTravelToken.bringTcard)}
        </ThemeText>
      </View>
      <View style={styles.tcardContainer}>
        <ActiveTicketCard
          cardId={travelCardId}
          color="background_3"
          type="large"
        ></ActiveTicketCard>
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
    padding: theme.spacings.large,
  },
  alignCenter: {
    textAlign: 'center',
  },
  marginVertical: {
    marginBottom: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  tcardContainer: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge * 3,
    alignSelf: 'center',
  },
  phoneInfoBox: {
    marginVertical: theme.spacings.xLarge,
    alignSelf: 'center',
    backgroundColor: theme.colors.background_3.backgroundColor,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.circle,
    minHeight: 300,
    minWidth: 200,
  },
  phoneLine: {
    width: theme.spacings.xLarge * 2,
    borderRadius: theme.border.radius.regular,
    height: theme.spacings.small,
    backgroundColor: theme.colors.secondary_2.backgroundColor,
    alignSelf: 'center',
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.small + theme.spacings.xLarge,
  },
  phoneInfoBoxInner: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.large,
    alignSelf: 'center',
  },
}));
