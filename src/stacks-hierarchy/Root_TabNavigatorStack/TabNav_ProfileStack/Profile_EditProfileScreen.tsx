import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {Text, View} from 'react-native';
import {LinkSectionItem} from '@atb/components/sections';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {EditProfileTexts} from '@atb/translations/screens/subscreens/EditProfileScreen';
import {FullScreenView} from '@atb/components/screen-view';

type EditProfileScreenProps = ProfileScreenProps<'Profile_EditProfileScreen'>;
export const Profile_EditProfileScreen = ({
  navigation,
}: EditProfileScreenProps) => {
  const {t} = useTranslation();

  return (
    <View>
      {/*<FullScreenHeader*/}
      {/*  title={t(EditProfileTexts.header.title)}*/}
      {/*  leftButton={{type: 'back'}}*/}
      {/*/>*/}
      <FullScreenView
        headerProps={{
          title: 't(FavoriteDeparturesTexts.favoriteItemAdd.label)',
          leftButton: {type: 'back'},
        }}
        // parallaxContent={() => (
        //   <>
        //     <View style={{height: 500, backgroundColor: 'red'}}>
        //       <Text>{'Hello'}</Text>
        //     </View>
        //     <LinkSectionItem
        //       text={t(EditProfileTexts.deleteProfile)}
        //       onPress={() => navigation.navigate('Profile_DeleteProfileScreen')}
        //     />
        //   </>
        // )}
      >
        <>
          <View style={{height: 500, backgroundColor: 'red'}}>
            <Text>{'Hello'}</Text>
          </View>
          <LinkSectionItem
            text={t(EditProfileTexts.deleteProfile)}
            onPress={() => navigation.navigate('Profile_DeleteProfileScreen')}
          />
        </>
      </FullScreenView>
    </View>
  );
};
