import React, {forwardRef} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  CounterIconBox,
  getTransportModeSvg,
  TransportationIconBox,
} from '@atb/components/icon-box';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {TransportModePair} from './types';
import {TextColor, TextNames} from '@atb-as/theme';
import {StaticColor} from '@atb/theme/colors';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {AccessibilityProps} from 'react-native/Libraries/Components/View/ViewAccessibility';

type Props = AccessibilityProps & {
  modes: TransportModePair[];
  maxModesToDisplay?: number;
  text: string;
  iconSize?: keyof Theme['icon']['size'];
  textType?: TextNames;
  textColor?: TextColor | StaticColor;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};
export const TransportModesWithText = forwardRef<View, Props>(
  (
    {
      modes,
      maxModesToDisplay = 2,
      text,
      iconSize,
      textType = 'body__primary',
      textColor = 'primary',
      disabled,
      style,
      ...props
    }: Props,
    ref,
  ) => {
    const styles = useStyle({iconSize})();
    const {t} = useTranslation();

    const modesCount: number = modes.length;
    const modesToDisplay = modes
      .slice(0, maxModesToDisplay)
      .filter(removeDuplicatesByIconNameFilter);

    return (
      <View style={[style, styles.container]} ref={ref} accessible={true}>
        {modesToDisplay.map(({mode, subMode}) => (
          <TransportationIconBox
            style={styles.icon}
            key={mode + subMode}
            mode={mode}
            subMode={subMode}
            size={iconSize}
            disabled={disabled}
          />
        ))}
        {modesCount > maxModesToDisplay && (
          <CounterIconBox
            style={styles.icon}
            count={modesCount - maxModesToDisplay}
            size={iconSize}
            accessibilityLabel={t(
              FareContractTexts.transportModes.a11yLabelMultipleTravelModes(
                modesCount,
              ),
            )}
          />
        )}
        <ThemeText
          type={textType}
          color={textColor}
          style={styles.text}
          {...props}
        >
          {text}
        </ThemeText>
      </View>
    );
  },
);

const useStyle = ({iconSize}: Pick<Props, 'iconSize'>) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight:
        iconSize === 'small' ? theme.spacings.xSmall : theme.spacings.small,
    },
    text: {
      flexShrink: 1,
    },
  }));

const removeDuplicatesByIconNameFilter = (
  val: TransportModePair,
  i: number,
  arr: TransportModePair[],
): boolean =>
  arr
    .map((m) => getTransportModeSvg(m.mode, m.subMode).name)
    .indexOf(getTransportModeSvg(val.mode, val.subMode).name) === i;
