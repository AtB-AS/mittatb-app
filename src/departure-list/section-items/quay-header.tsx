import React from 'react';
import {View} from 'react-native';
import {QuayInfo} from '@atb/api/departures/types';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {screenReaderPause} from '@atb/components/text';
import {
  SectionItemProps,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {isSituationValidAtDate, SituationMessageBox} from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {useHumanizeDistance} from '@atb/utils/location';

export type QuayHeaderItemProps = SectionItemProps<{
  quay: QuayInfo;
  distance?: number;
  searchDate: string;
}>;
export function QuayHeaderItem({
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
    ? t(
        DeparturesTexts.results.quayResult.platformHeader.distance.label(
          humanized,
        ),
      )
    : '';

  const accessibilityLabel = quay.publicCode
    ? t(
        DeparturesTexts.results.quayResult.platformHeader.accessibilityLabel(
          quay.name,
          quay.publicCode,
        ),
      )
    : t(
        DeparturesTexts.results.quayResult.platformHeader.accessibilityLabelNoPublicCode(
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
        <ThemeText typography="body__primary--bold" testID={testID + 'Title'}>
          {title}
        </ThemeText>
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
    marginTop: theme.spacing.medium,
  },
  itemStyle: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: theme.spacing.medium,
  },
}));
