import {useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/modules/auth';
import {
  useGetFareProductsQuery,
  useGetSupplementProductsQuery,
} from '@atb/modules/ticketing';
import {type FareContractType} from '@atb-as/utils';
import {View} from 'react-native';
import {FareContractFromTo} from './FareContractFromTo';
import {FareContractDetailItem} from './FareContractDetailItem';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {
  getFareContractInfo,
  getTravellersIcon,
  getTravellersText,
  mapToUserProfilesWithCount,
} from '../utils';
import {InspectionSymbol} from './InspectionSymbol';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useTimeContext} from '@atb/modules/time';
import {useSectionItem} from '@atb/components/sections';
import {isDefined} from '@atb/utils/presence';
import {SentOrReceivedMessageBox} from './SentOrReceivedMessageBox';
import {mapUniqueWithCount} from '@atb/utils/unique-with-count';
import {getBaggageProducts} from '../get-baggage-products';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {Travellers} from '@atb/assets/svg/mono-icons/ticketing';
import {useTicketAccessibilityLabel} from '../use-ticket-accessibility-label';

type Props = {fc: FareContractType};

export const TravelInfoSectionItem = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {validityStatus} = getFareContractInfo(serverNow, fc, currentUserId);

  const {userProfiles, fareProductTypeConfigs, fareZones} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  const productsInFareContract = fc.travelRights
    .map((tr) =>
      findReferenceDataById(preassignedFareProducts, tr.fareProductRef),
    )
    .filter(isDefined);

  const firstTravelRight = fc.travelRights[0];
  const preassignedFareProduct = productsInFareContract[0];

  const travelRightFareZones = firstTravelRight.fareZoneRefs
    ?.map((fz) => findReferenceDataById(fareZones, fz))
    .filter(isDefined);
  const travelRightFromPlace = firstTravelRight.startPointRef;
  const travelRightToPlace = firstTravelRight.endPointRef;
  const direction = firstTravelRight.direction;

  const fareProductTypeConfig = fareProductTypeConfigs.find((c) => {
    return c.type === preassignedFareProduct?.type;
  });

  const userProfilesWithCount = mapToUserProfilesWithCount(
    fc.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const {data: allSupplementProducts} = useGetSupplementProductsQuery();

  const baggageProducts = getBaggageProducts(
    productsInFareContract,
    allSupplementProducts,
  );

  const baggageProductsWithCount = mapUniqueWithCount(
    baggageProducts,
    (a, b) => a.id === b.id,
  );

  const travellersIcon = getTravellersIcon(
    userProfilesWithCount,
    baggageProductsWithCount,
  );

  const travellersWithCountText = getTravellersText(
    userProfilesWithCount,
    baggageProductsWithCount,
    language,
  );

  const styles = useStyles();
  const {theme} = useThemeContext();
  const {topContainer} = useSectionItem({});

  const ticketAccessibilityLabel = useTicketAccessibilityLabel(
    fareProductTypeConfig,
    userProfilesWithCount,
    baggageProductsWithCount,
    travelRightFareZones ?? [],
    travelRightFromPlace,
    travelRightToPlace,
    direction,
  );

  return (
    <View
      style={[
        topContainer,
        {rowGap: theme.spacing.large, paddingVertical: theme.spacing.large},
      ]}
    >
      <View style={styles.detailRow} accessible={true}>
        <View
          style={styles.fareContractDetailItems}
          accessibilityLabel={ticketAccessibilityLabel}
        >
          <FareContractFromTo
            fc={fc}
            backgroundColor={theme.color.background.neutral[0]}
            size="normal"
          />
          {!!fareProductTypeConfig?.transportModes && (
            <FareContractDetailItem
              icon={
                getTransportModeSvg(
                  fareProductTypeConfig.transportModes[0].mode,
                  fareProductTypeConfig.transportModes[0].subMode,
                  false,
                ).svg
              }
              content={getTransportModeText(
                fareProductTypeConfig.transportModes,
                t,
              )}
            />
          )}

          {firstTravelRight.travelerName ? (
            <FareContractDetailItem
              icon={Travellers}
              content={firstTravelRight.travelerName}
            />
          ) : (
            <FareContractDetailItem
              icon={travellersIcon}
              content={travellersWithCountText}
            />
          )}
        </View>
        {(validityStatus === 'valid' || validityStatus === 'sent') && (
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
          />
        )}
      </View>

      <SentOrReceivedMessageBox fc={fc} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: theme.spacing.small,
  },
  fareContractDetailItems: {
    flex: 1,
    gap: theme.spacing.medium,
  },
}));
