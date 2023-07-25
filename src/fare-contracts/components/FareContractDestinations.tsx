import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';

import {ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';

export function FareContractDestinations({
  startPlaceName,
  endPlaceName,
  showTwoWayIcon,
  decorationColor,
}: {
  startPlaceName?: string;
  endPlaceName?: string;
  showTwoWayIcon?: boolean;
  decorationColor?: string;
}) {
  const {theme} = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();

  const color =
    decorationColor || theme.transport.transport_boat.primary.background;

  const decorationLineWidth = theme.tripLegDetail.decorationLineWidth;
  const verticalLinePaddingLeft =
    theme.tripLegDetail.decorationLineEndWidth - decorationLineWidth;

  return (
    <View
      style={styles.container}
      accessibilityLabel={t(
        PurchaseOverviewTexts.summary.destinations(
          startPlaceName,
          endPlaceName,
        ),
      )}
      accessible={true}
    >
      <View
        style={{
          ...styles.destinationEndLine,
          marginBottom: -decorationLineWidth,
          backgroundColor: color,
        }}
      />

      <View
        style={{
          marginLeft: verticalLinePaddingLeft / 2,
          paddingLeft: verticalLinePaddingLeft,
          borderLeftColor: color,
          borderLeftWidth: decorationLineWidth,
        }}
      >
        <ThemeText type="body__secondary" color={'primary'}>
          {startPlaceName}
        </ThemeText>

        <View
          style={{
            paddingVertical: showTwoWayIcon ? 0 : decorationLineWidth,
            marginLeft:
              -verticalLinePaddingLeft -
              decorationLineWidth / 2 -
              theme.tripLegDetail.decorationContainerWidth / 2,
          }}
        >
          {showTwoWayIcon && (
            <View
              style={{
                backgroundColor:
                  theme.static.background.background_0.background,
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

        <ThemeText type="body__secondary" color={'primary'}>
          {endPlaceName}
        </ThemeText>
      </View>

      <View
        style={{
          ...styles.destinationEndLine,
          marginTop: -theme.tripLegDetail.decorationLineWidth,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
    marginLeft: theme.spacings.xSmall,
  },
  destinationEndLine: {
    width: theme.tripLegDetail.decorationLineEndWidth,
    height: theme.tripLegDetail.decorationLineWidth,
  },
}));
