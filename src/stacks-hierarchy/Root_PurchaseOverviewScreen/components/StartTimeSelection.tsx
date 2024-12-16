import React, {RefObject, useRef} from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  formatToShortDateTimeWithoutYear,
  formatToVerboseDateTime,
} from '@atb/utils/date';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {TravelDateSheet} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/TravelDate/TravelDateSheet';
import {RadioSegments} from '@atb/components/radio';
import {ContentHeading} from '@atb/components/heading';
import type {PurchaseSelectionType} from '@atb/purchase-selection';

type StartTimeSelectionProps = {
  selection: PurchaseSelectionType;
  color: InteractiveColor;
  setTravelDate: (date?: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function StartTimeSelection({
  selection,
  color,
  setTravelDate,
  style,
}: StartTimeSelectionProps) {
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const openTravelDateSheet = () => {
    openBottomSheet(
      () => <TravelDateSheet save={setTravelDate} selection={selection} />,
      onCloseFocusRef,
    );
  };

  const subtext = selection.travelDate
    ? formatToShortDateTimeWithoutYear(selection.travelDate, language)
    : undefined;
  const accessibilityLabel = selection.travelDate
    ? t(PurchaseOverviewTexts.startTime.later) +
      ', ' +
      formatToVerboseDateTime(selection.travelDate, language)
    : undefined;

  if (
    selection.fareProductTypeConfig.configuration.timeSelectionMode === 'none'
  ) {
    return null;
  }

  return (
    <View style={style}>
      <ContentHeading text={t(PurchaseOverviewTexts.startTime.title)} />
      <RadioSegments
        color={color}
        activeIndex={!!selection.travelDate ? 1 : 0}
        options={[
          {
            text: t(PurchaseOverviewTexts.startTime.now),
            onPress: () => setTravelDate(undefined),
            accessibilityHint: t(PurchaseOverviewTexts.startTime.a11yNowHint),
          },
          {
            text: t(PurchaseOverviewTexts.startTime.later),
            subtext,
            onPress: openTravelDateSheet,
            accessibilityLabel,
            accessibilityHint: t(PurchaseOverviewTexts.startTime.a11yLaterHint),
            ref: onCloseFocusRef,
          },
        ]}
      />
    </View>
  );
}
