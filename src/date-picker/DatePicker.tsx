import React from 'react';
import {StyleSheet} from '@atb/theme';
import {parseDate} from '@atb/utils/date';
import {default as RNDatePicker} from 'react-native-date-picker';
import {type StyleProp, View, type ViewStyle} from 'react-native';

type Props = {
  date: string;
  onDateChange: (date: string) => void;
  style?: StyleProp<ViewStyle>;
};

export const DatePicker = ({date, onDateChange, style}: Props) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      <RNDatePicker
        date={parseDate(date)}
        onDateChange={(date) => onDateChange(date.toISOString())}
        mode="datetime"
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  container: {alignItems: 'center'},
}));
