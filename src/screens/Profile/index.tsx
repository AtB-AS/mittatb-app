import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AddEditFavorite from './AddEditFavorite';
import Profile from './FavoriteList';
import ModalScreen from './AddEditFavorite/EmojiModal';

export type ProfileStackParams = {
  Profile: undefined;
  AddEditFavorite: undefined;
};

// export type RootStackParams = {
//   Main: undefined;
//   Modal: undefined;
// };

// const RootStack = createStackNavigator<RootStackParams>();
const Stack = createStackNavigator<ProfileStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Mitt AtB',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEditFavorite"
        component={AddEditFavorite}
        options={{
          title: 'Legg til favorittsted',
        }}
      />
    </Stack.Navigator>
  );
}

// export default function RootScreen() {
//   return (
//     <RootStack.Navigator mode="modal">
//       <RootStack.Screen
//         name="Main"
//         component={ProfileScreen}
//         options={{headerShown: false}}
//       />
//       <RootStack.Screen
//         name="Modal"
//         component={ModalScreen}
//         options={{headerShown: false}}
//       />
//     </RootStack.Navigator>
//   );
// }
