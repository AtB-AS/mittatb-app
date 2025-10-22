import {useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/modules/auth';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import {type FareContractType} from '@atb-as/utils';
import {View} from 'react-native';
import {FareContractFromTo} from './FareContractFromTo';
import {FareContractDetailItem} from './FareContractDetailItem';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
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
import {SentToMessageBox} from './SentToMessageBox';

type Props = {fc: FareContractType};

export const TravelInfoSectionItem = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {validityStatus} = getFareContractInfo(serverNow, fc, currentUserId);
  const firstTravelRight = fc.travelRights[0];
  const {userProfiles, fareProductTypeConfigs} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
  const fareProductTypeConfig = fareProductTypeConfigs.find((c) => {
    return c.type === preassignedFareProduct?.type;
  });

  const userProfilesWithCount = mapToUserProfilesWithCount(
    fc.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const styles = useStyles();
  const {theme} = useThemeContext();
  const {topContainer} = useSectionItem({});

  return (
    <View
      style={[
        topContainer,
        {rowGap: theme.spacing.large, paddingVertical: theme.spacing.large},
      ]}
    >
      <View style={styles.detailRow}>
        <View style={styles.fareContractDetailItems}>
          <FareContractFromTo
            fc={fc}
            backgroundColor={theme.color.background.neutral[0]}
            mode="small"
          />
          {!!fareProductTypeConfig?.transportModes && (
            <FareContractDetailItem
              content={[
                getTransportModeText(fareProductTypeConfig.transportModes, t),
              ]}
            />
          )}

          {firstTravelRight.travelerName ? (
            <FareContractDetailItem content={[firstTravelRight.travelerName]} />
          ) : (
            userProfilesWithCount.map((u, i) => (
              <FareContractDetailItem
                key={`userProfile-${i}`}
                content={[userProfileCountAndName(u, language)]}
              />
            ))
          )}
        </View>
        {(validityStatus === 'valid' || validityStatus === 'sent') && (
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
          />
        )}
      </View>

      <SentToMessageBox fc={fc} />
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
    rowGap: theme.spacing.xSmall,
  },
}));
