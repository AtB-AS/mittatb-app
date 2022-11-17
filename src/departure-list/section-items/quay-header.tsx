import {TFunc} from '@leile/lobo-t';
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
import {SituationMessagesBox} from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  Language,
  NearbyTexts,
  useTranslation,
} from '@atb/translations';

export type QuayHeaderItemProps = SectionItem<{
  quay: QuayInfo;
  distance?: number;
}>;
export default function QuayHeaderItem({
  quay,
  distance,
  testID,
  ...props
}: QuayHeaderItemProps) {
  const styles = useItemStyles();
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const {t} = useTranslation();
  const humanized = distance ? humanizeDistance(distance, t) : undefined;

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

      <SituationMessagesBox
        mode="icon"
        situations={quay.situations}
        containerStyle={styles.situations}
      />
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
const humanizeDistance = (meters: number, t: TFunc<typeof Language>) => {
  if (meters >= 1000) {
    return `${Math.round(meters / 1000)} ${t(dictionary.distance.km)}`;
  }
  return `${Math.round(meters)} ${t(dictionary.distance.m)}`;
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
