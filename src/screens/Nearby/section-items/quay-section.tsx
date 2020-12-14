import React, {Fragment, useEffect, useState} from 'react';
import {View} from 'react-native';
import {QuayGroup} from '../../../api/departures/types';
import * as Section from '../../../components/sections';
import {useTheme} from '../../../theme';
import {NearbyTexts, useTranslation} from '../../../translations';
import {hasNoGroupsWithDepartures} from '../utils';
import LineItem from './line';
import MoreItem from './more';
import QuayHeaderItem from './quay-header';

const LIMIT_SIZE = 5;

export default function QuaySection({
  quayGroup,
  distance,
}: {
  quayGroup: QuayGroup;
  distance?: number;
}) {
  const [limit, setLimit] = useState(LIMIT_SIZE);
  const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    setLimit(LIMIT_SIZE);
  }, [quayGroup.quay.id]);

  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }

  return (
    <Fragment>
      <Section.Section>
        <QuayHeaderItem quay={quayGroup.quay} distance={distance} />

        {quayGroup.group.slice(0, limit).map((group) => (
          <LineItem
            group={group}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
          />
        ))}
        {quayGroup.group.length > limit && (
          <MoreItem
            onPress={() => setLimit(limit + LIMIT_SIZE)}
            text={t(NearbyTexts.results.quayResult.showMoreToggler.text)}
          />
        )}
      </Section.Section>
      <View style={{marginBottom: theme.spacings.medium}} />
    </Fragment>
  );
}
