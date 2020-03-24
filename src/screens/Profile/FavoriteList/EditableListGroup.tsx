import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet, Theme} from '../../../theme';
import SectionHeader from '../../../components/section-header';

export type ListRenderItem<ItemT> = (item: ItemT) => React.ReactElement | null;

type EditableListGroupProps<ItemT> = {
  title: string;
  data?: ReadonlyArray<ItemT>;
  renderItem: ListRenderItem<ItemT>;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderAddButtonComponent?: () => React.ReactElement | null;
};
export default function EditableListGroup<T>({
  data,
  title,
  renderItem,
  keyExtractor = (_: T, i: number) => String(i),
  renderAddButtonComponent,
}: EditableListGroupProps<T>): React.ReactElement<
  EditableListGroupProps<T>
> | null {
  const css = useProfileStyle();
  return (
    <View style={css.textGroup}>
      <SectionHeader>{title}</SectionHeader>
      <View style={css.listSection}>
        {!data?.length ? (
          <Text style={css.empty}>
            Du har ingen favorittsteder. Legg til en nå.
          </Text>
        ) : (
          data.map((item, index) => (
            <View key={keyExtractor(item, index)}>{renderItem(item)}</View>
          ))
        )}
      </View>
      {renderAddButtonComponent && renderAddButtonComponent()}
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  textGroup: {
    padding: theme.sizes.pagePadding,
    flex: 1,
  },
  listSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  empty: {
    fontSize: 16,
    marginTop: 20,
  },
}));
