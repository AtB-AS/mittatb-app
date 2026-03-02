import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {insets} from '@atb/utils/insets';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Add, Subtract} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {InteractiveColor} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';
import {NativeBlockButton} from '@atb/components/native-button';
import {BicycleFill} from '@atb/assets/svg/mono-icons/transportation';
import {BaggageType} from '@atb/modules/configuration';

type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  color?: InteractiveColor;
  count: number;
  addCount: () => void;
  removeCount: () => void;
  testID?: string;
  baggageType?: BaggageType;
}>;

export function CounterSectionItem({
  text,
  subtext,
  color,
  count,
  addCount,
  removeCount,
  testID,
  baggageType,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const counterStyles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const removeButtonDisabled = count === 0;
  const activeColor = count > 0 && color ? color.active : undefined;
  const illustration = mapBaggageTypeToSvg(baggageType);

  return (
    <View style={[topContainer, counterStyles.countContainer]} testID={testID}>
      <View
        style={[
          style.spaceBetween,
          contentContainer,
          counterStyles.infoContainer,
        ]}
        accessible={true}
        accessibilityLabel={`${count} ${text}, ${subtext || ''}`}
      >
        <View style={counterStyles.infoTextContainer}>
          {illustration && <ThemeIcon svg={illustration} />}
          <ThemeText>{text}</ThemeText>
        </View>
        {subtext && (
          <ThemeText
            typography="body__s"
            color="secondary"
            style={counterStyles.infoSubtext}
          >
            {subtext}
          </ThemeText>
        )}
      </View>
      <View style={counterStyles.countActions}>
        <NativeBlockButton
          disabled={removeButtonDisabled}
          onPress={() => removeCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.decreaseButton.a11yLabel(text),
          )}
          accessibilityHint={
            removeButtonDisabled
              ? ''
              : t(
                  SectionTexts.counterInput.decreaseButton.a11yHint(
                    text,
                    count,
                  ),
                )
          }
          accessibilityState={{disabled: removeButtonDisabled}}
          hitSlop={insets.all(theme.spacing.medium)}
          style={counterStyles.removeCount}
          testID={testID + '_rem'}
        >
          <ThemeIcon
            svg={Subtract}
            color={
              removeButtonDisabled
                ? theme.color.foreground.dynamic.disabled
                : theme.color.foreground.dynamic.primary
            }
          />
        </NativeBlockButton>
        <View
          style={[
            counterStyles.countTextContainer,
            activeColor && {backgroundColor: activeColor.background},
          ]}
        >
          <ThemeText
            accessible={false}
            importantForAccessibility="no"
            style={[
              counterStyles.countText,
              activeColor && {color: activeColor.foreground.primary},
            ]}
            typography="body__m__strong"
            testID={testID + '_count'}
          >
            {count}
          </ThemeText>
        </View>
        <NativeBlockButton
          onPress={() => addCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.increaseButton.a11yLabel(text),
          )}
          accessibilityHint={t(
            SectionTexts.counterInput.increaseButton.a11yHint(text, count),
          )}
          hitSlop={insets.all(8)}
          style={counterStyles.addCount}
          testID={testID + '_add'}
        >
          <ThemeIcon svg={Add} />
        </NativeBlockButton>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => {
  const scale = useFontScale();
  return {
    infoContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginRight: theme.spacing.medium,
    },
    infoSubtext: {
      marginTop: theme.spacing.small,
    },
    countContainer: {
      flex: 1,
      flexDirection: 'row',
      columnGap: theme.spacing.medium,
    },
    countActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    countTextContainer: {
      aspectRatio: 1,
      borderRadius: 1000,
      justifyContent: 'center',
    },
    countText: {
      minWidth: theme.spacing.large * scale,
      margin: theme.spacing.small * scale,
      textAlign: 'center',
    },
    removeCount: {
      marginRight: theme.spacing.xLarge,
    },
    addCount: {
      marginLeft: theme.spacing.xLarge,
    },
    infoTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
  };
});

function mapBaggageTypeToSvg(baggageType?: BaggageType) {
  switch (baggageType) {
    case 'BICYCLE':
      return BicycleFill;
    default:
      return;
  }
}
