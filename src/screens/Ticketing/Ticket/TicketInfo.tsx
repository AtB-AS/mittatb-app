import ThemeText from '../../../components/text';
import {TicketTexts, useTranslation} from '../../../translations';
import React from 'react';
import {View} from 'react-native';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '../../../reference-data/types';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '../../../reference-data/utils';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';
import {StyleSheet} from '../../../theme';
import {PreactivatedTicket} from '../../../tickets';

const TicketInfo = ({travelRights}: {travelRights: PreactivatedTicket[]}) => {
  const {
    tariff_zones: tariffZones,
    preassigned_fare_products: preassignedFareProducts,
    user_profiles: userProfiles,
  } = useRemoteConfig();

  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const [firstZone] = tariffZoneRefs;
  const [lastZone] = tariffZoneRefs.slice(-1);

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    productRef,
  );
  const fromTariffZone = findReferenceDataById(tariffZones, firstZone);
  const toTariffZone = findReferenceDataById(tariffZones, lastZone);

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  return (
    <TicketInfoView
      preassignedFareProduct={preassignedFareProduct}
      fromTariffZone={fromTariffZone}
      toTariffZone={toTariffZone}
      userProfilesWithCount={userProfilesWithCount}
    />
  );
};
export const TicketInfoView = ({
  preassignedFareProduct,
  fromTariffZone,
  toTariffZone,
  userProfilesWithCount,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  return (
    <View>
      <View>
        {userProfilesWithCount.map((u) => (
          <ThemeText key={u.id}>{`${u.count} ${getReferenceDataName(
            u,
            language,
          )}`}</ThemeText>
        ))}
      </View>
      {preassignedFareProduct && (
        <ThemeText style={styles.product}>
          {getReferenceDataName(preassignedFareProduct, language)}
        </ThemeText>
      )}
      {fromTariffZone && toTariffZone && (
        <ThemeText type="lead" color="faded" style={styles.zones}>
          {fromTariffZone.id === toTariffZone.id
            ? t(
                TicketTexts.zone.single(
                  getReferenceDataName(fromTariffZone, language),
                ),
              )
            : t(
                TicketTexts.zone.multiple(
                  getReferenceDataName(fromTariffZone, language),
                  getReferenceDataName(toTariffZone, language),
                ),
              )}
        </ThemeText>
      )}
    </View>
  );
};

const mapToUserProfilesWithCount = (
  userProfileRefs: string[],
  userProfiles: UserProfile[],
): UserProfileWithCount[] =>
  userProfileRefs
    .reduce((groupedById, userProfileRef) => {
      const existing = groupedById.find(
        (r) => r.userProfileRef === userProfileRef,
      );
      if (existing) {
        existing.count += 1;
        return groupedById;
      }
      return [...groupedById, {userProfileRef, count: 1}];
    }, [] as {userProfileRef: string; count: number}[])
    .map((refAndCount) => {
      const userProfile = findReferenceDataById(
        userProfiles,
        refAndCount.userProfileRef,
      );
      return {
        ...userProfile,
        count: refAndCount.count,
      };
    })
    .filter(
      (userProfileWithCount): userProfileWithCount is UserProfileWithCount =>
        'id' in userProfileWithCount,
    );

const useStyles = StyleSheet.createThemeHook((theme) => ({
  product: {
    marginTop: theme.spacings.small,
  },
  zones: {
    marginTop: theme.spacings.small,
  },
}));

export default TicketInfo;
