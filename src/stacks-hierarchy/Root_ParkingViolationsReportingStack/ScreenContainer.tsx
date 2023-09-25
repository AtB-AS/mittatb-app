import {DashboardBackground} from '@atb/assets/svg/color/images';
import {StyleSheet} from '@atb/theme';
import {ScrollView, View} from 'react-native';
import {themeColor} from './Root_ParkingViolationsReportingStack';
import {PropsWithChildren, ReactNode} from 'react';
import {ThemeText} from '@atb/components/text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title?: string;
  accessibilityTitle?: string;
  buttons?: ReactNode;
}>;

export const ScreenContainer = ({
  children,
  title,
  accessibilityTitle,
  buttons,
}: Props) => {
  const style = useStyles();

  return (
    <View style={style.container}>
      <View style={style.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView style={style.content}>
        {title && (
          <ThemeText
            type="heading--big"
            style={style.header}
            color={themeColor}
            accessibilityRole={'header'}
            accessibilityLabel={accessibilityTitle ?? title}
          >
            {title}
          </ThemeText>
        )}
        {children}
      </ScrollView>
      {buttons && <View style={style.actionButtons}>{buttons}</View>}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      flex: 1,
      backgroundColor: theme.static.background[themeColor].background,
      width: '100%',
    },
    backdrop: {
      position: 'absolute',
      height: 250,
      left: 0,
      right: 0,
      bottom: 45,
      padding: 0,
      margin: 0,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacings.medium,
    },
    header: {
      textAlign: 'center',
      paddingHorizontal: theme.spacings.xLarge,
      marginBottom: theme.spacings.xLarge,
    },
    actionButtons: {
      marginHorizontal: theme.spacings.xLarge,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
