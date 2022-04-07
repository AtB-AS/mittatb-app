import * as Sections from '@atb/components/sections';
import {
  CarnetTicket,
  CarnetTicketUsedAccess,
  FareContractState,
  flattenCarnetTicketAccesses,
} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ValidityLine from '../ValidityLine';
import {getRelativeValidity, getValidityStatus} from '../utils';
import {StyleSheet, useTheme} from '@atb/theme';
import TicketInfo from '../TicketInfo';
import UsedAccessValidityHeader from './UsedAccessValidityHeader';
import {UsedAccessStatus} from './types';
import ValidityHeader from '../ValidityHeader';
import ThemeText from '@atb/components/text';
import CarnetFooter from './CarnetFooter';
import Dash from 'react-native-dash';
import SectionSeparator from '@atb/components/sections/section-separator';

type Props = {
  fareContractState: FareContractState;
  travelRights: CarnetTicket[];
  now: number;
  isInspectable: boolean;
  testID?: string;
};

const CarnetTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  isInspectable,
  testID,
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {usedAccesses, maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTicketAccesses(travelRights);

  const {
    status: usedAccessValidityStatus,
    validFrom: usedAccessValidFrom,
    validTo: usedAccessValidTo,
  } = useLastUsedAccess(now, usedAccesses);

  const fareContractValidFrom = travelRights[0].startDateTime.toMillis();
  const fareContractValidTo = travelRights[0].endDateTime.toMillis();

  const fareContractValidityStatus = getValidityStatus(
    now,
    fareContractValidFrom,
    fareContractValidTo,
    fareContractState,
  );

  return (
    <Sections.Section withBottomPadding testID={testID}>
      <Sections.GenericItem>
        {fareContractValidityStatus !== 'valid' ? (
          <ValidityHeader
            now={now}
            status={fareContractValidityStatus}
            validFrom={fareContractValidFrom}
            validTo={fareContractValidTo}
            isInspectable={isInspectable}
          />
        ) : (
          <UsedAccessValidityHeader
            now={now}
            status={usedAccessValidityStatus}
            validFrom={usedAccessValidFrom}
            validTo={usedAccessValidTo}
            isInspectable={isInspectable}
          />
        )}
        <View style={styles.container}>
          <SectionSeparator />
        </View>
        <TicketInfo
          travelRights={travelRights}
          status={fareContractValidityStatus}
          isInspectable={isInspectable}
          omitUserProfileCount={true}
          testID={testID}
        />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <CarnetFooter
          active={usedAccessValidityStatus === 'valid'}
          maximumNumberOfAccesses={maximumNumberOfAccesses}
          numberOfUsedAccesses={numberOfUsedAccesses}
        />
      </Sections.GenericItem>
    </Sections.Section>
  );
};

type LastUsedAccessState = {
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
};

function useLastUsedAccess(
  now: number,
  usedAccesses: CarnetTicketUsedAccess[],
): LastUsedAccessState {
  const lastUsedAccess = usedAccesses.slice(-1).pop();

  let status: UsedAccessStatus = 'inactive';
  let validFrom: number | undefined = undefined;
  let validTo: number | undefined = undefined;

  if (lastUsedAccess) {
    validFrom = lastUsedAccess.startDateTime.toMillis();
    validTo = lastUsedAccess.endDateTime.toMillis();
    status = getUsedAccessValidity(now, validFrom, validTo);
  }

  return {status, validFrom, validTo};
}

function getUsedAccessValidity(
  now: number,
  validFrom: number,
  validTo: number,
): UsedAccessStatus {
  if (now > validTo) return 'inactive';
  if (now < validFrom) return 'upcoming';
  return 'valid';
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
}));

export default CarnetTicketInfo;
