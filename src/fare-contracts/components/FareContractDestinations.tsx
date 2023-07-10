import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';

import {ArrowUpLeft} from '@atb/assets/svg/mono-icons/navigation';

const DestinationIllustrationPart = ({
  color = 'red',
  isStart = false,
  isEnd = false,
}: {
  color: string;
  isStart?: boolean;
  isEnd?: boolean;
}) => {
  const stopIndicatorPart = (
    <View style={{width: 12, height: 4, backgroundColor: color}} />
  );
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 12,
        marginHorizontal: 4,
      }}
    >
      {isStart && stopIndicatorPart}
      <View style={{width: 4, height: 16, backgroundColor: color}} />
      {isEnd && stopIndicatorPart}
    </View>
  );
};

/*

TODO:

ArrowUpLeft should be ArrowUpDown

what about large text sizes?
screen reader / a11y?
accept color argument?
ensure bg color from theme?

*/

export function FareContractDestinations({
  startPlaceName,
  endPlaceName,
  showTwoWayIcon,
}: {
  startPlaceName?: string;
  endPlaceName?: string;
  showTwoWayIcon?: boolean;
}) {
  const {theme} = useTheme();
  const styles = useStyles();

  const color = theme.transport.transport_boat.primary.background;

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        <DestinationIllustrationPart color={color} isStart />
        <ThemeText
          type="body__secondary"
          style={styles.stopPlaceName}
          color={'primary'}
        >
          {startPlaceName}
        </ThemeText>
      </View>

      <View style={styles.lineContainer}>
        <DestinationIllustrationPart color={color} isEnd />
        <ThemeText
          type="body__secondary"
          style={styles.stopPlaceName}
          color={'primary'}
        >
          {endPlaceName}
        </ThemeText>
      </View>

      <View style={{position: 'absolute', top: 23}}>
        <DestinationIllustrationPart color={color} />
      </View>

      {showTwoWayIcon && (
        <View
          style={{
            position: 'absolute',
            top: 23,
            backgroundColor: 'white',
          }}
        >
          <ArrowUpLeft fill={color} height={20} width={20} />
        </View>
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacings.xSmall,
  },
  stopPlaceName: {
    marginTop: theme.spacings.small,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
}));
