import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext, Theme} from '@atb/theme';
import {PropsWithChildren, ReactNode} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Processing} from '@atb/components/loading';
import {dictionary, useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = PropsWithChildren<{
  title?: string;
  titleA11yLabel?: string;
  secondaryText?: string;
  leftHeaderButton?: LeftButtonProps;
  rightHeaderButton?: RightButtonProps;
  buttons?: ReactNode;
  isLoading?: boolean;
}>;

export const LoadingBody = () => {
  const style = useStyles();
  const {t} = useTranslation();
  return (
    <View style={style.centered}>
      <Processing message={t(dictionary.loading)} />
    </View>
  );
};

export const ScreenContainer = (props: Props) => {
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  return (
    <FullScreenView
      headerProps={{
        leftButton: props.leftHeaderButton,
        rightButton: props.rightHeaderButton,
        color: themeColor,
        setFocusOnLoad: false,
      }}
      contentColor={themeColor}
    >
      {props.isLoading && <LoadingBody />}
      {!props.isLoading && <ContentBody {...props} />}
    </FullScreenView>
  );
};

const ContentBody = ({title, secondaryText, buttons, children}: Props) => {
  const style = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const focusRef = useFocusOnLoad();
  return (
    <>
      <View style={style.content}>
        <View style={style.header}>
          <View ref={focusRef} accessible>
            <ThemeText color={themeColor} typography="heading__l">
              {title}
            </ThemeText>
          </View>
          {secondaryText && (
            <ThemeText style={style.secondaryText} color={themeColor}>
              {secondaryText}
            </ThemeText>
          )}
        </View>
        {children}
      </View>
      {!!buttons && <View style={style.actionButtons}>{buttons}</View>}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    content: {
      flex: 1,
      paddingVertical: theme.spacing.medium,
    },
    header: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.large,
    },
    secondaryText: {
      marginTop: theme.spacing.medium,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
    },
    actionButtons: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
  };
});
