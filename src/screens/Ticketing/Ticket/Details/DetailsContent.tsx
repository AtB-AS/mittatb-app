import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {
  FareContract,
  isInspectableTicket,
  isPreactivatedTicket,
} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import TicketInfo from '../TicketInfo';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';
import _ from 'lodash';
import {StyleSheet} from '@atb/theme';

type Props = {
  fareContract: FareContract;
  now: number;
  onReceiptNavigate: () => void;
  hasActiveTravelCard?: boolean;
};

const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  now,
  onReceiptNavigate,
  hasActiveTravelCard = false,
}) => {
  const {t} = useTranslation();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();

  const firstTravelRight = fc.travelRights[0];
  const {preassignedFareproducts} = useFirestoreConfiguration();

  if (isPreactivatedTicket(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const ticketIsInspectable = isInspectableTicket(
      firstTravelRight,
      hasActiveTravelCard,
      hasEnabledMobileToken,
      deviceIsInspectable,
      mobileTokenError,
      fallbackEnabled,
    );

    const preassignedFareProduct = findReferenceDataById(
      preassignedFareproducts,
      firstTravelRight.fareProductRef,
    );

    const validityStatus = getValidityStatus(now, validFrom, validTo, fc.state);
    return (
      <Sections.Section withBottomPadding>
        <Sections.GenericItem>
          <ValidityHeader
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={ticketIsInspectable}
            ticketType={preassignedFareProduct?.type}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={ticketIsInspectable}
          />
          <TicketInfo
            travelRights={fc.travelRights.filter(isPreactivatedTicket)}
            status={validityStatus}
            isInspectable={ticketIsInspectable}
            testID={'details'}
            fareContract={fc}
          />
        </Sections.GenericItem>
        <Sections.GenericItem>
          <OrderDetails fareContract={fc} />
        </Sections.GenericItem>
        <Sections.LinkItem
          text={t(TicketTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          accessibility={{accessibilityRole: 'button'}}
          testID="receiptButton"
        />
      </Sections.Section>
    );
  } else {
    return <UnknownTicketDetails fc={fc} />;
  }
};

const OrderDetails = ({fareContract}: {fareContract: FareContract}) => {
  const style = useStyles();
  const {t, language} = useTranslation();
  const orderIdText = t(TicketTexts.details.orderId(fareContract.orderId));
  return (
    <View accessible={true}>
      <ThemeText type="body__secondary" color="secondary">
        {t(
          TicketTexts.details.purchaseTime(
            formatToLongDateTime(
              fromUnixTime(fareContract.created.toMillis() / 1000),
              language,
            ),
          ),
        )}
      </ThemeText>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={style.marginTop}
      >
        {t(TicketTexts.details.paymentMethod)}
        {_.capitalize(fareContract?.paymentType)}
      </ThemeText>
      <ThemeText style={style.marginTop}>{orderIdText}</ThemeText>
    </View>
  );
};

function UnknownTicketDetails({fc}: {fc: FareContract}) {
  const {t} = useTranslation();
  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityLine status="unknown" />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>{t(TicketTexts.details.orderId(fc.orderId))}</ThemeText>
      </Sections.GenericItem>
    </Sections.Section>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  marginTop: {
    marginTop: theme.spacings.xSmall,
  },
}));

export default DetailsContent;
