import {View} from 'react-native';
import {NativeBorderlessButton} from '../native-button';
import {ThemeText} from '../text';
import {ThemeIcon} from '../theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BrandingImage} from '@atb/modules/mobility';
import {Ref} from 'react';
import {
  BottomSheetHeaderType,
  useBottomSheetHeaderType,
} from './use-bottom-sheet-header-type';
import {insets} from '@atb/utils/insets';

type BottomSheetHeaderProps = {
  heading?: string;
  subText?: string;
  logoUrl?: string;
  logoIcon?: React.JSX.Element | null;
  bottomSheetRef: React.RefObject<BottomSheetModal | BottomSheet | null>;
  headerNode?: React.ReactNode;
  focusRef?: Ref<any>;
  testID?: string;
  bottomSheetHeaderType: BottomSheetHeaderType;
};

export const BottomSheetHeader = ({
  heading,
  subText,
  logoUrl,
  logoIcon,
  bottomSheetRef,
  headerNode,
  focusRef,
  testID,
  bottomSheetHeaderType,
}: BottomSheetHeaderProps) => {
  const styles = useStyles();
  const headerData = useBottomSheetHeaderType(bottomSheetHeaderType);
  const {theme} = useThemeContext();

  return (
    <View accessibilityRole="header" testID={`${testID}BottomSheetHeader`}>
      <View style={styles.handleIndicatorStyle} />
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {logoUrl ? (
              <BrandingImage logoUrl={logoUrl} logoSize={28} />
            ) : (
              logoIcon && logoIcon
            )}
            <View style={styles.headingWrapper} accessible ref={focusRef}>
              {heading && (
                <ThemeText typography="heading__l">{heading}</ThemeText>
              )}
              {subText && (
                <ThemeText typography="body__s" type="secondary">
                  {subText}
                </ThemeText>
              )}
            </View>
          </View>

          {(headerData?.text || headerData?.icon) && (
            <View style={styles.headerRight}>
              <NativeBorderlessButton
                style={styles.dismissButton}
                testID="closeBottomSheet"
                accessibilityRole="button"
                onPress={() => bottomSheetRef.current?.close()}
                hitSlop={insets.all(theme.spacing.small)}
              >
                {headerData?.text && (
                  <ThemeText typography="body__s__strong">
                    {headerData.text}
                  </ThemeText>
                )}
                {headerData?.icon && <ThemeIcon svg={headerData.icon} />}
              </NativeBorderlessButton>
            </View>
          )}
        </View>
        {!!headerNode && (
          <View style={styles.headerNodeContainer}>{headerNode}</View>
        )}
      </View>
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
    paddingBottom: theme.spacing.large,
    paddingRight: theme.spacing.medium,
    alignItems: 'center',
  },
  headerNodeContainer: {
    flex: 1,
    paddingLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
    paddingBottom: theme.spacing.small,
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
    flexShrink: 1,
  },
  headerRight: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.xSmall,
    alignSelf: 'flex-start',
  },
  dismissButton: {
    gap: theme.spacing.xSmall,
    flexDirection: 'row',
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
