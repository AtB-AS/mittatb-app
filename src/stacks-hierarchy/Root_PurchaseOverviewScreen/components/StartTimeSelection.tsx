import React, {useRef} from 'react';
import {
  dictionary,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {formatToLongDateTime, isInThePast} from '@atb/utils/date';
import {ContentHeading} from '@atb/components/heading';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {DatePickerSheet} from '@atb/components/date-selection';
import {EditActionSectionItem, Section} from '@atb/components/sections';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {Time} from '@atb/assets/svg/mono-icons/time';

type StartTimeSelectionProps = {
  selection: PurchaseSelectionType;
  setSelection: (s: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export function StartTimeSelection({
  selection,
  setSelection,
  style,
}: StartTimeSelectionProps) {
  const {t, language} = useTranslation();
  const selectionBuilder = usePurchaseSelectionBuilder();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<GorhomBottomSheetModal | null>(null);

  if (
    selection.fareProductTypeConfig.configuration.timeSelectionMode === 'none'
  ) {
    return null;
  }

  const openDatePickerSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <View style={style}>
        <ContentHeading text={t(PurchaseOverviewTexts.startTime.title)} />
        <Section>
          <EditActionSectionItem
            ref={onCloseFocusRef}
            leftIcon={Time}
            text={
              selection.travelDate
                ? formatToLongDateTime(selection.travelDate, language)
                : t(dictionary.date.units.now)
            }
            onPress={openDatePickerSheet}
            accessibilityHint={t(PurchaseOverviewTexts.startTime.a11yLaterHint)}
            testID="startTimeButton"
          />
        </Section>
      </View>
      <DatePickerSheet
        options={[
          {
            option: 'now',
            text: t(dictionary.date.units.now),
            selected: !selection.travelDate,
          },
          {
            option: 'later',
            text: t(dictionary.date.units.later),
            selected: !!selection.travelDate,
          },
        ]}
        onSave={(selectedOption) => {
          const newSelection = selectionBuilder
            .fromSelection(selection)
            .date(
              selectedOption.option === 'now' ||
                isInThePast(selectedOption.date)
                ? undefined
                : selectedOption.date,
            )
            .build();
          setSelection(newSelection);
        }}
        heading={t(PurchaseOverviewTexts.startTime.bottomSheetTitle)}
        initialDate={selection.travelDate}
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
}
