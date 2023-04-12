import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {CompactFareContractInfo} from '@atb/fare-contracts/CompactFareContractInfo';
import {useInterval} from '@atb/utils/use-interval';
import {
  filterValidRightNowFareContract,
  useTicketingState,
} from '@atb/ticketing';
import {ThemeText} from '@atb/components/text';
import {
  TicketingTexts,
  DashboardTexts,
  useTranslation,
} from '@atb/translations';
import {Button} from '@atb/components/button';
import {getFareContractInfoDetails} from '../../../../../fare-contracts/FareContractInfo';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type Props = {
  onPressDetails?: (
    isCarnet: boolean,
    isInspectable: boolean,
    orderId: string,
  ) => void;
  onPressBuy(): void;
};

export const CompactFareContracts: React.FC<Props> = ({
  onPressDetails,
  onPressBuy,
}) => {
  const itemStyle = useStyles();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 1000);

  const {fareContracts} = useTicketingState();
  const validFareContracts = filterValidRightNowFareContract(fareContracts);

  const {t} = useTranslation();
  const {customerProfile} = useTicketingState();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();

  return (
    <>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={itemStyle.sectionText}
        accessibilityLabel={t(TicketingTexts.header.title)}
      >
        {t(TicketingTexts.header.title)}
      </ThemeText>
      {validFareContracts.length == 0 ? (
        <Button
          style={itemStyle.buttonSection}
          text={t(DashboardTexts.buyButton)}
          onPress={onPressBuy}
          testID="buyTicketsButton"
        />
      ) : (
        validFareContracts.map((fareContract, index) => {
          const fareContractInfoDetailsProps = getFareContractInfoDetails(
            fareContract,
            now,
            customerProfile,
            hasEnabledMobileToken,
            deviceIsInspectable,
            mobileTokenError,
            fallbackEnabled,
            tariffZones,
            userProfiles,
            preassignedFareProducts,
          );
          return (
            <CompactFareContractInfo
              key={fareContract.id}
              {...fareContractInfoDetailsProps}
              now={now}
              onPressDetails={() => {
                onPressDetails?.(
                  fareContractInfoDetailsProps.isCarnetFareContract ?? false,
                  fareContractInfoDetailsProps.isInspectable ?? false,
                  fareContract.orderId,
                );
              }}
              testID={'fareContract' + index}
            />
          );
        })
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  buttonSection: {
    marginLeft: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
}));
