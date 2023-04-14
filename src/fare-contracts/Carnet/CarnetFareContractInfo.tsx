import * as Sections from '@atb/components/sections';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {CarnetDetails} from '@atb/fare-contracts/Carnet/CarnetDetails';
import {CarnetTravelRight, FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';

type Props = {
  fareContract: FareContract;
  travelRights: CarnetTravelRight[];
  now: number;
  isInspectable: boolean;
  testID?: string;
};

type RootNavigationProp = NavigationProp<RootStackParamList>;

export const CarnetFareContractInfo: React.FC<Props> = ({
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
      <Sections.LinkSectionItem
        text={t(FareContractTexts.detailsLink.notValid)}
        onPress={() =>
          navigation.navigate('Root_FareContractModal', {
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
