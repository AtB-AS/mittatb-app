import {PropsWithChildren, Ref} from 'react';
import {Linking, ScrollView, StatusBar, View} from 'react-native';
import {LoadingBody} from '../PhotoCapture/ScreenContainer';
import {ThemeText} from '../text';
import {StyleSheet} from '@atb/theme';
import {NativeTouchable} from '../native-touchable';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {ThemeIcon} from '../theme-icon';
import SvgChevronLeft from '@atb/assets/svg/mono-icons/navigation/ChevronLeft';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Processing} from '@atb/components/loading';
import CameraTexts from '@atb/translations/components/Camera';
import {usePermissions} from './use-permissions';

type CameraScreenContainerProps = PropsWithChildren<{
  title: string;
  secondaryText?: string;
  isLoading: boolean;
  onGoBack: () => void;
  focusRef?: Ref<any>;
  errorMessage?: string;
}>;

export const CameraScreenContainer = ({
  children,
  title,
  isLoading,
  secondaryText,
  onGoBack,
  focusRef,
  errorMessage,
}: CameraScreenContainerProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {isAuthorized} = usePermissions();

  if (isLoading) {
    return <LoadingBody />;
  }

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="auto">
        {isAuthorized && children}
      </View>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <View style={styles.header} ref={focusRef}>
            <NativeTouchable
              variant="borderless"
              onPress={onGoBack}
              style={styles.back}
            >
              <ThemeIcon svg={SvgChevronLeft} color="#ffffff" />
              <ThemeText typography="body__s__strong" color="#ffffff">
                {t(ScreenHeaderTexts.headerButton.back.text)}
              </ThemeText>
            </NativeTouchable>
          </View>
          <View style={styles.content}>
            <ThemeText typography="heading__l" color="#ffffff">
              {title}
            </ThemeText>
            {!!secondaryText && (
              <ThemeText typography="body__s" color="#ffffff">
                {secondaryText}
              </ThemeText>
            )}
            {!!errorMessage && (
              <MessageInfoBox
                type="error"
                message={errorMessage}
                a11yLiveRegion="polite"
              />
            )}
          </View>
        </View>

        {/*
          With no camera to show, these take the space the preview would have
          filled. They are siblings of the header rather than children of it,
          so flex hands them exactly what is left over and nothing has to know
          how tall the header grew.
        */}
        {isAuthorized === undefined && (
          <View style={[styles.cameraFallback, styles.cameraFallbackContent]}>
            <Processing message={t(CameraTexts.loading)} />
          </View>
        )}
        {isAuthorized === false && (
          <ScrollView
            style={styles.cameraFallback}
            contentContainerStyle={styles.cameraFallbackContent}
          >
            <MessageInfoBox
              title={t(CameraTexts.permissionRequired.title)}
              message={t(CameraTexts.permissionRequired.message)}
              type="warning"
              onPressConfig={{
                action: () => Linking.openSettings(),
                text: t(CameraTexts.permissionRequired.action),
              }}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, {top, bottom}) => {
  return {
    root: {
      flex: 1,
      backgroundColor: 'black',
    },
    overlay: {
      ...StyleSheet.absoluteFill,
    },
    container: {
      gap: theme.spacing.medium,
      backgroundColor: 'black',
      paddingTop: top + theme.spacing.medium,
      paddingBottom: theme.spacing.medium,
    },
    header: {
      flexDirection: 'row',
      gap: theme.spacing.xSmall,
      paddingHorizontal: theme.spacing.medium,
    },
    content: {
      paddingHorizontal: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    back: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    cameraFallback: {
      flex: 1,
    },
    cameraFallbackContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.spacing.medium,
      paddingBottom: bottom + theme.spacing.medium,
    },
  };
});
