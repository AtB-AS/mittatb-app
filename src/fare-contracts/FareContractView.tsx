import {getFareContractInfo} from '@atb/fare-contracts/utils';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {MobilityBenefitsInfoSectionItem} from '@atb/mobility/components/MobilityBenefitsInfoSectionItem';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/auth';
import {useMobileTokenContext} from '@atb/mobile-token';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import {
  isCanBeConsumedNowFareContract,
  FareContract,
  isCanBeActivatedNowFareContract,
} from '@atb/ticketing';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';
import {StyleSheet} from '@atb/theme';
import {ActivateNowSectionItem} from './components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {ProductName} from '@atb/fare-contracts/components/ProductName';
import {Description} from '@atb/fare-contracts/components/FareContractDescription';
import {WithValidityLine} from '@atb/fare-contracts/components/WithValidityLine';
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {TicketInfoSectionItem} from '@atb/fare-contracts/modules/TicketInfoSectionItem';

type Props = {
  now: number;
  fareContract: FareContract;
  isStatic?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

export const FareContractView: React.FC<Props> = ({
  now,
  fareContract,
  isStatic,
  onPressDetails,
  testID,
}) => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isInspectable} = useMobileTokenContext();
  const {isActivateTicketNowEnabled} = useFeatureTogglesContext();

  const {t} = useTranslation();
  const styles = useStyles();

  const {
    isCarnetFareContract,
    travelRights,
    validityStatus,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fareContract, currentUserId);

  const firstTravelRight = travelRights[0];

  const {benefits} = useOperatorBenefitsForFareProduct(
    firstTravelRight.fareProductRef,
  );

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && validityStatus === 'valid';

  return (
    <Section testID={testID}>
      <GenericSectionItem style={styles.header}>
        <WithValidityLine fc={fareContract}>
          <ProductName fc={fareContract} />
          <ValidityHeader fc={fareContract} />
          <Description fc={fareContract} />
        </WithValidityLine>
      </GenericSectionItem>
      <TicketInfoSectionItem fc={fareContract} />
      {isCarnetFareContract && (
        <GenericSectionItem>
          <CarnetFooter
            active={validityStatus === 'valid'}
            maximumNumberOfAccesses={maximumNumberOfAccesses!}
            numberOfUsedAccesses={numberOfUsedAccesses!}
          />
        </GenericSectionItem>
      )}
      {shouldShowBundlingInfo && (
        <MobilityBenefitsInfoSectionItem benefits={benefits} />
      )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(fareContract, now, currentUserId) && (
          <ActivateNowSectionItem fareContractId={fareContract.id} />
        )}
      {!isStatic && (
        <LinkSectionItem
          text={t(
            validityStatus === 'valid' && isInspectable
              ? FareContractTexts.detailsLink.valid
              : FareContractTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
      {isCanBeConsumedNowFareContract(fareContract, now, currentUserId) && (
        <ConsumeCarnetSectionItem fareContractId={fareContract.id} />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  header: {
    paddingVertical: 0,
  },
}));
