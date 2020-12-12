import {TFunc} from '@leile/lobo-t';
import haversineDistance from 'haversine-distance';
import React from 'react';
import {View} from 'react-native';
import {QuayInfo} from '../../../api/departures/types';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {Location} from '../../../favorites/types';
import {StyleSheet} from '../../../theme';
import {dictionary, Language, useTranslation} from '../../../translations';

export type QuayHeaderItemProps = SectionItem<{
  quay: QuayInfo;
  currentLocation?: Location;
}>;
export default function QuayHeaderItem({
  quay,
  currentLocation,
  ...props
}: QuayHeaderItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  return (
    <View style={[topContainer, sectionStyle.spaceBetween, contentContainer]}>
      <ThemeText>{quay.name}</ThemeText>
      <Distance
        lat={quay.latitude}
        lng={quay.longitude}
        currentLocation={currentLocation}
      />
    </View>
  );
}

type DistanceProps = {
  lat?: number;
  lng?: number;
  currentLocation?: Location;
};
function Distance({lat, lng, currentLocation}: DistanceProps) {
  const styles = useItemStyles();
  const {t} = useTranslation();
  if (!lat || !lng || !currentLocation) {
    return null;
  }

  return (
    <View style={styles.itemStyle}>
      <ThemeText>
        {humanizeDistance(
          haversineDistance(currentLocation.coordinates, {lat, lng}),
          t,
        )}
      </ThemeText>
      <ThemeIcon svg={WalkingPerson} style={styles.icon} />
    </View>
  );
}
const humanizeDistance = (meters: number, t: TFunc<typeof Language>) => {
  if (meters >= 1000) {
    return `${Math.round(meters / 1000)}${t(dictionary.distance.km)}`;
  }
  return `${Math.round(meters)}${t(dictionary.distance.m)}`;
};
const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  itemStyle: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: theme.spacings.medium,
  },
}));
