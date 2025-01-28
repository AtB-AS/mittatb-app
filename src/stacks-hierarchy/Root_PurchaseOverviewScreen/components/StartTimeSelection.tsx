import React, {RefObject, useRef} from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {formatToLongDateTime, isInThePast} from '@atb/utils/date';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {ContentHeading} from '@atb/components/heading';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/purchase-selection';
import {DatePickerSheet} from '@atb/date-picker';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';

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
  const styles = useStyles();

  const {openDatePickerSheet, onCloseFocusRef} = useDatePickerSheet(
    selection,
    setSelection,
  );

  if (
    selection.fareProductTypeConfig.configuration.timeSelectionMode === 'none'
  ) {
    return null;
  }

  return (
    <View style={style}>
      <ContentHeading text={t(PurchaseOverviewTexts.startTime.title)} />
      <GenericClickableSectionItem
        ref={onCloseFocusRef}
        onPress={openDatePickerSheet}
        accessibilityLabel={t(
          PurchaseOverviewTexts.startTime.a11yLabel(
            selection.travelDate &&
              formatToLongDateTime(selection.travelDate, language),
          ),
        )}
        accessibilityHint={t(PurchaseOverviewTexts.startTime.a11yLaterHint)}
        testID="selectZonesButton"
      >
        <View style={styles.sectionContent}>
          <ThemeText typography="body__primary--bold">
            {selection.travelDate
              ? t(
                  PurchaseOverviewTexts.startTime.laterTime(
                    formatToLongDateTime(selection.travelDate, language),
                  ),
                )
              : t(PurchaseOverviewTexts.startTime.now)}
          </ThemeText>
          <ThemeIcon svg={Edit} size="normal" />
        </View>
      </GenericClickableSectionItem>
    </View>
  );
}

const useDatePickerSheet = (
  selection: PurchaseSelectionType,
  setSelection: (s: PurchaseSelectionType) => void,
) => {
  const {t} = useTranslation();
  const selectionBuilder = usePurchaseSelectionBuilder();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {open: openBottomSheet} = useBottomSheetContext();
  const openDatePickerSheet = () => {
    openBottomSheet(
      () => (
        <DatePickerSheet
          options={[
            {
              option: 'now',
              text: t(PurchaseOverviewTexts.startTime.now),
              selected: !selection.travelDate,
            },
            {
              option: 'later',
              text: t(PurchaseOverviewTexts.startTime.laterOption),
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
          initialDate={selection.travelDate}
        />
      ),
      onCloseFocusRef,
    );
  };

  return {openDatePickerSheet, onCloseFocusRef};
};

const useStyles = StyleSheet.createThemeHook(() => ({
  sectionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
