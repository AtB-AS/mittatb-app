import {FlatList, TouchableOpacity, View, ViewStyle} from 'react-native';
import {LocationFavorite, UserFavorites} from '../../../favorites/types';
import {
  useSectionItem,
  SectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import React, {useCallback} from 'react';
import ThemeText from '../../../components/text';
import {FavoriteIcon} from '../../../favorites';
import {Expand, ExpandLess} from '../../../assets/svg/icons/navigation';
import ThemeIcon from '../../../components/theme-icon';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import insets from '../../../utils/insets';
import {immutableMove} from './sort-utils';

type SortableListFallbackProps = {
  data: UserFavorites;
  onSort: (newData: UserFavorites) => void;
};

export default function SortableListFallback({
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
      renderItem={(obj) => <Item {...obj} onPress={resort} length={length} />}
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
  moveIconEmpty: {
    opacity: 0,
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
      style={[
        styles.item,
        sectionStyles.baseItem,
        sectionStyles.spaceBetween,
        topContainer,
      ]}
    >
      <FavoriteIcon favorite={item} />
      <ThemeText type="body" style={contentContainer}>
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
  const Icon = isDown ? Expand : ExpandLess;
  const diretion = isDown ? 'ned' : 'opp';
  const label = `Flytt ${diretion}`;
  const hint = `Aktivér for å flytt ${name(item)} ${diretion}`;
  const styles = useListStyle();
  const {theme} = useTheme();

  if (index === 0 && !isDown) {
    return null;
  }

  if (index === length - 1 && isDown) {
    return (
      <View style={[styles.moveIcon, styles.moveIconEmpty]}>
        <Icon />
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
    >
      <ThemeIcon svg={Icon} />
    </TouchableOpacity>
  );
}
