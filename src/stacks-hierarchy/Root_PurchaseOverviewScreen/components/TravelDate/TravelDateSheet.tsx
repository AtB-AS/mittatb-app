import React, {forwardRef, useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {
  DateInputSectionItem,
  Section,
  TimeInputSectionItem,
} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {TravelDateTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  dateWithReplacedTime,
  formatLocaleTime,
  formatToVerboseFullDate,
  isAfter,
} from '@atb/utils/date';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import SvgConfirm from '@atb/assets/svg/mono-icons/actions/Confirm';
import {MessageInfoText} from '@atb/components/message-info-text';

type Props = {
  travelDate?: string;
  close: () => void;
  save: (dateString?: string) => void;
  maximumDate?: Date;
  showActivationDateWarning?: boolean;
  setShowActivationDateWarning: (value: boolean) => void;
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
    const [
      replicatedShowActivationDateWarning,
      setReplicatedShowActivationDateWarning,
    ] = useState<boolean | undefined>(showActivationDateWarning);

    const setInternalAndExternalWarningState = (value: boolean) => {
      setShowActivationDateWarning(value);
      setReplicatedShowActivationDateWarning(value);
    };

    const onSetDate = (date: string) => {
      if (!maximumDate) setDate(date);
      else {
        if (isAfter(date, maximumDate)) {
          setInternalAndExternalWarningState(true);
        } else if (replicatedShowActivationDateWarning) {
          setInternalAndExternalWarningState(false);
        }

        setDate(date);
      }
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
      <BottomSheetContainer
        title={t(TravelDateTexts.header.title)}
        close={close}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          ref={focusRef}
          centerContent={true}
        >
          {maximumDate && (
            <MessageInfoText
              type="info"
              style={styles.messageBox}
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
          {replicatedShowActivationDateWarning && (
            <MessageInfoBox
              style={styles.dateWarningMessageBox}
              type="warning"
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
            disabled={replicatedShowActivationDateWarning}
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
