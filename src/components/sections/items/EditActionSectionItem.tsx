import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {NativeBlockButton} from '@atb/components/native-button';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {forwardRef} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {SectionItemProps} from '../types';
import {useSectionItem} from '../use-section-item';

type Props = SectionItemProps<
  {
    leftIcon?: ThemeIconProps['svg'];
    rightIcon?: ThemeIconProps['svg'];
    text: string;
    subText?: string;
    onPress(): void;
    testID?: string;
  } & AccessibilityProps
>;

export const EditActionSectionItem = forwardRef<any, Props>(
  ({leftIcon, rightIcon, text, subText, onPress, testID, ...props}, ref) => {
    const {topContainer} = useSectionItem(props);
    const styles = useStyles();
    const {theme} = useThemeContext();

    return (
      <NativeBlockButton
        ref={ref}
        accessible
        accessibilityRole="button"
        onPress={onPress}
        style={[topContainer, styles.button]}
        testID={testID}
        {...props}
      >
        {leftIcon && <ThemeIcon svg={leftIcon} size="normal" />}
        <View style={styles.textContainer}>
          <ThemeText typography="body__m__strong">{text}</ThemeText>
          {subText && (
            <ThemeText typography="body__m" color="secondary">
              {subText}
            </ThemeText>
          )}
        </View>
        <ThemeIcon
          svg={rightIcon ?? Edit}
          size="normal"
          color={theme.color.interactive[0].default.background}
        />
      </NativeBlockButton>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  button: {flex: 1, flexDirection: 'row', gap: theme.spacing.small},
  gap: {gap: theme.spacing.small, alignItems: 'flex-start'},
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xSmall,
  },
}));
