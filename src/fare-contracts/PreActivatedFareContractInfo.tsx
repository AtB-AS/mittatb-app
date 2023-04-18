import * as Sections from '@atb/components/sections';
import {FareContractState, PreActivatedTravelRight} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {FareContractInfo} from './FareContractInfo';
import {ValidityHeader} from './ValidityHeader';
import {ValidityLine} from './ValidityLine';
import {getValidityStatus} from '@atb/fare-contracts/utils';
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

export const PreActivatedFareContractInfo: React.FC<Props> = ({
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
      <Sections.GenericSectionItem>
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
      </Sections.GenericSectionItem>
      {!hideDetails && (
        <Sections.LinkSectionItem
          text={t(
            validityStatus === 'valid' && isInspectable
              ? FareContractTexts.detailsLink.valid
              : FareContractTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
    </Sections.Section>
  );
};
