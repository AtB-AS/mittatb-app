import React, {useState} from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  DateInputSectionItem,
  Section,
  TimeInputSectionItem,
} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {TravelDateTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import SvgConfirm from '@atb/assets/svg/mono-icons/actions/Confirm';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/purchase-selection';

type Props = {
  selection: PurchaseSelectionType;
  onSave: (selection: PurchaseSelectionType) => void;
};

export const TravelDateSheet = ({selection, onSave}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const defaultDate = selection.travelDate ?? new Date().toISOString();
  const [dateString, setDate] = useState(defaultDate);

  const [timeString, setTime] = useState(() =>
    formatLocaleTime(defaultDate, language),
  );

  const {close} = useBottomSheetContext();
  const onSavePress = () => {
    const travelDate = dateWithReplacedTime(
      dateString,
      timeString,
    ).toISOString();
    const newSelection = selectionBuilder
      .fromSelection(selection)
      .date(travelDate)
      .build();
    onSave(newSelection);
    close();
  };
  const keyboardHeight = useKeyboardHeight();

  return (
    <BottomSheetContainer title={t(TravelDateTexts.header.title)}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        centerContent={true}
      >
        <Section>
          <DateInputSectionItem value={dateString} onChange={setDate} />
          <TimeInputSectionItem value={timeString} onChange={setTime} />
        </Section>
      </ScrollView>
      <FullScreenFooter>
        <Button
          expanded={true}
          onPress={onSavePress}
          interactiveColor={theme.color.interactive[0]}
          text={t(TravelDateTexts.primaryButton)}
          style={[styles.saveButton, {marginBottom: keyboardHeight}]}
          testID="confirmTimeButton"
          rightIcon={{svg: SvgConfirm}}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  contentContainer: {
    padding: theme.spacing.medium,
  },
  saveButton: {
    marginTop: theme.spacing.medium,
  },
  messageBox: {
    marginBottom: theme.spacing.large,
  },
  dateWarningMessageBox: {
    marginTop: theme.spacing.large,
  },
}));
