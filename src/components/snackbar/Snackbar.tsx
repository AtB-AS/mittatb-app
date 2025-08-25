import {shadows} from '@atb/modules/map';
import {ThemeText} from '@atb/components/text';
import {Animated, View, ViewStyle} from 'react-native';
import {StyleSheet, type Theme, useThemeContext} from '@atb/theme';
import {Button, ButtonProps} from '@atb/components/button';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  useSnackbarVerticalPositionAnimation,
  useSnackbarIsVisible,
  useSnackbarScreenReaderFocus,
  useStableValue,
} from '@atb/components/snackbar';
import {useTranslation} from '@atb/translations';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

import SnackbarTexts from '@atb/translations/components/Snackbar';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';
import {PressableOpacity} from '../pressable-opacity';

export type SnackbarPosition = 'top' | 'bottom';
const SNACKBAR_POSITIONS: SnackbarPosition[] = ['top', 'bottom'];

export type SnackbarTextContent = {
  title?: string;
  description?: string;
  /** Unique key for the message. Makes it possible to re-show the exact same message */
  messageKey?: number;
};

export type SnackbarProps = {
  textContent?: SnackbarTextContent;
  position?: SnackbarPosition;
  /** Optional action button, only shown if this is provided */
  actionButton?: ButtonProps;
  /** Whether to show the close x button */
  isDismissable?: boolean;
  /** How many milliseconds the snackbar should stay in the visible position */
  customVisibleDurationMS?: number;
};

const getThemeColor = (theme: Theme) => theme.color.background.neutral[0];

// if position is ever toggled, it starts using two SnackbarInstances, one for top and one for bottom
// one of them is always disabled
export const Snackbar = (snackbarProps: SnackbarProps) => (
  <>
    {SNACKBAR_POSITIONS.map((position) => (
      <SnackbarInstance
        key={position}
        {...snackbarProps}
        position={position}
        isDisabled={position !== (snackbarProps.position || 'top')}
      />
    ))}
  </>
);

type SnackbarInstanceProps = SnackbarProps & {
  /** setting this true moves the SnackbarInstance to the hidden position */
  isDisabled: boolean;
};

const SnackbarInstance = ({
  textContent,
  position = 'top',
  actionButton,
  isDismissable,
  customVisibleDurationMS,
  isDisabled,
}: SnackbarInstanceProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  const stableTextContent = useStableValue(textContent, isDisabled); // avoid triggering useEffects if no text has been changed

  const {snackbarIsVisible, hideSnackbar} = useSnackbarIsVisible(
    isDisabled,
    stableTextContent,
    customVisibleDurationMS,
  );

  const {verticalPositionStyle, animatedViewOnLayout, parentMeasurerOnLayout} =
    useSnackbarVerticalPositionAnimation(position, snackbarIsVisible);

  // to show the correct textContent during exit animation, keep track of the previous value
  const stablePreviousTextContent = useStablePreviousValue(stableTextContent);
  const activeTextContent =
    !snackbarIsVisible && !stableTextContent && stablePreviousTextContent
      ? stablePreviousTextContent
      : stableTextContent;

  const focusRef = useSnackbarScreenReaderFocus(isDisabled, activeTextContent);
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  if (!snackbarIsVisible && isScreenReaderEnabled) {
    return <></>;
  }

  return (
    <>
      <Animated.View
        style={[styles.snackbarContainer, verticalPositionStyle]}
        onLayout={animatedViewOnLayout}
      >
        <View style={styles.snackbar}>
          <View style={styles.snackbarTexts} ref={focusRef} accessible={true}>
            {activeTextContent?.title && (
              <ThemeText
                typography="body__primary--bold"
                color="primary"
                numberOfLines={4} // max limit, should normally not come into play
              >
                {activeTextContent?.title}
              </ThemeText>
            )}
            {activeTextContent?.description && (
              <ThemeText
                typography="body__primary"
                color={activeTextContent?.title ? 'secondary' : 'primary'}
                numberOfLines={7} // max limit, should normally not come into play
              >
                {activeTextContent?.description}
              </ThemeText>
            )}
          </View>

          <View style={styles.snackbarButtons}>
            {actionButton && (
              <Button
                mode="tertiary"
                {...actionButton}
                onPress={() => {
                  if (snackbarIsVisible) {
                    actionButton.onPress();
                    hideSnackbar();
                  }
                }}
                backgroundColor={themeColor}
              />
            )}

            {(isDismissable || isScreenReaderEnabled) && (
              <PressableOpacity
                onPress={hideSnackbar}
                style={styles.closeButton}
                accessible={true}
                accessibilityLabel={t(SnackbarTexts.closeButton.a11yLabel)}
                accessibilityHint={t(SnackbarTexts.closeButton.a11yHint)}
                accessibilityRole="button"
                testID="closeSnackbarButton"
              >
                <ThemeIcon svg={Close} size="normal" />
              </PressableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
      <View onLayout={parentMeasurerOnLayout} style={styles.parentMeasurer} />
    </>
  );
};

const flowHorizontallyAndCenterAlignVertically: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  snackbarContainer: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    zIndex: 99, // just beneath LoadingOverlay
  },
  snackbar: {
    ...shadows,
    ...flowHorizontallyAndCenterAlignVertically,
    backgroundColor: getThemeColor(theme).background,
    width: '88%',
    paddingLeft: theme.spacing.large,
    paddingRight: theme.spacing.xSmall,
    borderRadius: theme.border.radius.regular,
  },
  snackbarTexts: {
    flex: 1,
    paddingVertical: theme.spacing.medium,
    marginRight: theme.spacing.medium,
    rowGap: theme.spacing.xSmall,
  },
  snackbarButtons: {
    ...flowHorizontallyAndCenterAlignVertically,
  },
  closeButton: {
    padding: theme.spacing.medium,
  },
  parentMeasurer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
}));
