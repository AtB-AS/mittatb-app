import {shadows} from '@atb/components/map';
import {ThemeText} from '@atb/components/text';
import {Animated, TouchableOpacity, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button, ButtonProps} from '@atb/components/button';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  useSnackbarVerticalPositionAnimation,
  useSnackbarIsVisible,
  useSnackbarScreenReaderFocus,
} from '@atb/components/snackbar';
import {useTranslation} from '@atb/translations';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

import SnackbarTexts from '@atb/translations/components/Snackbar';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';
import {useStableValue} from '@atb/utils/use-stable-value';

export type SnackbarPosition = 'top' | 'bottom';

export type SnackbarTextContent = {
  title?: string;
  description?: string;
};

type SnackbarProps = {
  textContent?: SnackbarTextContent;
  position: SnackbarPosition;
  /** Optional action button, only shown if this is provided */
  actionButton?: ButtonProps;
  /** Whether to show the close x button */
  isDismissable?: boolean;
  /** How many milliseconds the snackbar should stay in the visible position */
  customVisibleDurationMS?: number;
};

export const Snackbar = ({
  textContent,
  position,
  actionButton,
  isDismissable,
  customVisibleDurationMS,
}: SnackbarProps) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const stableTextContent = useStableValue(textContent); // avoid triggering useEffects if no text has been changed

  const {snackbarIsVisible, hideSnackbar} = useSnackbarIsVisible(
    stableTextContent,
    customVisibleDurationMS,
  );

  const {verticalPositionStyle, animatedViewOnLayout} =
    useSnackbarVerticalPositionAnimation(position, snackbarIsVisible);

  // to show the correct textContent during exit animation, keep track of the previous value
  const stablePreviousTextContent = useStablePreviousValue(stableTextContent);
  const activeTextContent =
    !snackbarIsVisible && !stableTextContent && stablePreviousTextContent
      ? stablePreviousTextContent
      : stableTextContent;

  const focusRef = useSnackbarScreenReaderFocus(activeTextContent);
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  if (!snackbarIsVisible && isScreenReaderEnabled) {
    return <></>;
  }

  return (
    <Animated.View
      style={[styles.snackbarContainer, verticalPositionStyle]}
      onLayout={animatedViewOnLayout}
    >
      <View style={styles.snackbar}>
        <View style={styles.snackbarTexts} ref={focusRef} accessible={true}>
          {activeTextContent?.title && (
            <ThemeText
              type="body__primary--bold"
              color="primary"
              numberOfLines={4} // max limit, should normally not come into play
            >
              {activeTextContent?.title}
            </ThemeText>
          )}
          {activeTextContent?.description && (
            <ThemeText
              type="body__primary"
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
              type="medium"
              mode="tertiary"
              {...actionButton}
              onPress={() => {
                if (snackbarIsVisible) {
                  actionButton.onPress();
                  hideSnackbar();
                }
              }}
            />
          )}

          {(isDismissable || isScreenReaderEnabled) && (
            <TouchableOpacity
              onPress={hideSnackbar}
              style={styles.closeButton}
              accessible={true}
              accessibilityLabel={t(SnackbarTexts.closeButton.a11yLabel)}
              accessibilityHint={t(SnackbarTexts.closeButton.a11yHint)}
              accessibilityRole="button"
              testID="closeSnackbarButton"
            >
              <ThemeIcon svg={Close} size="normal" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
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
    backgroundColor: theme.static.background.background_0.background,
    width: '88%',
    paddingLeft: theme.spacings.large,
    paddingRight: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
  snackbarTexts: {
    flex: 1,
    paddingVertical: theme.spacings.medium,
    marginRight: theme.spacings.medium,
    rowGap: theme.spacings.xSmall,
  },
  snackbarButtons: {
    ...flowHorizontallyAndCenterAlignVertically,
  },
  closeButton: {
    padding: theme.spacings.medium,
  },
}));
