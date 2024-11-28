import React, {RefObject, useRef} from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  formatToShortDateTimeWithoutYear,
  formatToVerboseDateTime,
} from '@atb/utils/date';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {TravelDateSheet} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/TravelDate/TravelDateSheet';
import {RadioSegments} from '@atb/components/radio';
import {TimeSelectionMode} from '@atb/configuration';
import {ContentHeading} from '@atb/components/heading';

type StartTimeSelectionProps = {
  color: InteractiveColor;
  setTravelDate: (date?: string) => void;
  validFromTime?: string;
  travelDate?: string;
  selectionMode: TimeSelectionMode;
  style?: StyleProp<ViewStyle>;
};

export function StartTimeSelection({
  color,
  setTravelDate,
  validFromTime,
  travelDate,
  selectionMode,
  style,
}: StartTimeSelectionProps) {
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const openTravelDateSheet = () => {
    openBottomSheet(
      () => <TravelDateSheet save={setTravelDate} travelDate={travelDate} />,
      onCloseFocusRef,
    );
  };

  const subtext = validFromTime
    ? formatToShortDateTimeWithoutYear(validFromTime, language)
    : undefined;
  const accessibilityLabel = validFromTime
    ? t(PurchaseOverviewTexts.startTime.later) +
      ', ' +
      formatToVerboseDateTime(validFromTime, language)
    : undefined;

  if (selectionMode === 'none') {
    return <></>;
  }

  return (
    <View style={style}>
      <ContentHeading text={t(PurchaseOverviewTexts.startTime.title)} />
      <RadioSegments
        color={color}
        activeIndex={!!validFromTime ? 1 : 0}
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
