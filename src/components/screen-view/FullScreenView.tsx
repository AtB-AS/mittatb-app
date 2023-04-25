import {useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import {ScreenWithLargeHeader} from './ScreenWithLargeHeader';
import React from 'react';

export type ScreenViewProps = ScreenHeaderProps & {
  type: 'large' | 'small';
  /**
   * JSX content that will be displayed as part of the disappearing header,
   * below the title, and above global messages.
   */
  headerChildren?: React.ReactNode;
  /**
   * Page content, below disappearing header.
   */
  children?: React.ReactNode;
  onRefresh?(): void;
  isRefreshing?: boolean;
};

export function FullScreenView(props: ScreenViewProps) {
  const {top} = useSafeAreaInsets();
  const {themeName, theme} = useTheme();
  const themeColor = props.color ?? 'background_accent_0';
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  switch (props.type) {
    case 'small':
      return (
        <>
          <View style={{backgroundColor, paddingTop: top}}>
            <ScreenHeader {...props} />
          </View>
          <ScrollView
            refreshControl={
              props.onRefresh && (
                <RefreshControl
                  refreshing={props.isRefreshing ?? false}
                  onRefresh={props.onRefresh}
                  tintColor={theme.text.colors.primary}
                />
              )
            }
          >
            {props.children}
          </ScrollView>
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
