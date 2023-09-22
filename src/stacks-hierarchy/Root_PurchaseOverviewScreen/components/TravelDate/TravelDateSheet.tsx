import React, {forwardRef, useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {
  DateInputSectionItem,
  Section,
  TimeInputSectionItem,
} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ScreenHeaderTexts,
  TravelDateTexts,
  useTranslation,
} from '@atb/translations';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {
  dateWithReplacedTime,
  formatLocaleTime,
  formatToVerboseFullDate,
  isAfter,
} from '@atb/utils/date';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import SvgConfirm from '@atb/assets/svg/mono-icons/actions/Confirm';

type Props = {
  travelDate?: string;
  close: () => void;
  save: (dateString?: string) => void;
  maximumDate?: Date;
  showActivationDateWarning?: boolean;
  setShowActivationDateWarning: (x: boolean) => void;
};

export const TravelDateSheet = forwardRef<ScrollView, Props>(
  (
    {
      travelDate,
      close,
      save,
      maximumDate,
      showActivationDateWarning,
      setShowActivationDateWarning,
    },
    focusRef,
  ) => {
    const {t, language} = useTranslation();
    const styles = useStyles();

    const defaultDate = travelDate ?? new Date().toISOString();
    const [dateString, setDate] = useState(defaultDate);

    const onSetDate = (date: string) => {
      console.log('Attempting to set date: ', date);
      setDate(date);
      setShowActivationDateWarning(true);
      /*if (!maximumDate) setDate(date);
      else {
        console.log('Max date is', maximumDate);
        if (isAfter(date, maximumDate)) {
          console.log('Date is after limit');
          setShowActivationDateWarning(true);
          setDate(defaultDate);
        } else {
          console.log('Date is before limit');
          if (showActivationDateWarning) setShowActivationDateWarning(false);
          setDate(date);
        }
      }*/
    };

    const [timeString, setTime] = useState(() =>
      formatLocaleTime(defaultDate, language),
    );

    const onSave = () => {
      save(dateWithReplacedTime(dateString, timeString).toISOString());
      close();
    };
    const keyboardHeight = useKeyboardHeight();

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          title={t(TravelDateTexts.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
            testID: 'cancelButton',
          }}
          color="background_1"
          setFocusOnLoad={false}
        />

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          ref={focusRef}
          centerContent={true}
        >
          {maximumDate && (
            <MessageBox
              type="info"
              style={styles.messageBox}
              subtle
              message={t(
                TravelDateTexts.latestActivationDate.warning(
                  formatToVerboseFullDate(maximumDate, language),
                ),
              )}
            />
          )}

          <Section>
            <DateInputSectionItem
              value={dateString}
              onChange={onSetDate}
              maximumDate={maximumDate}
            />
            <TimeInputSectionItem value={timeString} onChange={setTime} />
          </Section>
          {showActivationDateWarning && (
            <MessageBox
              style={styles.dateWarningMessageBox}
              type={'warning'}
              message={t(
                TravelDateTexts.latestActivationDate
                  .selectedDateShouldBeEarlierWarning,
              )}
            />
          )}
        </ScrollView>
        <FullScreenFooter>
          <Button
            onPress={onSave}
            interactiveColor="interactive_0"
            text={t(TravelDateTexts.primaryButton)}
            style={[styles.saveButton, {marginBottom: keyboardHeight}]}
            testID="confirmTimeButton"
            rightIcon={{svg: SvgConfirm}}
            disabled={showActivationDateWarning}
          />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  contentContainer: {
    padding: theme.spacings.medium,
  },
  saveButton: {
    marginTop: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.large,
  },
  dateWarningMessageBox: {
    marginTop: theme.spacings.large,
  },
}));
