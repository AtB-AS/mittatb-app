/**
 * Based on https://github.com/staltz/react-native-emoji-picker-staltz
 * Copyright (c) 2016 Yonah Forst
 * Modifications: Copyright (c) 2020 Andre 'Staltz' Medeiros
 * MIT
 */
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import emoji from 'emoji-datasource';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';
import orderBy from 'lodash.orderby';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Platform,
  ScaledSize,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Header from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet/use-bottom-sheet';

// Polyfill for Android
require('string.fromcodepoint');

// Conversion of codepoints and surrogate pairs. See more here:
// https://mathiasbynens.be/notes/javascript-unicode
// https://mathiasbynens.be/notes/javascript-escapes#unicode-code-point
// and `String.fromCodePoint` on MDN
function charFromUtf16(utf16: string) {
  return String.fromCodePoint(
    ...(utf16.split('-').map((u) => '0x' + u) as any),
  );
}

function charFromEmojiObj(obj: any) {
  return charFromUtf16(obj.unified);
}

const blocklistedEmojis = ['white_frowning_face', 'keycap_star', 'eject'];

const filteredEmojis = emoji.filter((e: any) => {
  if (blocklistedEmojis.includes(e.short_name)) return false;
  if (Platform.OS === 'android') {
    if (e.added_in === '2.0') return true;
    if (e.added_in === '4.0') return Platform.Version >= 24;
    if (e.added_in === '5.0') return Platform.Version >= 26;
    if (e.added_in === '11.0') return Platform.Version >= 28;
    else return Platform.Version >= 29;
  } else {
    return true;
  }
});

// sort emojis by 'sort_order' then group them into categories
const groupedAndSorted = groupBy(
  orderBy(filteredEmojis, 'sort_order'),
  'category',
);

// convert the emoji object to a character
const emojisByCategory = mapValues(groupedAndSorted, (group: any) =>
  group.map(charFromEmojiObj),
);

type LocalizedCategories = [
  string, // Smileys & Emotion
  string, // People & Body
  string, // Animals & Nature
  string, // Food & Drink
  string, // Activities
  string, // Travel & Places
  string, // Objects
  string, // Symbols
  // string, // Flags
];

const CATEGORIES: LocalizedCategories = [
  'Smileys & Emotion',
  'People & Body',
  'Animals & Nature',
  'Food & Drink',
  'Activities',
  'Travel & Places',
  'Objects',
  'Symbols',
  // 'Flags',
  // TODO: Flags category has too many missing emojis in various configurations
  // of Android versions, and the data in emoji-datasource is not accurate
  // enough to filter them properly, so we're postponing the support for Flag
  // as reactions.
];

const DEFAULT_NUM_EMOJI = 8;
const PADDING = 5;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  headerText: {
    padding: theme.spacings.xSmall,
    color: theme.text.colors.primary,
    justifyContent: 'center',
    textAlignVertical: 'center',
  },

  categoryOuter: {
    margin: theme.spacings.medium,
  },
  categoryInner: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  clearButton: {
    padding: theme.spacings.medium,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
}));

const ClearButton: React.FC<{
  value: string | null;
  onEmojiSelected: (e: string | null) => void;
  clearButtonStyle?: ViewStyle;
  clearButtonText?: string;
}> = ({value, onEmojiSelected, clearButtonStyle, clearButtonText}) => {
  const styles = useStyles();
  if (!value) return null;
  return (
    <TouchableOpacity onPress={() => onEmojiSelected(null)}>
      <ThemeText
        type="body__primary"
        style={[styles.clearButton, clearButtonStyle]}
      >
        {clearButtonText ?? 'Fjern emoji'}
      </ThemeText>
    </TouchableOpacity>
  );
};

type EmojiCategory = {
  value: string | null;
  category: string;
  onEmojiSelected: (e: string | null) => void;
  numEmojis?: number;
  headerStyle?: TextStyle;
  localizedCategories?: LocalizedCategories;
  containerMargin?: number;
};
const EmojiCategory: React.FC<EmojiCategory> = ({
  category,
  numEmojis = DEFAULT_NUM_EMOJI,
  localizedCategories,
  headerStyle,
  onEmojiSelected,
  containerMargin = 12,
}) => {
  const emojis = emojisByCategory[category];
  const screenWidth = useScreenWidth();
  const size =
    (screenWidth - containerMargin - numEmojis * PADDING * 2) / numEmojis;

  const style = {
    fontSize: size,
    textAlign: 'center' as const,
    lineHeight: size + PADDING,
    padding: PADDING,
  };
  const categoryText = localizedCategories
    ? localizedCategories[CATEGORIES.indexOf(category)]
    : category;

  const styles = useStyles();

  return (
    <View style={styles.categoryOuter}>
      <ThemeText style={[styles.headerText, headerStyle]}>
        {categoryText}
      </ThemeText>
      <View style={styles.categoryInner}>
        {emojis?.map((e: string) => (
          <ThemeText style={style} key={e} onPress={() => onEmojiSelected(e)}>
            {e}
          </ThemeText>
        ))}
      </View>
    </View>
  );
};

type Props = Omit<EmojiCategory, 'category'> & {
  hideClearButton?: boolean;
  closeOnSelect?: boolean;
  clearButtonStyle?: ViewStyle;
  clearButtonText?: string;
  value: string | null;
  close: () => void;
};
const EmojiPicker = ({
  value,
  onEmojiSelected,
  hideClearButton,
  closeOnSelect,
  close,
  ...props
}: Props) => {
  const onClick = (emoji: string | null) => {
    onEmojiSelected(emoji);
    if (closeOnSelect) {
      close();
    }
  };

  return (
    <BottomSheetContainer>
      <Header
        title={'Velg emoji'}
        leftButton={{type: 'cancel', onPress: close}}
        rightButton={{
          type: 'custom',
          text: 'Fjern emoji',
          onPress: () => onClick(null),
        }}
        color={'background_2'}
      />
      <ScrollView>
        {CATEGORIES.map((category) => (
          <EmojiCategory
            onEmojiSelected={onClick}
            key={category}
            category={category}
            value={value}
            {...props}
          />
        ))}
      </ScrollView>
    </BottomSheetContainer>
  );
};

export default EmojiPicker;

type CallbackType = {
  screen: ScaledSize;
};
const screen = Dimensions.get('screen');
function useScreenWidth() {
  const [width, setDimensions] = useState<number>(screen.width);

  const onChange = ({screen}: CallbackType) => {
    setDimensions(screen.width);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  });

  return width;
}
