import {PreactivatedTicket} from '../../../api/fareContracts';
import ThemeText from '../../../components/text';
import {Language, TicketTexts, useTranslation} from '../../../translations';
import React from 'react';
import {View} from 'react-native';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import {UserProfile} from '../../../reference-data/types';
import {getReferenceDataName} from '../../../reference-data/utils';

const TicketInfo = ({travelRights}: {travelRights: PreactivatedTicket[]}) => {
  const {t, language} = useTranslation();
  const {
    tariff_zones: tariffZones,
    preassigned_fare_products: preassignedFareProducts,
    user_profiles: userProfiles,
  } = useRemoteConfig();

  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const [firstZone] = tariffZoneRefs;
  const [lastZone] = tariffZoneRefs.slice(-1);

  const preassignedFareProduct = findById(preassignedFareProducts, productRef);
  const fromTariffZone = findById(tariffZones, firstZone);
  const toTariffZone = findById(tariffZones, lastZone);

  const namesAndCounts = groupByUserProfileNames(
    travelRights.map((tr) => tr.userProfileRef),
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
  userProfileRefs: string[],
  userProfiles: UserProfile[],
  language: Language,
): NameAndCount[] =>
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
    .map((idAndCount) => {
      const userProfile = findById(userProfiles, idAndCount.userProfileRef);
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
