import {getFareContractInfo, hasShmoBookingId} from './utils';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {MobilityBenefitsInfoSectionItem} from '@atb/modules/mobility';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/modules/auth';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useOperatorBenefitsForFareProduct} from '@atb/modules/mobility';
import {
  isCanBeConsumedNowFareContract,
  isCanBeActivatedNowFareContract,
} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';
import {StyleSheet} from '@atb/theme';
import {ActivateNowSectionItem} from './components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ProductName} from './components/ProductName';
import {Description} from './components/FareContractDescription';
import {WithValidityLine} from './components/WithValidityLine';
import {TravelInfoSectionItem} from './components/TravelInfoSectionItem';
import {ValidityTime} from './components/ValidityTime';
import {FareContractShmoHeaderSectionItem} from './sections/FareContractShmoHeaderSectionItem';
import {ShmoTripDetailsSectionItem} from '@atb/modules/mobility';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {
  EarnedBonusPointsSectionItem,
  useBonusAmountEarnedQuery,
} from '../bonus';

type Props = {
  now: number;
  fareContract: FareContractType;
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

  const {travelRights, validityStatus} = getFareContractInfo(
    now,
    fareContract,
    currentUserId,
  );

  const firstTravelRight = travelRights[0];
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
  const {benefits} = useOperatorBenefitsForFareProduct(
    firstTravelRight.fareProductRef,
  );

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && validityStatus === 'valid';

  const shouldShowEarnedBonusPoints =
    validityStatus === 'valid' || validityStatus === 'upcoming';

  const {data: earnedBonusPoints} = useBonusAmountEarnedQuery(
    fareContract.id,
    !shouldShowEarnedBonusPoints,
  );

  return (
    <Section testID={testID}>
      {hasShmoBookingId(fareContract) ? (
        <FareContractShmoHeaderSectionItem fareContract={fareContract} />
      ) : (
        <GenericSectionItem style={styles.header}>
          <WithValidityLine fc={fareContract}>
            <ProductName fc={fareContract} />
            <ValidityTime fc={fareContract} />
            <Description fc={fareContract} />
          </WithValidityLine>
        </GenericSectionItem>
      )}

      {hasShmoBookingId(fareContract) ? (
        <ShmoTripDetailsSectionItem
          startDateTime={fareContract.travelRights[0].startDateTime}
          endDateTime={fareContract.travelRights[0].endDateTime}
          totalAmount={fareContract.totalAmount}
          withHeader={true}
        />
      ) : (
        <TravelInfoSectionItem fc={fareContract} />
      )}
      {shouldShowBundlingInfo && (
        <MobilityBenefitsInfoSectionItem benefits={benefits} />
      )}

      {shouldShowEarnedBonusPoints &&
        !!earnedBonusPoints &&
        earnedBonusPoints > 0 && (
          <EarnedBonusPointsSectionItem amount={earnedBonusPoints} />
        )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(fareContract, now, currentUserId) && (
          <ActivateNowSectionItem
            fareContractId={fareContract.id}
            fareProductType={preassignedFareProduct?.type}
          />
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
        <ConsumeCarnetSectionItem
          fareContractId={fareContract.id}
          fareProductType={preassignedFareProduct?.type}
        />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  header: {
    paddingVertical: 0,
  },
}));
