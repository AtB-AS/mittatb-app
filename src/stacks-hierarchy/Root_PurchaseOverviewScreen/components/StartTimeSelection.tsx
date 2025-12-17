import React, {useRef} from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {formatToLongDateTime, isInThePast} from '@atb/utils/date';
import {ContentHeading} from '@atb/components/heading';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {DatePickerSheet} from '@atb/components/date-selection';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

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
            testID="startTimeButton"
          >
            <View style={styles.sectionContent}>
              <ThemeText typography="body__m__strong">
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
        </Section>
      </View>
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
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  sectionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
