import {FareContract, FareContractTraveller} from '@atb/api/fareContracts';
import ThemeText from '@atb/components/text';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';

const TicketInfo = ({fareContract: fc}: {fareContract: FareContract}) => {
  const {
    tariff_zones: tariffZones,
    preassigned_fare_products: preassignedFareProducts,
    user_profiles: userProfiles,
  } = useRemoteConfig();

  const {fare_product_ref: productRef, tariff_zone_refs} = fc.travellers[0];
  const [firstZone] = tariff_zone_refs;
  const [lastZone] = tariff_zone_refs.slice(-1);

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    productRef,
  );
  const fromTariffZone = findReferenceDataById(tariffZones, firstZone);
  const toTariffZone = findReferenceDataById(tariffZones, lastZone);

  const userProfilesWithCount = mapToUserProfilesWithCount(
    fc.travellers,
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
  travellers: FareContractTraveller[],
  userProfiles: UserProfile[],
): UserProfileWithCount[] =>
  travellers
    .reduce((groupedById, t) => {
      const existing = groupedById.find(
        (r) => r.userProfileId === t.user_profile_ref,
      );
      if (existing) {
        existing.count += 1;
        return groupedById;
      }
      return [...groupedById, {userProfileId: t.user_profile_ref, count: 1}];
    }, [] as {userProfileId: string; count: number}[])
    .map((idAndCount) => {
      const userProfile = findReferenceDataById(
        userProfiles,
        idAndCount.userProfileId,
      );
      return {
        ...userProfile,
        count: idAndCount.count,
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
