import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext, themes, Themes} from '@atb/theme';
import {PropsWithChildren, ReactNode} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Processing} from '@atb/components/loading';
import {dictionary, useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export const getThemeColor = (themeName: keyof Themes) =>
  themes[themeName]?.color?.background?.accent?.[0];

type Props = PropsWithChildren<{
  overrideThemeName?: keyof Themes;
  title?: string;
  titleA11yLabel?: string;
  secondaryText?: string;
  leftHeaderButton?: LeftButtonProps;
  rightHeaderButton?: RightButtonProps;
  buttons?: ReactNode;
  isLoading?: boolean;
}>;

export const ScreenContainer = (props: Props) => {
  const {themeName: contextThemeName} = useThemeContext();
  const themeName = props.overrideThemeName ?? contextThemeName;
  const themeColor = getThemeColor(themeName);

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

const LoadingBody = () => {
  const style = useStyles();
  const {t} = useTranslation();
  return (
    <View style={style.centered}>
      <Processing message={t(dictionary.loading)} />
    </View>
  );
};

const ContentBody = ({
  overrideThemeName,
  title,
  secondaryText,
  buttons,
  children,
}: Props) => {
  const style = useStyles();
  const {themeName: contextThemeName} = useThemeContext();
  const themeName = overrideThemeName ?? contextThemeName;
  const themeColor = getThemeColor(themeName);
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
