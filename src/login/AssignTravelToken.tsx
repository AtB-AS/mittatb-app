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

  const {customerProfile} = useTicketState();
  const hasTravelCard = !customerProfile?.travelcard;
  const availableDevices = [
    {
      id: 0,
      modelName: 'iPhone 13 Pro',
      addedDate: '10. okt, kl. 09:10',
    },
    {
      id: 1,
      modelName: 'Samsung Galaxy S21',
      addedDate: '10. okt, kl. 09:10',
    },
  ];
  const currentDevice = availableDevices.find(
    (device) => device.id === (selectedDeviceId || 0),
  );

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
            style={[styles.alignCenter, styles.marginVertical]}
            color={themeColor}
          >
            {hasTravelCard
              ? 'Ditt t:kort er satt som reisebevis'
              : 'Din mobil er satt som reisebevis'}
          </ThemeText>
        </View>
        <View>
          <ThemeText style={styles.description} color={themeColor}>
            {hasTravelCard
              ? 'Ta med deg t:kortet når du er ute på reise'
              : 'Ta med deg mobilen når du er ute på reise'}
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
        {!hasTravelCard && currentDevice && (
          <PhoneInfoBox
            phoneName={currentDevice?.modelName}
            addedDate={currentDevice?.addedDate}
          ></PhoneInfoBox>
        )}
        <Button
          color={'primary_2'}
          style={styles.marginVertical}
          onPress={() => {
            doAfterSubmit();
          }}
          text={'OK'}
        />
        {!hasTravelCard && availableDevices.length > 1 && (
          <Button
            mode="secondary"
            style={styles.marginVertical}
            color="primary_2"
            onPress={() => {
              navigation.navigate('AssignPhoneInApp', {
                currentDeviceId: currentDevice?.id || 0,
              });
            }}
            text={'Velg en annen mobil'}
          />
        )}
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

type PhoneInfoBoxProps = {
  phoneName: string;
  addedDate: string;
};

export function PhoneInfoBox(props: PhoneInfoBoxProps): JSX.Element {
  const styles = useThemeStyles();

  return (
    <View style={styles.phoneInfoBox}>
      <View style={styles.phoneLine}></View>
      <View style={styles.phoneInfoBoxInner}>
        <ThemeText type="heading__title" style={styles.phoneInfoBoxTitle}>
          {props.phoneName}
        </ThemeText>
        <ThemeText style={styles.alignCenter}>Lagt til:</ThemeText>
        <ThemeText style={styles.alignCenter}>{props.addedDate}</ThemeText>
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
    padding: theme.spacings.medium,
    alignSelf: 'center',
  },
  phoneInfoBoxTitle: {
    marginBottom: theme.spacings.medium,
    textAlign: 'center',
  },
}));
