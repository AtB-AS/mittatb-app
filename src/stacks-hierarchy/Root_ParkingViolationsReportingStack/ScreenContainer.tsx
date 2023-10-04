import {LeftButtonProps} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {PropsWithChildren, ReactNode} from 'react';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {themeColor} from './Root_ParkingViolationsReportingStack';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';

type Props = PropsWithChildren<{
  title?: string;
  titleA11yLabel?: string;
  secondaryText?: string;
  leftHeaderButton?: LeftButtonProps;
  buttons?: ReactNode;
}>;

export const ScreenContainer = ({
  leftHeaderButton = {type: 'back'},
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
        title,
        titleA11yLabel,
        color: 'background_accent_0',
      }}
      contentContainerStyle={style.contentContainer}
    >
      <ScrollView contentContainerStyle={style.content}>
        <View style={style.header}>
          <ThemeText color={themeColor} type="heading--medium">
            {title}
          </ThemeText>
        </View>
        <ThemeText color={themeColor}>{secondaryText}</ThemeText>
        {children}
      </ScrollView>
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
      marginHorizontal: theme.spacings.xLarge,
      marginTop: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
