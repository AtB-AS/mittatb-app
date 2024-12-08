import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';

import {ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useHarbors} from '@atb/harbors';
import {ProductTypeTransportModes} from '@atb-as/config-specs';
import {TravelRightDirection} from '@atb/ticketing';

export function FareContractHarborStopPlaces({
  fromStopPlaceId,
  toStopPlaceId,
  direction,
  transportModes,
}: {
  fromStopPlaceId?: string;
  toStopPlaceId?: string;
  direction?: TravelRightDirection;
  transportModes?: ProductTypeTransportModes[];
}) {
  const {theme} = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();
  const harborsQuery = useHarbors({transportModes});

  if (!fromStopPlaceId || !toStopPlaceId) return null;
  if (harborsQuery.isLoading)
    return <ActivityIndicator style={styles.loading} />;
  if (harborsQuery.isError)
    return (
      <MessageInfoBox
        style={styles.errorMessage}
        type="warning"
        message={t(FareContractTexts.details.harbors.error)}
        onPressConfig={{
          text: t(dictionary.retry),
          action: harborsQuery.refetch,
        }}
      />
    );

  const harbors = harborsQuery.data;
  const fromName = harbors.find((sp) => sp.id === fromStopPlaceId)?.name;
  const toName = harbors.find((sp) => sp.id === toStopPlaceId)?.name;
  const isTwoWay = direction === TravelRightDirection.Both;

  if (!fromName || !toName) return null;

  const color = theme.color.transport.boat.primary.background;
  const decorationLineWidth = theme.tripLegDetail.decorationLineWidth;
  const verticalLinePaddingLeft =
    theme.tripLegDetail.decorationLineEndWidth - decorationLineWidth;

  return (
    <View
      style={styles.container}
      accessibilityLabel={t(
        FareContractTexts.details.harbors.directions(
          fromName,
          toName,
          isTwoWay,
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
        <ThemeText typography="body__secondary" color="primary">
          {fromName}
        </ThemeText>

        <View
          style={{
            paddingVertical: isTwoWay ? 0 : decorationLineWidth,
            marginLeft:
              -verticalLinePaddingLeft -
              decorationLineWidth / 2 -
              theme.tripLegDetail.decorationContainerWidth / 2,
          }}
        >
          {isTwoWay && (
            <View
              style={{
                backgroundColor: theme.color.background.neutral[0].background,
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

        <ThemeText typography="body__secondary" color="primary">
          {toName}
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
    marginLeft: theme.spacing.xSmall,
  },
  loading: {alignItems: 'flex-start', marginTop: 12},
  errorMessage: {marginTop: 12},
  destinationEndLine: {
    width: theme.tripLegDetail.decorationLineEndWidth,
    height: theme.tripLegDetail.decorationLineWidth,
  },
}));
