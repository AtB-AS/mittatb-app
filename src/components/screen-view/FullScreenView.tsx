import {useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import {ScreenWithLargeHeader} from './ScreenWithLargeHeader';

export type ScreenViewProps = ScreenHeaderProps & {
  type: 'large' | 'small';
  /**
   * JSX content that will be displayed as part of the disappearing header,
   * below the title, and above global messages.
   */
  headerChildren?: (focusRef?: React.MutableRefObject<null>) => React.ReactNode;
  /**
   * Page content, below disappearing header.
   */
  children?: React.ReactNode;
};

export function FullScreenView(props: ScreenViewProps) {
  const {top} = useSafeAreaInsets();
  const {themeName} = useTheme();
  const themeColor = props.color ?? 'background_accent_0';
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  switch (props.type) {
    case 'small':
      return (
        <>
          <View style={{backgroundColor, paddingTop: top}}>
            <ScreenHeader {...props} />
          </View>
          <ScrollView>{props.children}</ScrollView>
        </>
      );
    case 'large':
      return (
        <>
          <View style={{backgroundColor, paddingTop: top}}>
            {/* TODO: Handle title after scroll */}
            <ScreenHeader {...props} title={undefined} setFocusOnLoad={false} />
          </View>
          <ScreenWithLargeHeader {...props} />
        </>
      );
  }
}
