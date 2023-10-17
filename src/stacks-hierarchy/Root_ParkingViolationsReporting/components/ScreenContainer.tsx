import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {PropsWithChildren, ReactNode} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StaticColorByType} from '@atb/theme/colors';
import {Processing} from '@atb/components/loading';
import {dictionary, useTranslation} from '@atb/translations';

export const themeColor: StaticColorByType<'background'> =
  'background_accent_0';

type Props = PropsWithChildren<{
  title?: string;
  titleA11yLabel?: string;
  secondaryText?: string;
  leftHeaderButton?: LeftButtonProps;
  rightHeaderButton?: RightButtonProps;
  buttons?: ReactNode;
  isLoading?: boolean;
}>;

export const ScreenContainer = (props: Props) => {
  const style = useStyles();
  const {
    leftHeaderButton = {type: 'back'},
    rightHeaderButton,
    title,
    titleA11yLabel,
    isLoading = false,
  } = props;

  return (
    <FullScreenView
      headerProps={{
        leftButton: leftHeaderButton,
        rightButton: rightHeaderButton,
        title,
        titleA11yLabel,
        color: 'background_accent_0',
      }}
      contentContainerStyle={style.contentContainer}
    >
      {isLoading && <LoadingBody />}
      {!isLoading && <ContentBody {...props} />}
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

const ContentBody = ({title, secondaryText, buttons, children}: Props) => {
  const style = useStyles();
  return (
    <>
      <View style={style.content}>
        <View style={style.header}>
          <ThemeText color={themeColor} type="heading--medium">
            {title}
          </ThemeText>
        </View>
        {secondaryText && (
          <ThemeText color={themeColor}>{secondaryText}</ThemeText>
        )}
        {children}
      </View>
      {buttons && <View style={style.actionButtons}>{buttons}</View>}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    backdrop: {
      backgroundColor: theme.static.background[themeColor].background,
    },
    contentContainer: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: theme.spacings.medium,
    },
    header: {
      marginBottom: theme.spacings.large,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
    },
    actionButtons: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
