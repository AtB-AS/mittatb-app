import React from 'react';
import {View} from 'react-native';
import ThemeText from '../../../components/text';
import {useTranslation, dictionary} from '../../../translations';
import {formatToClock} from '../../../utils/date';

type TimeProps = {
  scheduledTime: string;
  expectedTime?: string;
  missingRealTime?: boolean;
};
const Time: React.FC<TimeProps> = ({
  scheduledTime,
  expectedTime,
  missingRealTime = false,
}) => {
  const scheduled = formatToClock(scheduledTime);
  const expected = expectedTime ? formatToClock(expectedTime) : '';
  const {t} = useTranslation();
  if (!missingRealTime && expected !== scheduled) {
    return (
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        <ThemeText>{expected}</ThemeText>
        <ThemeText
          type="label"
          color="faded"
          style={{textDecorationLine: 'line-through'}}
        >
          {scheduled}
        </ThemeText>
      </View>
    );
  }
  return (
    <ThemeText>
      {missingRealTime && (
        <ThemeText>{t(dictionary.missingRealTimePrefix)}</ThemeText>
      )}
      {scheduled}
    </ThemeText>
  );
};
export default Time;
