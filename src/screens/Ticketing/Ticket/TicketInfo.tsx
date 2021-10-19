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
import {TicketTexts, useTranslation} from '@atb/translations';
import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {BusSide, Wait} from '@atb/assets/svg/icons/transportation';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {AddTicket, InvalidTicket} from '@atb/assets/svg/icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {Warning} from '@atb/assets/svg/situations';

type TicketInfoProps = {
  travelRights: PreactivatedTicket[];
  status: ValidityStatus | 'recent';
  hasActiveTravelCard: boolean;
  isInspectable: boolean;
};

const TicketInfo = ({
  travelRights,
  status,
  hasActiveTravelCard,
  isInspectable,
}: TicketInfoProps) => {
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
      hasActiveTravelCard={hasActiveTravelCard}
      isInspectable={isInspectable}
    />
  );
};

type TicketInfoViewProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: TicketInfoProps['status'];
  hasActiveTravelCard?: boolean;
  isInspectable?: boolean;
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
    hasActiveTravelCard,
  } = props;
  const {t, language} = useTranslation();
  const styles = useStyles();

  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;

  const tariffZoneSummary =
    fromTariffZone && toTariffZone
      ? tariffZonesSummary(fromTariffZone, toTariffZone, language, t)
      : undefined;

  const userProfileCountAndName = (u: UserProfileWithCount) =>
    `${u.count} ${getReferenceDataName(u, language)}`;

  return (
    <View style={styles.textsContainer} accessible={true}>
      <View>
        {userProfilesWithCount.map((u) => (
          <ThemeText
            type="body__primary--bold"
            key={u.id}
            accessibilityLabel={userProfileCountAndName(u) + screenReaderPause}
          >
            {userProfileCountAndName(u)}
          </ThemeText>
        ))}
      </View>
      {productName && (
        <ThemeText
          type="body__secondary"
          style={styles.product}
          accessibilityLabel={productName + screenReaderPause}
        >
          {productName}
        </ThemeText>
      )}
      {tariffZoneSummary && (
        <ThemeText
          type="body__secondary"
          style={styles.zones}
          accessibilityLabel={tariffZoneSummary + screenReaderPause}
        >
          {tariffZoneSummary}
        </ThemeText>
      )}
      {hasActiveTravelCard && (
        <View style={styles.tCardWarning}>
          <ThemeIcon svg={Warning} style={styles.tCardWarningIcon}></ThemeIcon>
          <ThemeText>{t(TicketTexts.ticketInfo.tCardIsActive)}</ThemeText>
        </View>
      )}
    </View>
  );
};

const TicketInspectionSymbol = ({
  fromTariffZone,
  toTariffZone,
  preassignedFareProduct,
  status,
  isInspectable = true,
}: TicketInfoViewProps) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {language} = useTranslation();
  if (!fromTariffZone || !toTariffZone) return null;
  const icon = IconForStatus(status, isInspectable);
  if (!icon) return null;
  const showAsInspectable = isInspectable || status !== 'valid';
  const isValid = status === 'valid';
  return (
    <View
      style={[
        showAsInspectable && styles.symbolContainer,
        isValid && {
          ...styles.symbolContainerCircle,
          backgroundColor:
            preassignedFareProduct?.type === 'period' && isInspectable
              ? theme.colors.primary_1.backgroundColor
              : 'none',
        },
        isValid &&
          !isInspectable && {
            ...styles.textContainer,
            borderColor: theme.status.warning.main.backgroundColor,
          },
      ]}
      accessibilityElementsHidden={isInspectable}
    >
      <>
        {status === 'valid' && isInspectable && (
          <ThemeText
            type="body__primary--bold"
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

const IconForStatus = (
  status: TicketInfoProps['status'],
  isInspectable: boolean,
): ReactElement | null => {
  const {t} = useTranslation();
  switch (status) {
    case 'valid':
      if (isInspectable)
        return <ThemeIcon svg={BusSide} colorType="primary" size={'large'} />;
      else
        return (
          <ThemeText
            type="body__tertiary"
            style={{
              textAlign: 'center',
            }}
            accessibilityLabel={t(
              TicketTexts.ticketInfo.noInspectionIconA11yLabel,
            )}
          >
            {t(TicketTexts.ticketInfo.noInspectionIcon)}
          </ThemeText>
        );
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
    borderRadius: 1000,
    borderColor: theme.colors.primary_1.backgroundColor,
    borderWidth: 5,
  },
  symbolZones: {
    marginTop: theme.spacings.small,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    aspectRatio: 1,
    padding: theme.spacings.small,
  },
  tCardWarning: {
    flexDirection: 'row',
    paddingVertical: theme.spacings.small,
  },
  tCardWarningIcon: {
    marginRight: theme.spacings.small,
  },
}));

export default TicketInfo;
