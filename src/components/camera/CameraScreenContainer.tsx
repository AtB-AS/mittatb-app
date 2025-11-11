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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <PressableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <ThemeIcon svg={SvgChevronLeft} color="white" />
        <ThemeText
          typography="body__s__strong"
          accessibilityHint={t(ScreenHeaderTexts.headerButton.back.a11yHint)}
          color="white"
        >
          {t(ScreenHeaderTexts.headerButton.back.text)}
        </ThemeText>
      </PressableOpacity>

      <View style={styles.content}>
        <View ref={focusRef} accessible>
          <ThemeText typography="heading__l" color="white">
            {title}
          </ThemeText>
        </View>
        {secondaryText && (
          <ThemeText typography="body__s" color="white">
            {secondaryText}
          </ThemeText>
        )}
      </View>

      {children}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {top: safeTopInset} = useSafeAreaInsets();
  return {
    container: {
      flex: 1,
      gap: theme.spacing.medium,
      backgroundColor: 'black',
      paddingTop: safeTopInset + theme.spacing.medium,
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
  };
});
