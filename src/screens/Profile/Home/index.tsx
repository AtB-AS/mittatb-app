import {PRIVACY_POLICY_URL} from '@env';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';
import useChatIcon from '../../../chat/use-chat-icon';
import * as Sections from '../../../components/sections';
import ThemeIcon from '../../../components/theme-icon';
import {TabNavigatorParams} from '../../../navigation/TabNavigator';
import FullScreenHeader from '../../../ScreenHeader/full-header';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
import {StyleSheet, Theme} from '../../../theme';
import {useNavigateHome} from '../../../utils/navigation';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'ProfileHome'
>;

type ProfileNearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TabNavigatorParams, 'Profile'>,
  ProfileScreenNavigationProp
>;

type ProfileScreenProps = {
  navigation: ProfileNearbyScreenNavigationProp;
};

export default function ProfileHome({navigation}: ProfileScreenProps) {
  const navigateHome = useNavigateHome();
  const chatIcon = useChatIcon();
  const style = useProfileHomeStyle();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title="Mitt AtB"
        leftButton={{
          icon: <ThemeIcon svg={LogoOutline} />,
          onPress: navigateHome,
          accessibilityLabel: 'Gå til startskjerm',
        }}
        rightButton={chatIcon}
      />

      <ScrollView>
        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem text="Innstillinger" mode="subheading" />
          <Sections.LinkItem
            text="Startside"
            icon="arrow-right"
            onPress={() => navigation.navigate('SelectStartScreen')}
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.HeaderItem text="Favoritter" mode="subheading" />
          <Sections.LinkItem
            text="Steder"
            icon="arrow-right"
            onPress={() => navigation.navigate('FavoriteList')}
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.HeaderItem text="Personvern" mode="subheading" />
          <Sections.LinkItem
            text="Personvernerklæring"
            icon="arrow-right"
            accessibility={{
              accessibilityHint:
                'Aktivér for å lese personvernerklæring på ekstern side',
            }}
            onPress={() =>
              Linking.openURL(PRIVACY_POLICY_URL ?? 'https://www.atb.no')
            }
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
}));
