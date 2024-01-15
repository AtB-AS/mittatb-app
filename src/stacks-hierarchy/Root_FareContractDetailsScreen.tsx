import {FullScreenHeader, useTicketInfo} from '@atb/components/screen-header';
import {DetailsContent} from '@atb/fare-contracts';
import {useApplePassPresentationSuppression} from '@atb/suppress-pass-presentation';
import {StyleSheet} from '@atb/theme';
import {
  FareContractTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {useTimeContextState} from '@atb/time';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type Props = RootStackScreenProps<'Root_FareContractDetailsScreen'>;

export function Root_FareContractDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {enable_ticket_information} = useRemoteConfig();
  const {serverNow} = useTimeContextState();
  const {navigateToTicketInfoScreen, fareContract, preassignedFareProduct} =
    useTicketInfo(route?.params?.orderId);

  useApplePassPresentationSuppression();

  const onReceiptNavigate = () =>
    fareContract &&
    navigation.push('Root_ReceiptScreen', {
      orderId: fareContract.orderId,
      orderVersion: fareContract.version,
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        rightButton={
          enable_ticket_information
            ? {
                type: 'info',
                onPress: navigateToTicketInfoScreen,
                color: 'background_accent_0',
                accessibilityHint: t(
                  ScreenHeaderTexts.headerButton.info.a11yHint,
                ),
              }
            : undefined
        }
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fareContract && (
          <DetailsContent
            fareContract={fareContract}
            preassignedFareProduct={preassignedFareProduct}
            now={serverNow}
            onReceiptNavigate={onReceiptNavigate}
          />
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  content: {
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.xLarge,
  },
}));
