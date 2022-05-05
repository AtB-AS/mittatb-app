import React from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {formatToShortDateTimeWithoutYear} from '@atb/utils/date';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import TravelDateSheet from '@atb/screens/Ticketing/Purchase/TravelDate/TravelDateSheet';

type StartTimeSelectionProps = {
  color: InteractiveColor;
  validFromTime?: string;
  travelDate?: string;
  setTravelDate: (date?: string) => void;
};

export default function StartTimeSelection({
  color,
  validFromTime,
  travelDate,
  setTravelDate,
}: StartTimeSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {open: openBottomSheet} = useBottomSheet();

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
    <View style={styles.container}>
      <ThemeText type="body__secondary" color="secondary">
        {t(PurchaseOverviewTexts.startTime.title)}
      </ThemeText>
      <MultiSelector
        options={[
          {
            text: t(PurchaseOverviewTexts.startTime.now),
            onPress: () => setTravelDate(undefined),
            selected: !validFromTime,
            a11yhint: t(PurchaseOverviewTexts.startTime.a11yNowHint),
          },
          {
            text: t(PurchaseOverviewTexts.startTime.later),
            subtext: validFromTime
              ? formatToShortDateTimeWithoutYear(validFromTime, language)
              : undefined,
            onPress: openTravelDateSheet,
            selected: !!validFromTime,
            a11yhint: t(PurchaseOverviewTexts.startTime.a11yLaterHint),
          },
        ]}
        color={color}
      />
    </View>
  );
}

type MultiSelectorOption = {
  onPress: () => void;
  text: string;
  subtext?: string;
  selected?: boolean;
  a11yhint: string;
};

type MultiSelectorProps = {
  color: InteractiveColor;
  options: MultiSelectorOption[];
};

function MultiSelector({color, options}: MultiSelectorProps) {
  const styles = useStyles();
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.multiSelectContainer,
        {backgroundColor: theme.interactive[color].default.background},
      ]}
    >
      {options.map((option) => {
        const currentColor =
          theme.interactive[color][option.selected ? 'active' : 'default'];

        // To make items with and without border the same size, we subtract
        // the border width from the padding when there is a border.
        const borderOffset = option.selected ? theme.border.width.medium : 0;

        return (
          <TouchableOpacity
            onPress={option.onPress}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{selected: option.selected}}
            accessibilityHint={option.a11yhint}
            style={[
              styles.optionBox,
              {
                backgroundColor: currentColor.background,
                borderColor: theme.interactive[color].outline.background,
                borderWidth: option.selected ? theme.border.width.medium : 0,
                padding: theme.spacings.medium - borderOffset,
              },
            ]}
          >
            <ThemeText
              type={
                option.selected ? 'body__secondary--bold' : 'body__secondary'
              }
              style={[styles.optionText, {color: currentColor.text}]}
            >
              {option.text}
            </ThemeText>
            {option.subtext && (
              <ThemeText
                type="body__secondary"
                style={[styles.optionText, {color: currentColor.text}]}
              >
                {option.subtext}
              </ThemeText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacings.medium,
  },
  multiSelectContainer: {
    marginTop: theme.spacings.medium,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionBox: {
    margin: theme.spacings.xSmall,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: theme.border.radius.regular,
    width: 0,
  },
  optionText: {
    textAlign: 'center',
    flexBasis: 0,
  },
}));
