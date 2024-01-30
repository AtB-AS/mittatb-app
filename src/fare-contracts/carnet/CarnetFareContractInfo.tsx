import {RootStackParamList} from '@atb/stacks-hierarchy';
import {CarnetDetails} from '@atb/fare-contracts/carnet/CarnetDetails';
import {CarnetTravelRight, FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {MobilityBenefitsInfoSectionItem} from '@atb/mobility/components/MobilityBenefitsInfoSectionItem';
import {
  findReferenceDataById,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {getFareProductRef} from '@atb/fare-contracts/utils';

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
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    getFareProductRef(fareContract),
  );

  return (
    <Section withBottomPadding testID={testID}>
      <CarnetDetails
        now={now}
        travelRights={travelRights}
        testID={testID}
        fareContract={fareContract}
      />
      <MobilityBenefitsInfoSectionItem
        fareProductId={preassignedFareProduct?.id}
      />
      <LinkSectionItem
        text={t(FareContractTexts.detailsLink.notValid)}
        onPress={() =>
          navigation.navigate({
            name: 'Root_FareContractDetailsScreen',
            params: {
              orderId: fareContract.orderId,
            },
          })
        }
        testID={testID + 'Details'}
      />
    </Section>
  );
};
