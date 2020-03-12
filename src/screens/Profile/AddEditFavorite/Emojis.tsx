// Based on https://github.com/arronhunt/react-native-emoji-selector
// MIT License - Copyright © 2019 Arron Hunt <arronjhunt@gmail.com>

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
  TouchableOpacityProps,
  LayoutChangeEvent,
} from 'react-native';
import emojiRawData, {Emojis, Emoji} from 'emoji-datasource';

const Categories: {[key: string]: string} = {
  emotion: 'Smileys & Emotion',
  people: 'People & Body',
  nature: 'Animals & Nature',
  food: 'Food & Drink',
  activities: 'Activities',
  places: 'Travel & Places',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
};

const charFromUtf16 = (utf16: string) =>
  String.fromCodePoint(...(utf16.split('-').map(u => '0x' + u) as any));
export const charFromEmojiObject = (obj: Emoji) => charFromUtf16(obj.unified);
// const filteredRawEmojis = emojiRawData.filter(e => !e.obsoleted_by);
const sortEmoji = (list: Emojis) =>
  list.sort((a, b) => a.sort_order - b.sort_order);
const filterEmojiOnVersion = (src: Emojis, version?: string) => {
  if (!version) return src;
  const versionNumber = parseInt(version, 10);
  return src.filter(emoji => parseInt(emoji.added_in, 10) <= versionNumber);
};

const emojiByCategory = (category: string) =>
  emojiRawData.filter(e => e.category === category);
const categoryKeys = Object.keys(Categories);

type EmojiCellProps = {
  emoji: Emoji;
  colSize: number;
} & TouchableOpacityProps;

const EmojiCell = ({emoji, colSize, ...other}: EmojiCellProps) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={{
      width: colSize,
      height: colSize,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    {...other}
  >
    <Text style={{color: '#000000', fontSize: colSize - 12}}>
      {charFromEmojiObject(emoji)}
    </Text>
  </TouchableOpacity>
);

type EmojiSelectorState = {
  searchQuery: string;
  isReady: boolean;
  emojiList: Emojis;
  colSize: number;
  width: number;
};

type EmojiSelectorProps = {
  onEmojiSelected?(emoji: string): void;
  theme?: string;
  columns?: number;
  placeholder?: string;
  maxEmojiVersion?: string;
};

type DefaultProps = {
  onEmojiSelected(emoji: string): void;
  columns: number;
  placeholder: string;
};

export default class EmojiSelector extends Component<
  EmojiSelectorProps,
  EmojiSelectorState
> {
  state = {
    searchQuery: '',
    isReady: false,
    emojiList: [] as Emojis,
    colSize: 0,
    width: 0,
  };

  static defaultProps: DefaultProps = {
    onEmojiSelected: () => {},
    columns: 6,
    placeholder: 'Search',
  };

  handleSearch = (searchQuery: string) => {
    this.setState({searchQuery});
  };

  handleEmojiSelect = (emoji: Emoji) => {
    this.props.onEmojiSelected!(charFromEmojiObject(emoji));
  };

  renderEmojiCell = ({item}: {item: Emoji}) => (
    <EmojiCell
      key={item.unified}
      emoji={item}
      onPress={() => this.handleEmojiSelect(item)}
      colSize={this.state.colSize}
    />
  );

  returnSectionData(): Emojis {
    const {emojiList, searchQuery} = this.state;
    if (searchQuery === '') {
      return emojiList;
    }

    return emojiList.filter(e => {
      let display = false;
      e.short_names.forEach(name => {
        if (name.includes(searchQuery.toLowerCase())) display = true;
      });
      return display;
    });
  }

  prerenderEmojis(callback: () => void) {
    let emojiList: Emojis = categoryKeys
      .map((category: string) =>
        sortEmoji(
          filterEmojiOnVersion(
            emojiByCategory(Categories[category]),
            this.props.maxEmojiVersion,
          ),
        ),
      )
      .reduce((acc, item) => acc.concat(item), []);

    this.setState(
      {
        emojiList,
        colSize: Math.floor(this.state.width / this.props.columns!),
      },
      callback,
    );
  }

  handleLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    this.setState({width: layout.width}, () => {
      this.prerenderEmojis(() => {
        this.setState({isReady: true});
      });
    });
  };

  render() {
    const {theme, columns = 6, placeholder = 'Search', ...other} = this.props;
    const {colSize, isReady, searchQuery} = this.state;

    return (
      <View style={styles.frame} {...other} onLayout={this.handleLayout}>
        <View style={{flex: 1}}>
          <View style={styles.searchbar_container}>
            <TextInput
              style={styles.search}
              placeholder={placeholder}
              clearButtonMode="always"
              returnKeyType="done"
              autoCorrect={false}
              underlineColorAndroid={theme}
              value={searchQuery}
              onChangeText={this.handleSearch}
            />
          </View>

          {isReady ? (
            <View style={{flex: 1}}>
              <View style={styles.container}>
                <FlatList
                  style={styles.scrollview}
                  contentContainerStyle={{paddingBottom: colSize}}
                  data={this.returnSectionData()}
                  renderItem={this.renderEmojiCell}
                  horizontal={false}
                  numColumns={columns}
                  keyboardShouldPersistTaps={'always'}
                  keyExtractor={(item: Emoji) => item.unified}
                  removeClippedSubviews
                />
              </View>
            </View>
          ) : (
            <View style={styles.loader} {...other}>
              <ActivityIndicator
                size={'large'}
                color={Platform.OS === 'android' ? theme : '#000000'}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
  },
  scrollview: {
    flex: 1,
  },
  searchbar_container: {
    width: '100%',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  search: {
    ...Platform.select({
      ios: {
        height: 36,
        paddingLeft: 8,
        borderRadius: 10,
        backgroundColor: '#E5E8E9',
      },
    }),
    margin: 8,
  },
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: '100%',
    color: '#8F8F8F',
  },
});
