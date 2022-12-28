import {ExpandMore, ExpandLess} from '@atb/assets/svg/mono-icons/navigation';
import {screenReaderPause} from '@atb/components/text';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections/section-utils';
import {ThemeText} from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {FavoriteIcon} from '@atb/favorites';
import {LocationFavorite, UserFavorites} from '@atb/favorites/types';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import insets from '@atb/utils/insets';
import React, {useCallback} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {immutableMove} from './sort-utils';

type SortableListFallbackProps = {
  data: UserFavorites;
  onSort: (newData: UserFavorites) => void;
};

export default function SortableList({
  data,
  onSort,
}: SortableListFallbackProps) {
  const styles = useListStyle();
  const length = data.length;

  const resort = useCallback(
    (change: Changeset) => {
      const from = change.index;
      const to = change.index + (change.direction == 'down' ? 1 : -1);
      const newData = immutableMove(data, from, to);
      onSort(newData);
    },
    [data],
  );

  return (
    <FlatList
      data={data}
      contentContainerStyle={styles.container}
      renderItem={(obj) => (
        <Item
          {...obj}
          onPress={resort}
          length={length}
          testID={'favoriteItem' + obj.index}
        />
      )}
      keyExtractor={(item) => item.name + item.id}
    />
  );
}
const useListStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    margin: theme.spacings.medium,
  },
  item: {
    marginBottom: theme.spacings.medium,
  },
  moveIcon: {
    paddingHorizontal: theme.spacings.small,
  },
}));

const name = (item: LocationFavorite) => item.name ?? item.location.label;

type ItemProps = SectionItem<{
  item: LocationFavorite;
  index: number;
  length: number;
  onPress(ops: Changeset): void;
}>;
function Item(props: ItemProps) {
  const {contentContainer, topContainer} = useSectionItem({
    radius: 'top-bottom',
  });
  const {item} = props;
  const sectionStyles = useSectionStyle();
  const styles = useListStyle();

  return (
    <View
      style={[styles.item, sectionStyles.spaceBetween, topContainer]}
      testID={props.testID}
    >
      <View importantForAccessibility={'no-hide-descendants'}>
        <FavoriteIcon favorite={item} />
      </View>
      <ThemeText type="body__primary" style={contentContainer}>
        {name(item)}
      </ThemeText>
      <MoveIcon direction="up" {...props} />
      <MoveIcon direction="down" {...props} />
    </View>
  );
}

type Changeset = {
  item: LocationFavorite;
  index: number;
  length: number;
  direction: 'down' | 'up';
};

type MoveIconProps = Changeset & {
  onPress(ops: Changeset): void;
};

function MoveIcon({direction, item, index, length, onPress}: MoveIconProps) {
  const isDown = direction === 'down';
  const Icon = isDown ? ExpandMore : ExpandLess;
  const diretion = isDown ? 'ned' : 'opp';
  const label = `Flytt  ${name(item)} ${diretion} ${screenReaderPause}`;
  const hint = `Aktivér for å flytte favoritten  ${name(
    item,
  )} ${diretion} ${screenReaderPause}`;
  const styles = useListStyle();
  const {theme} = useTheme();

  if (index === 0 && !isDown) {
    return (
      <View style={styles.moveIcon}>
        <ThemeIcon svg={Icon} colorType={'disabled'} />
      </View>
    );
  }

  if (index === length - 1 && isDown) {
    return (
      <View style={styles.moveIcon}>
        <ThemeIcon svg={Icon} colorType={'disabled'} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress({item, direction, index, length})}
      accessibilityRole="button"
      accessible
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={styles.moveIcon}
      hitSlop={insets.symmetric(theme.spacings.small, theme.spacings.xSmall)}
      testID={direction}
    >
      <ThemeIcon svg={Icon} />
    </TouchableOpacity>
  );
}
