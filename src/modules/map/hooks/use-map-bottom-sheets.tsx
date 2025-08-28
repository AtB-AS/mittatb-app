import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  isScooterV2,
  ScooterSheet,
  SelectShmoPaymentMethodSheet,
} from '@atb/modules/mobility';

import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {MapSelectionActionType} from '../types';
import {useEnterPaymentMethods} from './use-enter-payment-methods';

type MapBottomSheetsProps = {
  selectedMapItem: MapSelectionActionType | undefined;
  vehicleId: string | undefined;
  unSelectMapItem: () => void;
  bottomMargin: number;
};

export const MapBottomSheets = ({
  selectedMapItem,
  vehicleId,
  unSelectMapItem,
  bottomMargin,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const navigateToPaymentMethods = useEnterPaymentMethods();

  const analytics = useAnalyticsContext();
  const navigation = useNavigation<RootNavigationProps>();

  const onReportParkingViolation = useCallback(() => {
    unSelectMapItem();
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [analytics, navigation, unSelectMapItem]);

  console.log('yo');

  async function selectPaymentMethod() {
    setOpenPaymentType(true);
  }

  return (
    <>
      {selectedMapItem?.source === 'map-item' &&
        isScooterV2(selectedMapItem.feature) && (
          <ScooterSheet
            selectPaymentMethod={selectPaymentMethod}
            vehicleId={vehicleId ?? ''}
            onClose={unSelectMapItem}
            onReportParkingViolation={onReportParkingViolation}
            navigation={navigation}
            startOnboardingCallback={() => {
              navigation.navigate('Root_ShmoOnboardingScreen');
            }}
            bottomMargin={bottomMargin}
          />
        )}
      {openPaymentType && (
        <SelectShmoPaymentMethodSheet
          onSelect={() => {
            setOpenPaymentType(false);
          }}
          onClose={() => {
            setOpenPaymentType(false);
          }}
          onGoToPaymentPage={() => {
            setOpenPaymentType(false);
            navigateToPaymentMethods();
          }}
        />
      )}
    </>
  );
};
