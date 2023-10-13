import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {PropsWithChildren, ReactNode} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {themeColor} from '../Root_ParkingViolationsReportingStack';

type Props = PropsWithChildren<{
  title?: string;
  titleA11yLabel?: string;
  secondaryText?: string;
  leftHeaderButton?: LeftButtonProps;
  rightHeaderButton?: RightButtonProps;
  buttons?: ReactNode;
}>;

export const ScreenContainer = ({
  leftHeaderButton = {type: 'back'},
  rightHeaderButton,
  children,
  title,
  titleA11yLabel,
  secondaryText,
  buttons,
}: Props) => {
  const style = useStyles();
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
    </FullScreenView>
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
    actionButtons: {
      marginHorizontal: theme.spacings.medium,

      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
