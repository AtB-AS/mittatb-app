import {PRIVACY_POLICY_URL} from '@env';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';
import useChatIcon from '../../../chat/use-chat-icon';
import List from '../../../components/item-groups';
import ThemeIcon from '../../../components/theme-icon';
import {TabNavigatorParams} from '../../../navigation/TabNavigator';
import FullScreenHeader from '../../../ScreenHeader/full-header';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
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

  return (
    <>
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
        <List.Group withTopMargin>
          <List.Header title="Favoritter" mode="subheading" />
          <List.Link
            text="Steder"
            icon="arrow-right"
            onPress={() => navigation.navigate('FavoriteList')}
          />
        </List.Group>

        <List.Group>
          <List.Header title="Personvern" mode="subheading" />
          <List.Link
            text="Personvernerklæring"
            icon="arrow-right"
            onPress={() =>
              Linking.openURL(PRIVACY_POLICY_URL ?? 'https://www.atb.no')
            }
          />
        </List.Group>
      </ScrollView>
    </>
  );
}
