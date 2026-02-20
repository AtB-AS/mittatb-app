import {View} from 'react-native';
import {PressableOpacity} from '../pressable-opacity';
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

type BottomSheetHeaderProps = {
  heading?: string;
  subText?: string;
  logoUrl?: string;
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
  bottomSheetRef,
  headerNode,
  focusRef,
  testID,
  bottomSheetHeaderType,
}: BottomSheetHeaderProps) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const headerData = useBottomSheetHeaderType(bottomSheetHeaderType);

  return (
    <View accessibilityRole="header" testID={`${testID}BottomSheetHeader`}>
      <View style={styles.handleIndicatorStyle} />
      {(heading || headerData?.text || headerData?.icon) && (
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

            {(headerData?.text || headerData?.icon) && (
              <PressableOpacity
                style={styles.headerRight}
                testID="closeBottomSheet"
                accessibilityRole="button"
                onPress={() => bottomSheetRef.current?.close()}
              >
                {headerData?.text && (
                  <ThemeText typography="body__s__strong">
                    {headerData.text}
                  </ThemeText>
                )}
                {headerData?.icon && <ThemeIcon svg={headerData.icon} />}
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
