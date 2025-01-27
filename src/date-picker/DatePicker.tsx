import React from 'react';
import {StyleSheet} from '@atb/theme';
import {getTimeZoneOffsetInMinutes, parseDate} from '@atb/utils/date';
import {default as RNDatePicker} from 'react-native-date-picker';
import {type StyleProp, View, type ViewStyle} from 'react-native';
import {useLocaleContext} from '@atb/LocaleProvider';

type Props = {
  date: string;
  onDateChange: (date: string) => void;
  style?: StyleProp<ViewStyle>;
};

export const DatePicker = ({date, onDateChange, style}: Props) => {
  const styles = useStyles();
  const locale = useLocaleContext();

  return (
    <View style={[styles.container, style]}>
      <RNDatePicker
        date={parseDate(date)}
        onDateChange={(date) => onDateChange(date.toISOString())}
        mode="datetime"
        locale={locale.localeString}
        // Applies timezone offset from UTC to enforce CET timezone on date picker
        timeZoneOffsetInMinutes={getTimeZoneOffsetInMinutes()}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  container: {alignItems: 'center'},
}));
