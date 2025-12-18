import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {PressableOpacity} from '../pressable-opacity';
import {ThemeText} from '../text';
import {ThemeIcon} from '../theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BrandingImage} from '@atb/modules/mobility';
import {Ref} from 'react';

type BottomSheetHeaderProps = {
  heading?: string;
  subText?: string;
  logoUrl?: string;
  rightIcon?: (props: SvgProps) => React.JSX.Element;
  rightIconText?: string;
  bottomSheetRef: React.RefObject<BottomSheetModal | BottomSheet | null>;
  headerNode?: React.ReactNode;
  focusRef?: Ref<any>;
  testID?: string;
  overrideCloseFunction?: () => void;
};

export const BottomSheetHeader = ({
  heading,
  subText,
  logoUrl,
  rightIcon,
  rightIconText,
  bottomSheetRef,
  headerNode,
  focusRef,
  testID,
  overrideCloseFunction,
}: BottomSheetHeaderProps) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  return (
    <View accessibilityRole="header" testID={`${testID}BottomSheetHeader`}>
      <View style={styles.handleIndicatorStyle} />
      {(heading || rightIconText || rightIcon) && (
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {heading && (
                <>
                  {logoUrl && <BrandingImage logoUrl={logoUrl} logoSize={28} />}
                  <View style={styles.headingWrapper} accessible ref={focusRef}>
                    <ThemeText typography="heading__xl">{heading}</ThemeText>
                    {subText && (
                      <ThemeText
                        typography="body__s"
                        color={theme.color.foreground.dynamic.secondary}
                      >
                        {subText}
                      </ThemeText>
                    )}
                  </View>
                </>
              )}
            </View>

            {(rightIconText || rightIcon) && (
              <PressableOpacity
                style={styles.headerRight}
                testID="closeBottomSheet"
                accessibilityRole="button"
                onPress={
                  overrideCloseFunction ??
                  (() => bottomSheetRef.current?.close())
                }
              >
                {rightIconText && (
                  <ThemeText typography="body__s__strong">
                    {rightIconText}
                  </ThemeText>
                )}
                {rightIcon && <ThemeIcon svg={rightIcon} />}
              </PressableOpacity>
            )}
          </View>
          {!!headerNode && (
            <View style={styles.headerNodeContainer}>{headerNode}</View>
          )}
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  headerContainer: {
    flexDirection: 'column',
  },
  headerContent: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    paddingBottom: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
  },
  headerNodeContainer: {
    flex: 1,
    paddingLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    paddingLeft: theme.spacing.large,
  },
  headingWrapper: {
    gap: theme.spacing.xSmall,
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    paddingRight: theme.spacing.medium,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.color.foreground.inverse.secondary,
    width: 75,
    height: 6,
    alignSelf: 'center',
    borderRadius: theme.border.radius.regular,
    marginBottom: theme.spacing.medium,
    marginTop: theme.spacing.small,
  },
}));
