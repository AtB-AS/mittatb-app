import React, {forwardRef} from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {StyleProp, ViewStyle} from 'react-native';
import {FocusRefsType} from '@atb/utils/use-focus-refs';
import type {PurchaseSelectionType} from '@atb/purchase-selection';

type SelectionProps = {
  selection: PurchaseSelectionType;
  onSelect: (selection: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export const FromToSelection = forwardRef<FocusRefsType, SelectionProps>(
  ({selection, onSelect, style}: SelectionProps, ref) => {
    let selectionMode =
      selection.fareProductTypeConfig.configuration.zoneSelectionMode;
    if (selectionMode === 'none') {
      return null;
    }

    if (selectionMode === 'multiple-stop-harbor') {
      return (
        <HarborSelection
          selection={selection}
          onSelect={onSelect}
          style={style}
          ref={ref}
        />
      );
    }

    // Only support multiple/single zone in app for now. Stop place is built into selector.
    if (selectionMode == 'multiple-stop' || selectionMode == 'multiple-zone') {
      selectionMode = 'multiple';
    } else if (
      selectionMode == 'single-stop' ||
      selectionMode == 'single-zone'
    ) {
      selectionMode = 'single';
    }
    return (
      <ZonesSelection
        selection={selection}
        selectionMode={selectionMode}
        onSelect={onSelect}
        style={style}
        ref={ref}
      />
    );
  },
);
