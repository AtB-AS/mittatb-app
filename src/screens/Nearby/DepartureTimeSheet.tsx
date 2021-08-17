import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {
  NearbyTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {ScrollView, View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {DateInputItem, Section, TimeInputItem} from '@atb/components/sections';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {NearbyStackParams} from '.';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import {SearchTime} from '@atb/screens/Nearby/Nearby';
import {Confirm} from '@atb/assets/svg/icons/actions';

type Props = {
  close: () => void;
  initialTime: SearchTime;
  setSearchTime: (time: SearchTime) => void;
};

export type DateTimePickerParams = {
  searchTime: string;
  callerRouteName: string;
  callerRouteParam: string;
};

export type DateTimeNavigationProp = NavigationProp<NearbyStackParams>;

const DepartureTimePicker = forwardRef<ScrollView, Props>(
  ({close, initialTime, setSearchTime}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    let date = initialTime.date;
    let time = formatLocaleTime(initialTime.date, language);

    const setDate = (d: string) => (date = d);
    const setTime = (t: string) => (time = t);

    const OnSelect = () => {
      const calculatedTime = dateWithReplacedTime(date, time).toISOString();
      setSearchTime({option: 'departure', date: calculatedTime});
      close();
    };

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
          ref={focusRef}
        >
          <Section withBottomPadding>
            <DateInputItem value={date} onChange={setDate} />
            <TimeInputItem value={time} onChange={setTime} />
          </Section>

          <Button
            onPress={OnSelect}
            color="primary_2"
            text={t(NearbyTexts.dateInput.confirm)}
            icon={Confirm}
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

export default DepartureTimePicker;
