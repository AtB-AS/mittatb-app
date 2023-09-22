import React from 'react';
import {
  PurchaseOverviewTexts,
  TravelDateTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {
  formatToShortDateTimeWithoutYear,
  formatToVerboseDateTime,
} from '@atb/utils/date';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {TravelDateSheet} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/TravelDate/TravelDateSheet';
import {RadioSegments} from '@atb/components/radio';
import {TimeSelectionMode} from '@atb/configuration';
import {MessageBox} from '@atb/components/message-box';

type StartTimeSelectionProps = {
  color: InteractiveColor;
  setTravelDate: (date?: string) => void;
  validFromTime?: string;
  travelDate?: string;
  selectionMode: TimeSelectionMode;
  maximumDate?: Date;
  showActivationDateWarning?: boolean;
  setShowActivationDateWarning: (x: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function StartTimeSelection({
  color,
  setTravelDate,
  validFromTime,
  travelDate,
  selectionMode,
  maximumDate,
  showActivationDateWarning,
  setShowActivationDateWarning,
  style,
}: StartTimeSelectionProps) {
  const {t, language} = useTranslation();
  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    onOpenFocusRef,
  } = useBottomSheet();
  const styles = useStyles();

  const openTravelDateSheet = () => {
    openBottomSheet(() => (
      <TravelDateSheet
        close={closeBottomSheet}
        save={setTravelDate}
        travelDate={travelDate}
        maximumDate={maximumDate}
        ref={onOpenFocusRef}
        showActivationDateWarning={showActivationDateWarning}
        setShowActivationDateWarning={setShowActivationDateWarning}
      />
    ));
  };

  const subtext = validFromTime
    ? formatToShortDateTimeWithoutYear(validFromTime, language)
    : undefined;
  const accessibilityLabel = validFromTime
    ? t(PurchaseOverviewTexts.startTime.later) +
      ', ' +
      formatToVerboseDateTime(validFromTime, language)
    : undefined;

  if (selectionMode === 'none') {
    return <></>;
  }

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary">
        {t(PurchaseOverviewTexts.startTime.title)}
      </ThemeText>
      <RadioSegments
        color={color}
        style={styles.radioSegments}
        activeIndex={!!validFromTime ? 1 : 0}
        options={[
          {
            text: t(PurchaseOverviewTexts.startTime.now),
            onPress: () => setTravelDate(undefined),
            accessibilityHint: t(PurchaseOverviewTexts.startTime.a11yNowHint),
          },
          {
            text: t(PurchaseOverviewTexts.startTime.later),
            subtext,
            onPress: openTravelDateSheet,
            accessibilityLabel,
            accessibilityHint: t(PurchaseOverviewTexts.startTime.a11yLaterHint),
          },
        ]}
      />
      {showActivationDateWarning && (
        <MessageBox
          style={styles.warningBox}
          type={'warning'}
          message={t(
            TravelDateTexts.latestActivationDate
              .selectedDateShouldBeEarlierWarning,
          )}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  radioSegments: {
    marginTop: theme.spacings.medium,
  },
  warningBox: {
    marginTop: theme.spacings.medium,
  },
}));
