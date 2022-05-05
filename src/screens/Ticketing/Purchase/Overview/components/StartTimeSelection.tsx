import React from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {formatToShortDateTimeWithoutYear} from '@atb/utils/date';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import TravelDateSheet from '@atb/screens/Ticketing/Purchase/TravelDate/TravelDateSheet';

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
        const borderWidth = option.selected ? theme.border.width.medium : 0;

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
                borderWidth,
                // To make items with and without border the same size, we
                // subtract the border width from the padding.
                padding: theme.spacings.medium - borderWidth,
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
  multiSelectContainer: {
    marginTop: theme.spacings.medium,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionBox: {
    flexGrow: 1,
    width: 0,
    justifyContent: 'center',
    margin: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
  optionText: {
    textAlign: 'center',
    flexBasis: 0,
  },
}));
