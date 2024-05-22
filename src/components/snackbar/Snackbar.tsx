import {shadows} from '@atb/components/map';
import {ThemeText} from '@atb/components/text';
import {Animated, TouchableOpacity, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button, ButtonProps} from '@atb/components/button';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSnackbarVerticalPositionAnimation} from '@atb/components/snackbar';
import SnackbarTexts from '@atb/translations/components/Snackbar';
import {useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

// todo:
// jsdoc
// integrated visible hook stuff?
// storybook

export type SnackbarPosition = 'top' | 'bottom';

type SnackbarProps = {
  title?: string;
  description: string;
  position: SnackbarPosition;
  actionButton: ButtonProps;
  dismissable?: boolean;
  closeOnPress?: () => void;
  visible?: boolean;
};

export const Snackbar = ({
  title,
  description = '',
  position,
  actionButton,
  dismissable = false,
  closeOnPress,
  visible = true,
}: SnackbarProps) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {verticalPositionStyle, animatedViewOnLayout} =
    useSnackbarVerticalPositionAnimation(position, visible);

  const focusRef = useFocusOnLoad();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  if (!visible && isScreenReaderEnabled) {
    return <></>;
  }

  return (
    <Animated.View
      style={[styles.snackbarContainer, verticalPositionStyle]}
      onLayout={animatedViewOnLayout}
    >
      <View style={styles.snackbar}>
        <View style={styles.snackbarTexts} ref={focusRef} accessible={true}>
          {title && (
            <ThemeText
              type="body__primary--bold"
              color="primary"
              numberOfLines={1}
            >
              {title}
            </ThemeText>
          )}
          <ThemeText
            type="body__primary"
            color={title ? 'secondary' : 'primary'}
            numberOfLines={title ? 1 : 2}
          >
            {description}
          </ThemeText>
        </View>

        <View style={styles.snackbarButtons}>
          {actionButton && (
            <Button type="medium" mode="tertiary" {...actionButton} />
          )}

          {(dismissable || isScreenReaderEnabled) && (
            <TouchableOpacity
              onPress={closeOnPress}
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
    ...{
      backgroundColor: theme.static.background.background_0.background,
      width: '88%',
      paddingLeft: theme.spacings.large,
      paddingRight: theme.spacings.xSmall,
      borderRadius: theme.border.radius.regular,
    },
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
