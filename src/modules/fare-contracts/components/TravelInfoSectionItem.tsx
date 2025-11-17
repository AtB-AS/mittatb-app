import {useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/modules/auth';
import {View} from 'react-native';
import {FareContractFromTo} from './FareContractFromTo';
import {FareContractDetailItem} from './FareContractDetailItem';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {InspectionSymbol} from './InspectionSymbol';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useSectionItem} from '@atb/components/sections';
import {SentToMessageBox} from './SentToMessageBox';
import {FareContractInfo} from '@atb/modules/fare-contracts';
import {
  arrayMapUniqueWithCount,
  toCountAndName,
} from '@atb/utils/array-map-unique-with-count';
import {useTimeContext} from '@atb/modules/time';

type Props = {fc: FareContractInfo};

export const TravelInfoSectionItem = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {validityStatus} = fc.getValidityInfo(serverNow, currentUserId);

  const userProfilesWithCount = arrayMapUniqueWithCount(
    fc.allUserProfiles,
    (a, b) => a.id === b.id,
  );

  const baggeProducts = fc.tickets.filter((t) => t.isBaggageProduct);

  const baggeProductsWithCount = arrayMapUniqueWithCount(
    baggeProducts,
    (a, b) => a.fareProductRef === b.fareProductRef,
  );

  const travelerName = fc.tickets.find(
    (t) => t.travelerName !== undefined,
  )?.travelerName;

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
          {fc.allTransportModes.length > 0 && (
            <FareContractDetailItem
              content={[getTransportModeText(fc.allTransportModes, t)]}
            />
          )}

          {travelerName ? (
            <FareContractDetailItem content={[travelerName]} />
          ) : (
            <>
              {userProfilesWithCount.map((u, i) => (
                <FareContractDetailItem
                  key={`userProfile-${i}`}
                  content={[toCountAndName(u, language)]}
                />
              ))}
              {baggeProductsWithCount.map((p, i) => (
                <FareContractDetailItem
                  key={`baggageProduct-${i}`}
                  content={[toCountAndName(p, language)]}
                />
              ))}
            </>
          )}
        </View>
        {(validityStatus === 'valid' || validityStatus === 'sent') && (
          <InspectionSymbol
            fareContractInfo={fc}
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
