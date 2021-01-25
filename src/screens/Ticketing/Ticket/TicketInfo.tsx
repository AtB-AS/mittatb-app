import {FareContract, FareContractTraveller} from '../../../api/fareContracts';
import ThemeText from '../../../components/text';
import {Language, TicketTexts, useTranslation} from '../../../translations';
import React from 'react';
import {View} from 'react-native';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import {UserProfile} from '../../../reference-data/types';
import {getReferenceDataName} from '../../../reference-data/utils';

const TicketInfo = ({fareContract: fc}: {fareContract: FareContract}) => {
  const {t, language} = useTranslation();
  const {
    tariff_zones: tariffZones,
    preassigned_fare_products: preassignedFareProducts,
    user_profiles: userProfiles,
  } = useRemoteConfig();

  const {fare_product_ref: productRef, tariff_zone_refs} = fc.travellers[0];
  const [firstZone] = tariff_zone_refs;
  const [lastZone] = tariff_zone_refs.slice(-1);

  const preassignedFareProduct = findById(preassignedFareProducts, productRef);
  const fromTariffZone = findById(tariffZones, firstZone);
  const toTariffZone = findById(tariffZones, lastZone);

  const namesAndCounts = groupByUserProfileNames(
    fc.travellers,
    userProfiles,
    language,
  );

  return (
    <View>
      <View>
        {namesAndCounts.map(({name, count}) => (
          <ThemeText key={name}>{`${count} ${name}`}</ThemeText>
        ))}
      </View>
      {preassignedFareProduct && (
        <ThemeText style={{paddingTop: 4}} type="lead" color="faded">
          {getReferenceDataName(preassignedFareProduct, language)}
        </ThemeText>
      )}
      {fromTariffZone && toTariffZone && (
        <ThemeText type="lead" color="faded">
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
  language: Language,
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
    .map((idAndCount) => {
      const userProfile = findById(userProfiles, idAndCount.userProfileId);
      const name = userProfile
        ? getReferenceDataName(userProfile, language)
        : undefined;
      return {
        name,
        count: idAndCount.count,
      };
    })
    .filter(
      (nameAndCount): nameAndCount is NameAndCount => nameAndCount.name != null,
    );

export default TicketInfo;
