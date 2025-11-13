import {PropsWithChildren} from 'react';
import {StatusBar, View} from 'react-native';
import {LoadingBody} from '../PhotoCapture/ScreenContainer';
import {ThemeText} from '../text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {PressableOpacity} from '../pressable-opacity';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {ThemeIcon} from '../theme-icon';
import SvgChevronLeft from '@atb/assets/svg/mono-icons/navigation/ChevronLeft';

type CameraScreenContainerProps = PropsWithChildren<{
  title: string;
  secondaryText?: string;
  isLoading: boolean;
}>;

export const CameraScreenContainer = ({
  children,
  title,
  isLoading,
  secondaryText,
}: CameraScreenContainerProps) => {
  const styles = useStyles();
  const focusRef = useFocusOnLoad();
  const navigation = useNavigation();
  const {t} = useTranslation();

  if (isLoading) {
    return <LoadingBody />;
  }

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="auto">
        {children}
      </View>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <View style={styles.header} ref={focusRef}>
            <PressableOpacity
              onPress={() => navigation.goBack()}
              style={styles.back}
            >
              <ThemeIcon svg={SvgChevronLeft} color="white" />
              <ThemeText typography="body__s__strong" color="white">
                {t(ScreenHeaderTexts.headerButton.back.text)}
              </ThemeText>
            </PressableOpacity>
          </View>
          <View style={styles.content}>
            <ThemeText typography="heading__l" color="white">
              {title}
            </ThemeText>
            {!!secondaryText && (
              <ThemeText typography="body__s" color="white">
                {secondaryText}
              </ThemeText>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {top: safeTopInset} = useSafeAreaInsets();
  return {
    root: {
      flex: 1,
      backgroundColor: 'black',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    container: {
      gap: theme.spacing.medium,
      backgroundColor: 'black',
      paddingTop: safeTopInset + theme.spacing.medium,
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
      gap: 8,
    },
  };
});
