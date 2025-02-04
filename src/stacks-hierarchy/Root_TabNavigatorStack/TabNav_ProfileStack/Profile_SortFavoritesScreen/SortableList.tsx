import {ExpandMore, ExpandLess} from '@atb/assets/svg/mono-icons/navigation';
import {screenReaderPause} from '@atb/components/text';
import {
  SectionItemProps,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FavoriteIcon, LocationFavorite, UserFavorites} from '@atb/favorites';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {immutableMove} from './sort-utils';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type SortableListFallbackProps = {
  data: UserFavorites;
  onSort: (newData: UserFavorites) => void;
};

export function SortableList({data, onSort}: SortableListFallbackProps) {
  const styles = useListStyle();
  const length = data.length;

  const resort = useCallback(
    (change: Changeset) => {
      const from = change.index;
      const to = change.index + (change.direction == 'down' ? 1 : -1);
      const newData = immutableMove(data, from, to);
      onSort(newData);
    },
    [data, onSort],
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
    margin: theme.spacing.medium,
  },
  item: {
    marginBottom: theme.spacing.medium,
  },
  moveIcon: {
    paddingHorizontal: theme.spacing.small,
  },
}));

const name = (item: LocationFavorite) => item.name ?? item.location.label;

type ItemProps = SectionItemProps<{
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
      <View importantForAccessibility="no-hide-descendants">
        <FavoriteIcon favorite={item} />
      </View>
      <ThemeText typography="body__primary" style={contentContainer}>
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
  const {theme} = useThemeContext();

  if (index === 0 && !isDown) {
    return (
      <View style={styles.moveIcon}>
        <ThemeIcon svg={Icon} color="disabled" />
      </View>
    );
  }

  if (index === length - 1 && isDown) {
    return (
      <View style={styles.moveIcon}>
        <ThemeIcon svg={Icon} color="disabled" />
      </View>
    );
  }

  return (
    <PressableOpacity
      onPress={() => onPress({item, direction, index, length})}
      accessibilityRole="button"
      accessible
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={styles.moveIcon}
      hitSlop={insets.symmetric(theme.spacing.small, theme.spacing.xSmall)}
      testID={direction}
    >
      <ThemeIcon svg={Icon} />
    </PressableOpacity>
  );
}
