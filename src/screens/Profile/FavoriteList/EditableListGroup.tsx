import React from 'react';
import {View, Text as RNText} from 'react-native';
import {StyleSheet, Theme} from '../../../theme';
import SectionHeader from '../../../components/section-header';
import ThemeText from '../../../components/text';

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
      {renderAddButtonComponent && renderAddButtonComponent()}

      <View style={css.listSection}>
        {!data?.length ? (
          <ThemeText style={css.empty}>
            Du har ingen favorittsteder. Legg til et nå.
          </ThemeText>
        ) : (
          data.map((item, index) => (
            <View key={keyExtractor(item, index)}>{renderItem(item)}</View>
          ))
        )}
      </View>
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  textGroup: {
    padding: theme.spacings.medium,
    flex: 1,
  },
  listSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  empty: {
    fontSize: 12,
    marginTop: 20,
  },
}));
