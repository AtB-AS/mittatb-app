import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import {ScrollView, View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {DateInputItem, Section, TimeInputItem} from '@atb/components/sections';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {NearbyStackParams} from '..';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import {useState} from 'react';

type Props = {
  close: () => void;
  initialTime: string;
  setSearchTime: (timeString: string) => void;
};

export type DateTimePickerParams = {
  searchTime: string;
  callerRouteName: string;
  callerRouteParam: string;
};

export type DateTimeNavigationProp = NavigationProp<NearbyStackParams>;
export type DateTimeRouteProp = RouteProp<NearbyStackParams, 'DateTimePicker'>;

const DepartureTimePicker = forwardRef<ScrollView, Props>(
  ({close, initialTime, setSearchTime}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    const [dateString, setDate] = useState<string>(initialTime);
    const [timeString, setTime] = useState<string>(() =>
      formatLocaleTime(initialTime, language),
    );

    const OnSelect = () => {
      const calculatedTime = dateWithReplacedTime(
        dateString,
        timeString,
      ).toISOString();
      setSearchTime(calculatedTime);
      close();
    };

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          title={dateString + timeString}
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
            <DateInputItem value={dateString} onChange={setDate} />
            <TimeInputItem value={timeString} onChange={setTime} />
          </Section>

          <Button onPress={OnSelect} color="primary_2" text={'todo'} />
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
