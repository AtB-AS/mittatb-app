import * as Sections from '@atb/components/sections';
import {CarnetTicket, FareContract} from '@atb/tickets';
import React from 'react';
import {TicketTexts, useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import {CarnetDetails} from '@atb/screens/Ticketing/Ticket/Carnet/CarnetDetails';

type Props = {
  fareContract: FareContract;
  travelRights: CarnetTicket[];
  now: number;
  isInspectable: boolean;
  testID?: string;
};

const CarnetTicketInfo: React.FC<Props> = ({
  fareContract,
  travelRights,
  now,
  isInspectable,
  testID,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Sections.Section withBottomPadding testID={testID}>
      <CarnetDetails
        now={now}
        inspectable={isInspectable}
        travelRights={travelRights}
        testID={testID}
        fareContract={fareContract}
      />
      <Sections.LinkItem
        text={t(TicketTexts.detailsLink.notValid)}
        onPress={() =>
          navigation.navigate('TicketModal', {
            screen: 'CarnetDetailsScreen',
            params: {
              orderId: fareContract.orderId,
              isInspectable: isInspectable,
            },
          })
        }
        testID={testID + 'Details'}
      />
    </Sections.Section>
  );
};

export default CarnetTicketInfo;
