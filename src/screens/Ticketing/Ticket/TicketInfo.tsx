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
import {StyleSheet, useTheme} from '@atb/theme';
import {PreactivatedTicket} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {BusSide, Wait} from '@atb/assets/svg/icons/transportation';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {AddTicket, InvalidTicket} from '@atb/assets/svg/icons/ticketing';

type TicketInfoProps = {
  travelRights: PreactivatedTicket[];
  status: ValidityStatus | 'recent';
};

const TicketInfo = ({travelRights, status}: TicketInfoProps) => {
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
      status={status}
    />
  );
};

type TicketInfoViewProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: TicketInfoProps['status'];
};

export const TicketInfoView = (props: TicketInfoViewProps) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <TicketInfoTexts {...props} />
      <TicketInspectionSymbol {...props} />
    </View>
  );
};

const TicketInfoTexts = (props: TicketInfoViewProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
  } = props;
  const {t, language} = useTranslation();
  const styles = useStyles();
  return (
    <View style={styles.textsContainer} accessible={true}>
      <View>
        {userProfilesWithCount.map((u) => (
          <ThemeText type="paragraphHeadline" key={u.id}>{`${
            u.count
          } ${getReferenceDataName(u, language)}`}</ThemeText>
        ))}
      </View>
      {preassignedFareProduct && (
        <ThemeText type="lead" style={styles.product}>
          {getReferenceDataName(preassignedFareProduct, language)}
        </ThemeText>
      )}
      {fromTariffZone && toTariffZone && (
        <ThemeText type="lead" style={styles.zones}>
          {tariffZonesSummary(fromTariffZone, toTariffZone, language, t)}
        </ThemeText>
      )}
    </View>
  );
};

const TicketInspectionSymbol = ({
  fromTariffZone,
  toTariffZone,
  preassignedFareProduct,
  status,
}: TicketInfoViewProps) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {language} = useTranslation();
  if (!fromTariffZone || !toTariffZone) return null;
  const icon = getIconForStatus(status);
  if (!icon) return null;
  return (
    <View
      style={[
        styles.symbolContainer,
        status === 'valid' && {
          ...styles.symbolContainerCircle,
          backgroundColor:
            preassignedFareProduct?.type === 'period'
              ? theme.colors.primary_1.backgroundColor
              : 'none',
        },
      ]}
      accessibilityElementsHidden={true}
    >
      <>
        {status === 'valid' && (
          <ThemeText
            type="paragraphHeadline"
            allowFontScaling={false}
            style={styles.symbolZones}
          >
            {getReferenceDataName(fromTariffZone, language)}
            {fromTariffZone.id !== toTariffZone.id &&
              '-' + getReferenceDataName(toTariffZone, language)}
          </ThemeText>
        )}
        {icon}
      </>
    </View>
  );
};

const getIconForStatus = (
  status: TicketInfoProps['status'],
): ReactElement | null => {
  switch (status) {
    case 'valid':
      return <ThemeIcon svg={BusSide} colorType="primary" size={'large'} />;
    case 'expired':
    case 'refunded':
      return <ThemeIcon svg={InvalidTicket} colorType="error" size={'large'} />;
    case 'recent':
      return <ThemeIcon svg={AddTicket} colorType="primary" size={'large'} />;
    case 'upcoming':
      return <ThemeIcon svg={Wait} colorType="primary" size={'large'} />;
    case 'reserving':
    case 'unknown':
      return null;
  }
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
  container: {flexDirection: 'row'},
  textsContainer: {flex: 1, paddingTop: theme.spacings.xSmall},
  product: {
    marginTop: theme.spacings.small,
  },
  zones: {
    marginTop: theme.spacings.small,
  },
  symbolContainer: {
    height: 72,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolContainerCircle: {
    borderRadius: 36,
    borderColor: theme.colors.primary_1.backgroundColor,
    borderWidth: 5,
  },
  symbolZones: {
    marginTop: theme.spacings.small,
  },
}));

export default TicketInfo;
