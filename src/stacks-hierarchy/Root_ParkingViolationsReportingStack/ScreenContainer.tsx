import {FullScreenHeader, LeftButtonProps} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {PropsWithChildren, ReactNode} from 'react';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {themeColor} from './Root_ParkingViolationsReportingStack';

type Props = PropsWithChildren<{
  title?: string;
  titleA11yLabel?: string;
  leftHeaderButton?: LeftButtonProps;
  buttons?: ReactNode;
}>;

export const ScreenContainer = ({
  leftHeaderButton = {type: 'back'},
  children,
  title,
  titleA11yLabel,
  buttons,
}: Props) => {
  const style = useStyles();

  return (
    <>
      <FullScreenHeader
        leftButton={leftHeaderButton}
        title={title}
        titleA11yLabel={titleA11yLabel}
      />
      <View style={style.container}>
        <ScrollView contentContainerStyle={style.content}>
          {children}
        </ScrollView>
        {buttons && <View style={style.actionButtons}>{buttons}</View>}
      </View>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      flex: 1,
      backgroundColor: theme.static.background[themeColor].background,
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
      flex: 1,
      padding: theme.spacings.medium,
    },
    header: {
      textAlign: 'center',
      paddingHorizontal: theme.spacings.xLarge,
      marginBottom: theme.spacings.xLarge,
    },
    actionButtons: {
      marginHorizontal: theme.spacings.xLarge,
      marginTop: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
