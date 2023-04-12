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
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import SvgConfirm from '@atb/assets/svg/mono-icons/actions/Confirm';

type Props = {
  travelDate?: string;
  close: () => void;
  save: (dateString?: string) => void;
};

export const TravelDateSheet = forwardRef<ScrollView, Props>(
  ({travelDate, close, save}, focusRef) => {
    const {t, language} = useTranslation();
    const styles = useStyles();

    const defaultDate = travelDate ?? new Date().toISOString();
    const [dateString, setDate] = useState(defaultDate);
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
          <Section>
            <DateInputSectionItem value={dateString} onChange={setDate} />
            <TimeInputSectionItem value={timeString} onChange={setTime} />
          </Section>
        </ScrollView>
        <FullScreenFooter>
          <Button
            onPress={onSave}
            interactiveColor="interactive_0"
            text={t(TravelDateTexts.primaryButton)}
            style={[styles.saveButton, {marginBottom: keyboardHeight}]}
            testID="confirmTimeButton"
            rightIcon={{svg: SvgConfirm}}
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
}));
