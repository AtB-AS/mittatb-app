import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {
  NearbyTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {DateInputItem, Section, TimeInputItem} from '@atb/components/sections';
import {NavigationProp} from '@react-navigation/native';
import {NearbyStackParams} from '.';
import {
  dateWithReplacedTime,
  formatLocaleTime,
  isInThePast,
} from '@atb/utils/date';
import {Confirm} from '@atb/assets/svg/icons/actions';
import useKeyboardHeight from '@atb/utils/use-keyboard-height';
import {SearchTime} from './types';

type Props = {
  close: () => void;
  initialTime: SearchTime;
  setSearchTime: (time: SearchTime) => void;
  allowTimeInPast?: boolean;
};

export type DateTimePickerParams = {
  searchTime: string;
  callerRouteName: string;
  callerRouteParam: string;
};

export type DateTimeNavigationProp = NavigationProp<NearbyStackParams>;

const DepartureTimeSheet = forwardRef<ScrollView, Props>(
  ({close, initialTime, setSearchTime, allowTimeInPast = true}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    const [date, setDate] = useState(initialTime.date);
    const [time, setTime] = useState(
      formatLocaleTime(initialTime.date, language),
    );

    const onSelect = () => {
      const calculatedTime = dateWithReplacedTime(date, time).toISOString();
      if (isInThePast(calculatedTime) && !allowTimeInPast) {
        setSearchTime({option: 'now', date: new Date().toISOString()});
      } else {
        setSearchTime({option: 'departure', date: calculatedTime});
      }
      close();
    };

    const keyboardHeight = useKeyboardHeight();
    const selectedTimeIsInPast = isInThePast(dateWithReplacedTime(date, time));

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          title={t(NearbyTexts.dateInput.header)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
          }}
          color={'background_2'}
          setFocusOnLoad={false}
        />

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={{paddingBottom: keyboardHeight}}
          ref={focusRef}
        >
          <Section withBottomPadding>
            <DateInputItem value={date} onChange={setDate} />
            <TimeInputItem value={time} onChange={setTime} />
          </Section>

          <Button
            onPress={onSelect}
            color="primary_2"
            text={t(NearbyTexts.dateInput.confirm)}
            icon={Confirm}
            accessibilityHint={
              !allowTimeInPast && selectedTimeIsInPast
                ? t(NearbyTexts.dateInput.a11yInPastHint)
                : undefined
            }
            iconPosition="right"
          />
        </ScrollView>

        <FullScreenFooter>
          <View></View>
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    contentContainer: {
      padding: theme.spacings.medium,
    },
  };
});

export default DepartureTimeSheet;
