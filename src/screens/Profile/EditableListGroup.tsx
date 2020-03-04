import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet, Theme} from '../../theme';

const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  textGroup: {
    padding: theme.sizes.pagePadding,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  headerDecorator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.text.primary,
    flex: 1,
    marginBottom: 3,
  },
  headerText: {
    backgroundColor: theme.background.primary,
    paddingEnd: 10,
    fontSize: 12,
    lineHeight: 16,
  },
  listSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export type ListRenderItem<ItemT> = (item: ItemT) => React.ReactElement | null;

type EditableListGroupProps<ItemT> = {
  title: string;
  data?: ReadonlyArray<ItemT>;
  renderItem: ListRenderItem<ItemT>;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderAddButton?(): void;
};
export default function EditableListGroup<T>({
  data,
  title,
  renderItem,
  keyExtractor = (_: T, i: number) => String(i),
  renderAddButton,
}: EditableListGroupProps<T>): React.ReactElement<
  EditableListGroupProps<T>
> | null {
  const css = useProfileStyle();

  if (!data) return null;

  return (
    <View style={css.textGroup}>
      <View style={css.header}>
        <Text style={css.headerText}>{title}</Text>
        <View style={css.headerDecorator}></View>
      </View>
      <View style={css.listSection}>
        {data.map((item, index) => (
          <View key={keyExtractor(item, index)}>{renderItem(item)}</View>
        ))}
      </View>
      {renderAddButton && renderAddButton()}
    </View>
  );
}
