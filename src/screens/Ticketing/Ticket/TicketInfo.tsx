import {FareContract, FareContractTraveller} from '../../../api/fareContracts';
import ThemeText from '../../../components/text';
import {TicketTexts, useTranslation} from '../../../translations';
import React from 'react';
import {View} from 'react-native';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import {
  UserProfile,
} from '../../../reference-data/types';

const TicketInfo = ({fareContract: fc}: {fareContract: FareContract}) => {
  const {t} = useTranslation();
  const {
    tariff_zones: tariffZones,
    preassigned_fare_products: preassignedFareProducts,
    user_profiles: userProfiles,
  } = useRemoteConfig();

  const preassignedFareProduct = findById(
    preassignedFareProducts,
    fc.travellers[0].fare_product_ref,
  );

  const fromTariffZone = findById(
    tariffZones,
    fc.travellers[0].tariff_zone_refs[0],
  );
  const toTariffZone = findById(
    tariffZones,
    fc.travellers[0].tariff_zone_refs.slice(-1)[0],
  );

  const namesAndCounts = groupByUserProfileNames(fc.travellers, userProfiles);

  return (
    <View>
      <View>
        {namesAndCounts.map(({name, count}) => (
          <ThemeText key={name}>{`${count} ${name}`}</ThemeText>
        ))}
      </View>
      {preassignedFareProduct && (
        <ThemeText style={{paddingTop: 4}} type="lead" color="faded">
          {preassignedFareProduct?.name.value}
        </ThemeText>
      )}
      {fromTariffZone && toTariffZone && (
        <ThemeText type="lead" color="faded">
          {fromTariffZone.id === toTariffZone.id
            ? t(TicketTexts.zone.single(fromTariffZone.name.value))
            : t(
                TicketTexts.zone.multiple(
                  fromTariffZone.name.value,
                  toTariffZone.name.value,
                ),
              )}
        </ThemeText>
      )}
    </View>
  );
};

const findById = <T extends {id: string}>(elements: T[], id: string) =>
  elements.find((p) => p.id === id);

type NameAndCount = {name: string; count: number};

/**
 * Group the travellers by user profile names. Will return an array with format:
 *     [
 *       { name: 'Voksen', count: 3},
 *       { name: 'Barn', count: 2},
 *       { name: 'Student', count: 4},
 *       ...
 *     ]
 */
const groupByUserProfileNames = (
  travellers: FareContractTraveller[],
  userProfiles: UserProfile[],
): NameAndCount[] =>
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
    .map((idAndCount) => ({
      name: findById(userProfiles, idAndCount.userProfileId)?.name.value,
      count: idAndCount.count,
    }))
    .filter(
      (nameAndCount): nameAndCount is NameAndCount => nameAndCount.name != null,
    );

export default TicketInfo;
