import * as Sections from '@atb/components/sections';
import {RootStackParamList} from '@atb/navigation';
import {CarnetDetails} from '@atb/screens/Ticketing/Ticket/Carnet/CarnetDetails';
import {CarnetTicket, FareContract} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';

type Props = {
  fareContract: FareContract;
  travelRights: CarnetTicket[];
  now: number;
  isInspectable: boolean;
  testID?: string;
};

type RootNavigationProp = NavigationProp<RootStackParamList>;

const CarnetTicketInfo: React.FC<Props> = ({
  fareContract,
  travelRights,
  now,
  isInspectable,
  testID,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProp>();

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
