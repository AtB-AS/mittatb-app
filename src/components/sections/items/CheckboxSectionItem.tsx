import React from 'react';
import {AccessibilityInfo, Platform, View} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {NativeTouchable} from '@atb/components/native-touchable';
import {Checkbox} from '@atb/components/checkbox';
import {dictionary, useTranslation} from '@atb/translations';

type Props = SectionItemProps<{
  text: string;
  selected: boolean;
  onPress(checked: boolean): void;
}>;

export function CheckboxSectionItem({
  text,
  selected,
  onPress,
  testID,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem({
    ...props,
    active: selected,
  });
  const style = useSectionStyle();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {neutral, accent} = theme.color.surface;

  const textColor = selected
    ? accent.subtle.foreground.primary
    : neutral.strong.foreground.primary;

  return (
    <NativeTouchable
      variant="block"
      onPress={() => {
        // Talkback doesn't read out the updated state automatically, so we
        // trigger it manually instead.
        if (Platform.OS === 'android') {
          AccessibilityInfo.announceForAccessibility(
            t(selected ? dictionary.unchecked : dictionary.checked),
          );
        }
        onPress(!selected);
      }}
      style={[styles.mainContent, topContainer]}
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{checked: selected}}
      accessibilityLabel={text}
    >
      <View style={style.spaceBetween}>
        <Checkbox checked={selected} style={styles.checkbox} />
        <View style={styles.textContainer}>
          <ThemeText
            typography="body__m"
            style={[contentContainer, {color: textColor}]}
            testID={`${testID}Text`}
          >
            {text}
          </ThemeText>
        </View>
      </View>
    </NativeTouchable>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  mainContent: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  checkbox: {marginRight: theme.spacing.medium},
  textContainer: {flex: 1},
}));
