import React from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {formatToShortDateTimeWithoutYear} from '@atb/utils/date';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import TravelDateSheet from '@atb/screens/Ticketing/Purchase/TravelDate/TravelDateSheet';
import SegmentedControl from '@atb/components/segmented-control';

type StartTimeSelectionProps = {
  color: InteractiveColor;
  setTravelDate: (date?: string) => void;
  style?: StyleProp<ViewStyle>;
  validFromTime?: string;
  travelDate?: string;
};

export default function StartTimeSelection({
  color,
  setTravelDate,
  style,
  validFromTime,
  travelDate,
}: StartTimeSelectionProps) {
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();
  const styles = useStyles();

  const openTravelDateSheet = () => {
    openBottomSheet((close, focusRef) => (
      <TravelDateSheet
        close={close}
        save={setTravelDate}
        travelDate={travelDate}
        ref={focusRef}
      />
    ));
  };

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary">
        {t(PurchaseOverviewTexts.startTime.title)}
      </ThemeText>
      <SegmentedControl
        color={color}
        style={styles.segmentedControl}
        activeIndex={!!validFromTime ? 1 : 0}
        options={[
          {
            text: t(PurchaseOverviewTexts.startTime.now),
            onPress: () => setTravelDate(undefined),
            accessibilityHint: t(PurchaseOverviewTexts.startTime.a11yNowHint),
          },
          {
            text: t(PurchaseOverviewTexts.startTime.later),
            subtext: validFromTime
              ? formatToShortDateTimeWithoutYear(validFromTime, language)
              : undefined,
            onPress: openTravelDateSheet,
            accessibilityHint: t(PurchaseOverviewTexts.startTime.a11yLaterHint),
          },
        ]}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  segmentedControl: {
    marginTop: theme.spacings.medium,
  },
}));
