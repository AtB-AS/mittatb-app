import React from 'react';
import {View} from 'react-native';
import {Wait} from '../../../assets/svg/icons/transportation';
import {Info} from '../../../assets/svg/situations';
import ThemeText from '../../../components/text';
import {TinyMessageBox} from '../../../message-box';
import {StyleSheet} from '../../../theme';
import {secondsToDuration} from '../../../utils/date';
import {transportationMapLineColor} from '../../../utils/transportation-color';
import {timeIsShort} from '../Details/utils';
import TripLegDecoration from './TripLegDecoration';
import TripRow from './TripRow';

export type WaitDetails = {
  waitAfter: boolean;
  waitSeconds: number;
};

const WaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const waitTime = secondsToDuration(wait.waitSeconds);
  const shortWait = timeIsShort(wait.waitSeconds);
  return (
    <View style={style.section}>
      <TripLegDecoration
        color={transportationMapLineColor()}
        hasStart={false}
        hasEnd={false}
      ></TripLegDecoration>
      {shortWait && (
        <TripRow rowLabel={<Info />}>
          <TinyMessageBox type="info" message="Kort byttetid" />
        </TripRow>
      )}
      <TripRow rowLabel={<Wait />}>
        <ThemeText type="lead" color="faded">
          Vent {waitTime}
        </ThemeText>
      </TripRow>
    </View>
  );
};
const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    flex: 1,
    marginVertical: theme.spacings.medium,
  },
}));
export default WaitSection;
