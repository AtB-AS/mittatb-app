import {FullScreenHeader, useTicketInfo} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {
  FareContractTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CarnetDetailedView} from '@atb/fare-contracts';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {useNow} from '@atb/utils/use-now';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type Props = RootStackScreenProps<'Root_CarnetDetailsScreen'>;

export function Root_CarnetDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {enable_ticket_information} = useRemoteConfig();
  const now = useNow(2500);
  const {navigateToTicketInfoScreen, fareContract} = useTicketInfo(
    route?.params?.orderId,
  );

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
                  FareContractTexts.details.infoButtonA11yHint,
                ),
              }
            : undefined
        }
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fareContract && (
          <CarnetDetailedView
            fareContract={fareContract}
            now={now}
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
