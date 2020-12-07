import React from 'react';
import {Leg} from '../../../sdk';
import {View, ViewProps} from 'react-native';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {getLineName} from '../../../utils/transportation-names';
import TransportationIcon from '../../../components/transportation-icon';
import {transportationMapLineColor} from '../../../utils/transportation-color';

const TripSection: React.FC<Leg> = (leg) => {
  const style = useSectionStyles();
  const isLegMode = leg.mode === 'foot';
  const legColor = transportationMapLineColor(leg.mode, leg.line?.publicCode);

  return (
    <View style={style.tripSection}>
      <TripSectionLine color={legColor} hasStart={true} hasEnd={true} />
      <TripRow time={leg.expectedStartTime}>
        <ThemeText>{leg.fromPlace.name}</ThemeText>
        {leg.fromPlace.quay && (
          <ThemeText type="lead" color="faded">
            {leg.fromPlace.name} {leg.fromPlace.quay.publicCode}
          </ThemeText>
        )}
      </TripRow>
      {isLegMode ? (
        <TripRow icon={<WalkingPerson />}>
          <ThemeText>Gå i {secondsToDuration(leg.duration ?? 0)}</ThemeText>
        </TripRow>
      ) : (
        <TripRow
          icon={
            <TransportationIcon
              mode={leg.mode}
              publicCode={leg.line?.publicCode}
            />
          }
        >
          <ThemeText style={style.legLineName}>{getLineName(leg)}</ThemeText>
        </TripRow>
      )}
      {!isLegMode && (
        <TripRow time={leg.expectedEndTime}>
          <ThemeText>{leg.toPlace.name}</ThemeText>
        </TripRow>
      )}
    </View>
  );
};
type LineProps = {
  hasStart: boolean;
  hasEnd: boolean;
  color: string;
};
const TripSectionLine: React.FC<LineProps> = ({color, hasStart, hasEnd}) => {
  const style = useSectionStyles();
  const colorStyle = {backgroundColor: color};
  return (
    <View style={[style.decoration, colorStyle]}>
      <View
        style={[style.decorationMarker, style.decorationStart, colorStyle]}
      ></View>
      <View
        style={[style.decorationMarker, style.decorationEnd, colorStyle]}
      ></View>
    </View>
  );
};
type TripRowProps = {
  time?: string;
  icon?: JSX.Element;
} & ViewProps;
const TripRow: React.FC<TripRowProps> = ({time, icon, children}) => {
  const style = useSectionStyles();

  const leftContent = (
    <>
      {time && <ThemeText>{formatToClock(time)}</ThemeText>}
      {icon}
    </>
  );
  return (
    <View style={style.tripRow}>
      <View style={style.rowLeft}>{leftContent}</View>
      <View style={style.decorationPlaceholder}></View>
      <View style={style.rowRight}>{children}</View>
    </View>
  );
};
const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginVertical: theme.spacings.medium,
  },
  tripRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacings.small,
  },
  rowLeft: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rowRight: {
    flex: 5,
  },
  legLineName: {
    fontWeight: 'bold',
  },
  decorationPlaceholder: {
    width: theme.spacings.large,
  },
  decoration: {
    position: 'absolute',
    height: '100%',
    left: 80 + theme.spacings.large / 2,
    width: 4,
    backgroundColor: theme.background.accent,
  },
  decorationMarker: {
    position: 'absolute',
    width: 12,
    left: -4,
    height: 4,
    backgroundColor: theme.background.accent,
  },
  decorationStart: {
    top: 0,
  },
  decorationEnd: {
    bottom: 0,
  },
}));
export default TripSection;
