import sortBy from 'lodash.sortby';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {QuayGroup} from '../../../api/departures/types';
import {Section} from '../../../components/sections';
import {useTheme} from '../../../theme';
import {NearbyTexts, useTranslation} from '../../../translations';
import {hasNoGroupsWithDepartures, isValidDeparture} from '../utils';
import LineItem from './line';
import MoreItem from './more';
import QuayHeaderItem from './quay-header';

const LIMIT_SIZE = 5;

type QuaySectionProps = {
  quayGroup: QuayGroup;
  distance?: number;
  lastUpdated?: Date;
  hidden?: Date;
};

const QuaySection = React.memo(function QuaySection({
  quayGroup,
  distance,
  lastUpdated,
}: QuaySectionProps) {
  const [limit, setLimit] = useState(LIMIT_SIZE);
  const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    setLimit(LIMIT_SIZE);
  }, [quayGroup.quay.id]);

  const hasMoreItems = quayGroup.group.length > limit;

  const sorted = useMemo(() => sortAndLimit(quayGroup, limit), [
    quayGroup,
    limit,
    lastUpdated,
  ]);

  if (!sorted) {
    return null;
  }

  return (
    <Fragment>
      <Section>
        <QuayHeaderItem quay={quayGroup.quay} distance={distance} />

        {sorted.map((group) => (
          <LineItem
            group={group}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
          />
        ))}
        {hasMoreItems && (
          <MoreItem
            onPress={() => setLimit(limit + LIMIT_SIZE)}
            text={t(NearbyTexts.results.quayResult.showMoreToggler.text)}
          />
        )}
      </Section>
      <View style={{marginBottom: theme.spacings.medium}} />
    </Fragment>
  );
});
export default QuaySection;

function sortAndLimit(quayGroup: QuayGroup, limit: number) {
  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }
  const sorted = sortBy(
    quayGroup.group,
    (v) => v.departures.find(isValidDeparture)?.time,
  ).slice(0, limit);
  return sorted;
}
