import React from 'react';
import {View} from 'react-native';
import {Situation} from '../../sdk';
import SituationMessages, {
  getSituationDiff,
  hasSituations,
  SituationWarningIcon,
} from '../../situations';
import {StyleSheet} from '../../theme';

export default function SituationRow({
  situations,
  parentSituations = [],
}: {
  situations: Situation[];
  parentSituations?: Situation[];
}) {
  const styles = useStopsStyle();
  const uniqueFromParent = getSituationDiff(situations, parentSituations);
  if (!hasSituations(uniqueFromParent)) {
    return null;
  }

  return (
    <View style={styles.situationRowContainer}>
      <View style={styles.situationRowIcon}>
        <SituationWarningIcon situations={uniqueFromParent} />
      </View>
      <SituationMessages mode="no-icon" situations={uniqueFromParent} />
    </View>
  );
}

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  situationRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  situationRowIcon: {
    width: 66,
    alignItems: 'flex-end',
    marginRight: 42,
    justifyContent: 'flex-end',
  },
}));
