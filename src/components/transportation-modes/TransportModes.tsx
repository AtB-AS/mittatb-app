import {TransportModeType, TransportSubmodeType} from '@atb/configuration';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {
  dictionary,
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {TextNames} from '@atb-as/theme';
import {ContrastColor} from '@atb/theme/colors';
import {TransportationIconBoxList} from '@atb/components/icon-box';

const modesDisplayLimit: number = 2;

export type TransportModePair = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};

const removeDuplicateStringsFilter = (
  val: string,
  i: number,
  arr: string[],
): boolean => arr.indexOf(val) === i;

/*
    Renders transportModes as natural text, e.g. "Buss og trikk"
 */
export const getTransportModeText = (
  modes: TransportModePair[],
  t: TranslateFunction,
): string => {
  if (!modes) return '';
  return modes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
    .filter(removeDuplicateStringsFilter)
    .map((str, i, arr) => {
      if (i === 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      } else if (i === arr.length - 1) {
        return ` ${t(dictionary.listConcatWord)} ${str}`;
      }
      return `, ${str}`;
    })
    .join('');
};

export const TransportModes = ({
  modes,
  iconSize,
  disabled,
  textType,
  textColor,
  style,
  customTransportModeText,
}: {
  modes: TransportModePair[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
  textType?: TextNames;
  textColor?: ContrastColor;
  style?: ViewStyle;
  customTransportModeText?: string;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const transportModeText: string = getTransportModeText(modes, t);

  const description =
    modes.length > modesDisplayLimit
      ? t(FareContractTexts.transportModes.more)
      : transportModeText;

  return (
    <View
      style={[styles.transportationMode, style]}
      accessibilityLabel={t(
        customTransportModeText
          ? FareContractTexts.transportModes.a11yLabelWithCustomText(
              transportModeText,
              customTransportModeText,
            )
          : FareContractTexts.transportModes.a11yLabel(transportModeText),
      )}
      accessible={true}
    >
      <TransportationIconBoxList
        modes={modes}
        maxNumberOfBoxes={modesDisplayLimit}
        iconSize={iconSize}
        disabled={disabled}
      />
      <ThemeText typography={textType ?? 'label__uppercase'} color={textColor}>
        {customTransportModeText ?? description}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationMode: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  transportationIcon: {
    marginRight: theme.spacing.xSmall,
  },
}));
