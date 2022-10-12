import * as Sections from '@atb/components/sections';
import {FareContractState, PreActivatedTravelRight} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import FareContractInfo from './FareContractInfo';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/FareContracts/utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';

type Props = {
  fareContractState: FareContractState;
  travelRights: PreActivatedTravelRight[];
  now: number;
  isInspectable: boolean;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

const PreActivatedFareContractInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  isInspectable,
  hideDetails,
  onPressDetails,
  testID,
}) => {
  const {t} = useTranslation();

  const firstTravelRight = travelRights[0];
  const {startDateTime, endDateTime} = firstTravelRight;
  const validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );

  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );
  return (
    <Sections.Section withBottomPadding testID={testID}>
      <Sections.GenericItem>
        <ValidityHeader
          status={validityStatus}
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
          fareProductType={preassignedFareProduct?.type}
        />
        <ValidityLine
          status={validityStatus}
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
        />

        <FareContractInfo
          travelRights={travelRights}
          status={validityStatus}
          isInspectable={isInspectable}
          testID={testID}
          fareProductType={preassignedFareProduct?.type}
        />
      </Sections.GenericItem>
      {!hideDetails && (
        <Sections.LinkItem
          text={t(
            validityStatus === 'valid' && isInspectable
              ? TicketingTexts.detailsLink.valid
              : TicketingTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
    </Sections.Section>
  );
};

export default PreActivatedFareContractInfo;
