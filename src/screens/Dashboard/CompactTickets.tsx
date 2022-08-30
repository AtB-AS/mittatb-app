import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {CompactTicketInfo} from '../Ticketing/Ticket/CompactTicketInfo';
import {getTicketInfoDetailsProps} from '@atb/screens/Ticketing/Ticket/utils';
import useInterval from '@atb/utils/use-interval';
import {
  filterActiveOrCanBeUsedFareContracts,
  isValidRightNowFareContract,
  useTicketState,
} from '@atb/tickets';
import ThemeText from '@atb/components/text';
import {TicketsTexts, DashboardTexts, useTranslation} from '@atb/translations';
import Button from '@atb/components/button';

type Props = {
  onPressDetails?: (orderId: string) => void;
  onPressBuyTickets(): void;
};

const CompactTickets: React.FC<Props> = ({
  onPressDetails,
  onPressBuyTickets,
}) => {
  const itemStyle = useStyles();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 1000);

  const {fareContracts, customerProfile} = useTicketState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
  ).sort(function (a, b): number {
    const isA = isValidRightNowFareContract(a);
    const isB = isValidRightNowFareContract(b);

    if (isA === isB) return 0;
    if (isA) return -1;
    return 1;
  });

  const {t} = useTranslation();

  return (
    <>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={itemStyle.sectionText}
        accessibilityLabel={t(TicketsTexts.header.title)}
      >
        {t(TicketsTexts.header.title)}
      </ThemeText>
      {activeFareContracts?.length == 0 && (
        <Button
          style={itemStyle.buttonSection}
          text={t(DashboardTexts.buyTicketsButton)}
          onPress={onPressBuyTickets}
        />
      )}
      {activeFareContracts?.map((fareContract, index) => {
        const ticketInfoDetailsProps = getTicketInfoDetailsProps(fareContract, now);
        return (
          <CompactTicketInfo
            {...ticketInfoDetailsProps}
            now={now}
            onPressDetails={() => {
              onPressDetails?.(fareContract.orderId);
            }}
          />
        );
      })}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  buttonSection: {
    marginLeft: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
}));

export default CompactTickets;
