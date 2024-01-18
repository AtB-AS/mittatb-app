import {RootStackParamList} from '@atb/stacks-hierarchy';
import {CarnetDetails} from '@atb/fare-contracts/carnet/CarnetDetails';
import {CarnetTravelRight, FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {LinkSectionItem, Section} from '@atb/components/sections';

type Props = {
  fareContract: FareContract;
  travelRights: CarnetTravelRight[];
  now: number;
  testID?: string;
};

type RootNavigationProp = NavigationProp<RootStackParamList>;

export const CarnetFareContractInfo: React.FC<Props> = ({
  fareContract,
  travelRights,
  now,
  testID,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <Section withBottomPadding testID={testID}>
      <CarnetDetails
        now={now}
        travelRights={travelRights}
        testID={testID}
        fareContract={fareContract}
      />
      <LinkSectionItem
        text={t(FareContractTexts.detailsLink.notValid)}
        onPress={() =>
          navigation.navigate({
            name: 'Root_FareContractDetailsScreen',
            params: {
              orderId: fareContract.orderId,
              ticketType: 'carnet',
            },
          })
        }
        testID={testID + 'Details'}
      />
    </Section>
  );
};
