import React, {useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import Header from '../../../../ScreenHeader';
import {StyleSheet, useTheme} from '../../../../theme';
import ThemeIcon from '../../../../components/theme-icon';
import {ArrowLeft} from '../../../../assets/svg/icons/navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTicketState} from '../../../../TicketContext';
import {ActivityIndicator, View} from 'react-native';
import {TicketModalNavigationProp, TicketModalStackParams} from '.';
import {TicketTexts, useTranslation} from '../../../../translations';
import qrcode from 'qrcode';
import {SvgXml} from 'react-native-svg';

export type InspectionScreenRouteParams = {
  orderId: string;
};

export type TicketInspectionScreenRouteProp = RouteProp<
  TicketModalStackParams,
  'TicketInspection'
>;

type Props = {
  route: TicketInspectionScreenRouteProp;
  navigation: TicketModalNavigationProp;
};

export default function TicketInspection({navigation, route}: Props) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {findFareContractByOrderId} = useTicketState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async function () {
      if (!fc?.qr_code) return;
      const svg = await qrcode.toString(fc.qr_code, {
        type: 'svg',
      });

      setQrCodeSvg(svg);
    })();
  }, [fc]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            TicketTexts.qr_code.header.leftButton.a11yLabel,
          ),
          icon: <ThemeIcon svg={ArrowLeft} />,
        }}
        title={t(TicketTexts.qr_code.header.title)}
        style={styles.header}
      />
      <View style={styles.content}>
        {qrCodeSvg ? (
          <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
        ) : (
          <ActivityIndicator color={theme.text.colors.primary} />
        )}
      </View>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.level2,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));
