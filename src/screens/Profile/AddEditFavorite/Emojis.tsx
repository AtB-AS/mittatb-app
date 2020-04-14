// Based on https://github.com/arronhunt/react-native-emoji-selector
// MIT License - Copyright © 2019 Arron Hunt <arronjhunt@gmail.com>

import React, {Component, ReactNode, ReactElement} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
  TouchableOpacityProps,
  LayoutChangeEvent,
} from 'react-native';
import emojiRawData, {Emojis, Emoji} from 'emoji-datasource';
import {StyleSheet, useTheme} from '../../../theme';

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

export type RenderedEmoji = Emoji & {
  renderedText: string;
};

type ClearItem = {clearItem: true};
const __CLEAR_ITEM: ClearItem = {clearItem: true};

const charFromUtf16 = (utf16: string) =>
  String.fromCodePoint(...(utf16.split('-').map((u) => '0x' + u) as any));
export const charFromEmojiObject = (obj: Emoji) => charFromUtf16(obj.unified);
const sortEmoji = (list: Emojis) =>
  list.sort((a, b) => a.sort_order - b.sort_order);
const filterEmojiOnVersion = (src: Emojis, version?: string) => {
  if (!version) return src;
  const versionNumber = parseInt(version, 10);
  return src.filter((emoji) => parseInt(emoji.added_in, 10) <= versionNumber);
};

const emojiByCategory = (category: string) =>
  emojiRawData.filter((e) => e.category === category);
const categoryKeys = Object.keys(Categories);

type EmojiCellProps = {
  emoji: RenderedEmoji;
  isSelected: boolean;
  colSize: number;
} & TouchableOpacityProps;

const EmojiCell = ({emoji, colSize, isSelected, ...other}: EmojiCellProps) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={{
      width: colSize,
      height: colSize,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isSelected ? 'rgba(0,0,0,0.1)' : undefined,
      borderRadius: 4,
    }}
    {...other}
  >
    <Text style={{color: '#000000', fontSize: colSize - 12}}>
      {emoji.renderedText}
    </Text>
  </TouchableOpacity>
);

type ClearCellProps = {
  clearText: ReactElement;
  colSize: number;
} & TouchableOpacityProps;

const ClearCell = ({clearText, colSize, ...other}: ClearCellProps) => (
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
    <Text style={{color: '#000000', fontSize: colSize - 12}}>{clearText}</Text>
  </TouchableOpacity>
);

type EmojiSelectorState = {
  searchQuery: string;
  isReady: boolean;
  emojiList: RenderedEmoji[];
  colSize: number;
  width: number;
};

type EmojiSelectorProps = {
  onEmojiSelected?(emoji?: RenderedEmoji): void;
  theme?: string;
  placeholderColor?: string;
  columns?: number;
  placeholder?: string;
  clearText?: ReactElement;
  value?: RenderedEmoji;
  maxEmojiVersion?: string;
};

type DefaultProps = {
  onEmojiSelected(emoji?: RenderedEmoji): void;
  columns: number;
  placeholder: string;
  clearText: ReactElement;
};

type StylesProps = ReturnType<typeof useEmojiPopupStyle>;

class EmojiSelector extends Component<
  EmojiSelectorProps & {styles: StylesProps},
  EmojiSelectorState
> {
  state = {
    searchQuery: '',
    isReady: false,
    emojiList: [] as RenderedEmoji[],
    colSize: 0,
    width: 0,
  };

  static defaultProps: DefaultProps = {
    onEmojiSelected: () => {},
    columns: 6,
    placeholder: 'Search',
    clearText: <Text>✖︎</Text>,
  };

  handleSearch = (searchQuery: string) => {
    this.setState({searchQuery});
  };

  handleEmojiSelect = (emoji?: RenderedEmoji) => {
    this.props.onEmojiSelected!(emoji);
  };

  renderEmojiCell = ({item}: {item: ClearItem | RenderedEmoji}) => {
    if (isClearItem(item)) {
      return (
        <ClearCell
          key={'clear-emoji'}
          clearText={this.props.clearText!}
          onPress={() => this.handleEmojiSelect(undefined)}
          colSize={this.state.colSize}
        />
      );
    }
    return (
      <EmojiCell
        key={item.unified}
        emoji={item}
        isSelected={item.unified === this.props.value?.unified}
        onPress={() => this.handleEmojiSelect(item)}
        colSize={this.state.colSize}
      />
    );
  };

  returnSectionData(): (ClearItem | RenderedEmoji)[] {
    const {emojiList, searchQuery} = this.state;

    if (searchQuery === '') {
      return [__CLEAR_ITEM, ...emojiList];
    }

    return emojiList.filter((e) => {
      let display = false;
      e.short_names.forEach((name) => {
        if (name.includes(searchQuery.toLowerCase())) display = true;
      });
      return display;
    });
  }

  prerenderEmojis(callback: () => void) {
    let emojiList: RenderedEmoji[] = categoryKeys
      .map((category: string) =>
        sortEmoji(
          filterEmojiOnVersion(
            emojiByCategory(Categories[category]),
            this.props.maxEmojiVersion,
          ),
        ),
      )
      .reduce((acc, item) => acc.concat(item), [])
      .map((item) => ({
        ...item,
        renderedText: charFromEmojiObject(item),
      }));

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
    const {
      theme,
      columns,
      placeholder,
      clearText,
      onEmojiSelected,
      placeholderColor,
      value,
      styles,
      ...other
    } = this.props;
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
              placeholderTextColor={placeholderColor}
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
                  keyExtractor={(item: ClearItem | RenderedEmoji) =>
                    isClearItem(item) ? 'clear' : item.unified
                  }
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

function EmojiSelectorWrapper(props: EmojiSelectorProps) {
  const styles = useEmojiPopupStyle();
  const {theme} = useTheme();
  return (
    <EmojiSelector
      placeholderColor={theme.text.faded}
      styles={styles}
      {...props}
    />
  );
}

export default EmojiSelectorWrapper;

const useEmojiPopupStyle = StyleSheet.createThemeHook((theme) => ({
  frame: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollview: {
    flex: 1,
  },
  searchbar_container: {
    width: '100%',
    zIndex: 1,
  },
  search: {
    backgroundColor: theme.background.primary,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
    borderBottomWidth: 2,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    margin: 8,
  },
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}));

function isClearItem(item: any): item is ClearItem {
  return item === __CLEAR_ITEM;
}
