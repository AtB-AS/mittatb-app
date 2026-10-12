import React from 'react';
import {View} from 'react-native';
import {
  AnyMode,
  AnySubMode,
  TransportationIconBox,
} from '@atb/components/icon-box';
import {ThemeText} from '@atb/components/text';
import {shadows} from '@atb/modules/map';
import {StyleSheet} from '@atb/theme';

type Props = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  lineNumber?: string;
  destination?: string;
};

export const FollowedVehicleCard = ({
  mode,
  subMode,
  lineNumber,
  destination,
}: Props) => {
  const styles = useStyles();

  if (!lineNumber && !destination) return null;

  return (
    <View style={styles.card}>
      <TransportationIconBox
        mode={mode}
        subMode={subMode}
        lineNumber={lineNumber}
        spacious
        rounded
      />
      {destination && (
        <ThemeText style={styles.destination}>{destination}</ThemeText>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
    padding: theme.spacing.large,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.color.background.neutral[0].background,
    ...shadows,
  },
  destination: {
    flex: 1,
  },
}));
