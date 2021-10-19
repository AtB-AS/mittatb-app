import React from 'react';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';

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
  const {theme} = useTheme();
  const styles = useStyles();
  const activeIndex = active
    ? maximumNumberOfAccesses - numberOfUsedAccesses
    : undefined;

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <View>
        <ThemeText type="body__secondary">
          {maximumNumberOfAccesses - numberOfUsedAccesses} klipp gjenstår
        </ThemeText>
      </View>
      <View style={styles.container}>
        {Array(maximumNumberOfAccesses)
          .fill(true)
          .map((_, idx) => idx < numberOfUsedAccesses)
          .reverse()
          .map((isUnused, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                isUnused && idx !== activeIndex
                  ? styles.dot__unused
                  : undefined,
              ]}
            >
              {idx === activeIndex && (
                <View style={styles.dotFill__active}></View>
              )}
            </View>
          ))}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacings.medium,
  },
  dot: {
    backgroundColor: theme.colors.secondary_1.backgroundColor,
    borderRadius: 20,
    borderColor: theme.colors.secondary_1.backgroundColor,
    borderWidth: 2,
    width: 16,
    height: 16,
  },
  dot__unused: {
    backgroundColor: theme.colors.secondary_1.color,
  },
  dotFill__active: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    height: '100%',
    width: '50%',
    marginLeft: '50%',
    backgroundColor: theme.colors.secondary_1.color,
  },
}));

export default CarnetFooter;
