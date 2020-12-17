import {TFunc} from '@leile/lobo-t';
import React from 'react';
import {View} from 'react-native';
import {QuayInfo} from '../../../api/departures/types';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {screenReaderPause} from '../../../components/accessible-text';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import SituationMessages from '../../../situations';
import {StyleSheet} from '../../../theme';
import {
  dictionary,
  Language,
  NearbyTexts,
  useTranslation,
} from '../../../translations';

export type QuayHeaderItemProps = SectionItem<{
  quay: QuayInfo;
  distance?: number;
}>;
export default function QuayHeaderItem({
  quay,
  distance,
  ...props
}: QuayHeaderItemProps) {
  const styles = useItemStyles();
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const {t} = useTranslation();

  const accessibilityLabel = quay.publicCode
    ? t(
        NearbyTexts.results.quayResult.platformHeader.accessibilityLabel(
          quay.name,
          quay.publicCode,
        ),
      )
    : t(
        NearbyTexts.results.quayResult.platformHeader.accessibilityLabelNoPublicCode(
          quay.name,
        ),
      );

  const title = !quay.publicCode
    ? quay.name
    : `${quay.name} ${quay.publicCode}`;

  return (
    <View style={topContainer}>
      <View
        style={[sectionStyle.spaceBetween, contentContainer]}
        accessible
        accessibilityLabel={accessibilityLabel + screenReaderPause}
        accessibilityRole="header"
      >
        <ThemeText>{title}</ThemeText>
        <Distance distance={distance} />
      </View>

      <SituationMessages
        mode="icon"
        situations={quay.situations}
        containerStyle={styles.situations}
      />
    </View>
  );
}

type DistanceProps = {
  distance?: number;
};
function Distance({distance}: DistanceProps) {
  const styles = useItemStyles();
  const {t} = useTranslation();
  if (distance == null) {
    return null;
  }
  const humanized = humanizeDistance(distance, t);
  const label = t(
    NearbyTexts.results.quayResult.platformHeader.distance.label(humanized),
  );

  return (
    <View style={styles.itemStyle} accessible accessibilityLabel={label}>
      <ThemeText>{humanizeDistance(distance, t)}</ThemeText>
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
  situations: {
    marginTop: theme.spacings.medium,
  },
  itemStyle: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: theme.spacings.medium,
  },
}));
