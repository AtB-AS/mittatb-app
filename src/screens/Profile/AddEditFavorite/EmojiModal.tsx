import React from 'react';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../../navigation';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CancelCrossIcon from '../../../assets/svg/CancelCrossIcon';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';

type ModalScreenNavigationProp = StackNavigationProp<
  RootStackParams,
  'EmojiModal'
>;
type ModalScreenRouteProp = RouteProp<RootStackParams, 'EmojiModal'>;

type ModalScreenProps = {
  navigation: ModalScreenNavigationProp;
  route: ModalScreenRouteProp;
};

export default function ModalScreen({navigation, route}: ModalScreenProps) {
  const css = useScreenStyle();
  const {theme} = useTheme();

  return (
    <SafeAreaView style={css.outer}>
      <View style={css.closeHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CancelCrossIcon />
        </TouchableOpacity>
        <View style={css.textContainer}>
          <Text style={css.text}>Velg symbol</Text>
        </View>
      </View>
      <View style={css.emojis}>
        <EmojiSelector
          showSearchBar={true}
          showTabs={false}
          showHistory={true}
          showSectionTitles={false}
          category={Categories.all}
          onEmojiSelected={(emoji: string) => {
            route.params.onEmojiSelected(emoji);
            navigation.goBack();
          }}
          placeholder="Søk etter symbol"
          theme={theme.background.accent}
          searchBarStyle={{
            backgroundColor: theme.background.accent,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const useScreenStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  outer: {
    flex: 1,
    backgroundColor: theme.background.accent,
  },
  closeHeader: {
    paddingStart: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    backgroundColor: theme.background.accent,
  },
  textContainer: {
    flex: 1,
    marginRight: 30,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  emojis: {
    flex: 1,
    justifySelf: 'flex-end',
    backgroundColor: theme.background.primary,
  },
}));
