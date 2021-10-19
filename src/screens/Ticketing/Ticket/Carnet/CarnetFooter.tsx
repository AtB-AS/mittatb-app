import React from 'react';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';

type Props = {
  active: boolean;
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

const CarnetFooter: React.FC<Props> = ({
  active,
  maximumNumberOfAccesses,
  numberOfUsedAccesses,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <View>
        <ThemeText type="body__secondary">
          {maximumNumberOfAccesses - numberOfUsedAccesses} klipp gjenstår
        </ThemeText>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 12,
        }}
      >
        {Array(maximumNumberOfAccesses)
          .fill(true)
          .map((_, idx) => idx < numberOfUsedAccesses)
          .reverse()
          .map((isUnused, idx) => (
            <View key={idx} style={styles.dotContainer}>
              <View
                style={[styles.dot, isUnused ? styles.dot__unused : undefined]}
              />
            </View>
          ))}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  dotContainer: {
    backgroundColor: theme.colors.secondary_1.backgroundColor,
    borderRadius: 20,
    padding: 2,
    margin: 2,
  },
  dot: {
    borderRadius: 20,
    width: 14,
    height: 14,
  },
  dot__unused: {
    backgroundColor: theme.colors.secondary_1.color,
  },
}));

export default CarnetFooter;
