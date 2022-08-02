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
import {StyleSheet, useTheme} from '@atb/theme';
import {PreactivatedTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {TicketAdd, TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {Warning} from '@atb/assets/svg/color/situations';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {flatStaticColors, getStaticColor, StaticColor} from '@atb/theme/colors';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {
  findInspectable,
  getDeviceName,
  isMobileToken,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {RemoteToken} from '@atb/mobile-token/types';
import TravelTokenBoxTexts from '@atb/translations/components/TravelTokenBox';

type TicketInfoProps = {
  travelRights: PreactivatedTicket[];
  status: ValidityStatus | 'recent';
  isInspectable: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
};

const TicketInfo = ({
  travelRights,
  status,
  isInspectable,
  omitUserProfileCount,
  testID,
}: TicketInfoProps) => {
  const {tariffZones, userProfiles, preassignedFareproducts} =
    useFirestoreConfiguration();

  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const [firstZone] = tariffZoneRefs;
  const [lastZone] = tariffZoneRefs.slice(-1);

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareproducts,
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
      isInspectable={isInspectable}
      omitUserProfileCount={omitUserProfileCount}
      testID={testID}
    />
  );
};

type TicketInfoViewProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: TicketInfoProps['status'];
  isInspectable?: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
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

const WarningMessage = (
  isError: boolean,
  fallbackEnabled: boolean,
  remoteTokens?: RemoteToken[],
  isInspectable?: boolean,
) => {
  const {t} = useTranslation();
  const inspectableToken = findInspectable(remoteTokens);
  if (isError && fallbackEnabled) return null;

  if (isError)
    return (
      <ThemeText type="body__secondary">
        {t(TicketTexts.warning.unableToRetrieveToken)}
      </ThemeText>
    );
  if (!inspectableToken)
    return (
      <ThemeText type="body__secondary">
        {t(TicketTexts.warning.noInspectableTokenFound)}
      </ThemeText>
    );
  if (isTravelCardToken(inspectableToken))
    return (
      <ThemeText type="body__secondary">
        {t(TicketTexts.warning.travelCardAstoken)}
      </ThemeText>
    );
  if (isMobileToken(inspectableToken) && !isInspectable)
    return (
      <ThemeText type="body__secondary">
        {t(
          TicketTexts.warning.anotherMobileAsToken(
            getDeviceName(inspectableToken) ||
              t(TicketTexts.warning.unnamedDevice),
          ),
        )}
      </ThemeText>
    );
};

const TicketInfoTexts = (props: TicketInfoViewProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    isInspectable,
    omitUserProfileCount,
    testID,
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
    omitUserProfileCount
      ? `${getReferenceDataName(u, language)}`
      : `${u.count} ${getReferenceDataName(u, language)}`;

  const {isError, remoteTokens, fallbackEnabled} = useMobileTokenContextState();
  const warning = WarningMessage(
    isError,
    fallbackEnabled,
    remoteTokens,
    isInspectable,
  );

  return (
    <View style={styles.textsContainer} accessible={true}>
      <View>
        {userProfilesWithCount.map((u) => (
          <ThemeText
            type="body__primary--bold"
            key={u.id}
            accessibilityLabel={userProfileCountAndName(u) + screenReaderPause}
            testID={testID + 'UserAndCount'}
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
          testID={testID + 'Product'}
        >
          {productName}
        </ThemeText>
      )}
      {tariffZoneSummary && (
        <ThemeText
          type="body__secondary"
          style={styles.zones}
          accessibilityLabel={tariffZoneSummary + screenReaderPause}
          testID={testID + 'Zones'}
        >
          {tariffZoneSummary}
        </ThemeText>
      )}
      {warning && (
        <View style={styles.warning}>
          <ThemeIcon svg={Warning} style={styles.warningIcon} />
          {warning}
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
  const {theme, themeName} = useTheme();
  const {language} = useTranslation();
  if (!fromTariffZone || !toTariffZone) return null;
  const themeColor: StaticColor | undefined =
    preassignedFareProduct?.type === 'period' && isInspectable
      ? 'valid'
      : undefined;
  const icon = IconForStatus(status, isInspectable, themeColor);
  if (!icon) return null;
  const showAsInspectable = isInspectable || status !== 'valid';
  const isValid = status === 'valid';
  return (
    <View
      style={[
        showAsInspectable && styles.symbolContainer,
        isValid && {
          ...styles.symbolContainerCircle,
          backgroundColor: themeColor
            ? flatStaticColors[themeName][themeColor].background
            : undefined,
        },
        isValid &&
          !isInspectable && {
            ...styles.textContainer,
            borderColor: theme.static.status.warning.background,
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
            color={themeColor}
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
  themeColor?: StaticColor,
): ReactElement | null => {
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const fillColor = getStaticColor(
    themeName,
    themeColor || 'background_0',
  ).text;

  switch (status) {
    case 'valid':
      if (isInspectable)
        return <ThemeIcon svg={Bus} fill={fillColor} size={'large'} />;
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
      return <ThemeIcon svg={TicketInvalid} colorType="error" size={'large'} />;
    case 'recent':
      return <ThemeIcon svg={TicketAdd} colorType="primary" size={'large'} />;
    case 'upcoming':
      return <ThemeIcon svg={Time} colorType="primary" size={'large'} />;
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
    borderColor: theme.static.status.valid.background,
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
  warning: {
    flexDirection: 'row',
    paddingVertical: theme.spacings.small,
  },
  warningIcon: {
    marginRight: theme.spacings.small,
  },
}));

export default TicketInfo;
