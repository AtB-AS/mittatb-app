import React from 'react';
import {View} from 'react-native';
import {QuayInfo} from '@atb/api/departures/types';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {screenReaderPause} from '@atb/components/accessible-text';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections/section-utils';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {isSituationValidAtDate, SituationMessageBox} from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import {useHumanizeDistance} from '@atb/utils/location';

export type QuayHeaderItemProps = SectionItem<{
  quay: QuayInfo;
  distance?: number;
  searchDate: string;
}>;
export default function QuayHeaderItem({
  quay,
  distance,
  searchDate,
  testID,
  ...props
}: QuayHeaderItemProps) {
  const styles = useItemStyles();
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const {t} = useTranslation();
  const humanized = useHumanizeDistance(distance);

  const label = humanized
    ? t(NearbyTexts.results.quayResult.platformHeader.distance.label(humanized))
    : '';

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

  const situations = quay.situations.filter(isSituationValidAtDate(searchDate));

  return (
    <View style={topContainer}>
      <View
        style={[sectionStyle.spaceBetween, contentContainer]}
        accessible
        accessibilityLabel={`${accessibilityLabel} ${label} ${screenReaderPause}`}
        accessibilityRole="header"
      >
        <ThemeText testID={testID + 'Title'}>{title}</ThemeText>
        <Distance distance={humanized} />
      </View>
      {situations.map((situation) => (
        <SituationMessageBox situation={situation} style={styles.situations} />
      ))}
    </View>
  );
}

type DistanceProps = {
  distance?: string;
};
function Distance({distance}: DistanceProps) {
  const styles = useItemStyles();
  if (!distance) {
    return null;
  }

  return (
    <View style={styles.itemStyle}>
      <ThemeText>{distance}</ThemeText>
      <ThemeIcon svg={Walk} style={styles.icon} />
    </View>
  );
}
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
