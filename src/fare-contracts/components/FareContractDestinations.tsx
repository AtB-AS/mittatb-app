import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';

import {ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';

const DestinationIllustrationPart = ({
  color = 'red',
  isStart = false,
  isEnd = false,
}: {
  color: string;
  isStart?: boolean;
  isEnd?: boolean;
}) => {
  const {theme} = useTheme();
  const stopIndicatorPart = (
    <View
      style={{
        width: theme.tripLegDetail.decorationLineEndWidth,
        height: theme.tripLegDetail.decorationLineWidth,
        backgroundColor: color,
      }}
    />
  );
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        width: theme.tripLegDetail.decorationLineEndWidth,
        marginHorizontal: theme.tripLegDetail.decorationLineWidth,
      }}
    >
      {isStart && stopIndicatorPart}
      <View
        style={{
          width: theme.tripLegDetail.decorationLineWidth,
          height:
            theme.tripLegDetail.decorationContainerWidth -
            theme.tripLegDetail.decorationLineWidth,
          backgroundColor: color,
        }}
      />
      {isEnd && stopIndicatorPart}
    </View>
  );
};

/*

TODO:

what about large text sizes?
screen reader / a11y?
accept color argument?

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

  const middlePartTop =
    theme.tripLegDetail.decorationContainerWidth +
    theme.tripLegDetail.decorationLineWidth * 2;

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

      {showTwoWayIcon && (
        <View
          style={{height: theme.tripLegDetail.decorationContainerWidth / 2}}
        />
      )}

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

      <View style={{position: 'absolute', top: middlePartTop}}>
        <DestinationIllustrationPart color={color} />
      </View>

      {showTwoWayIcon && (
        <View
          style={{
            position: 'absolute',
            top: middlePartTop,
            backgroundColor: theme.static.background.background_0.background,
          }}
        >
          <ArrowUpDown
            fill={color}
            height={theme.tripLegDetail.decorationContainerWidth}
            width={theme.tripLegDetail.decorationContainerWidth}
          />
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
