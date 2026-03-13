import {Checkbox} from '@atb/components/checkbox';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {RadioIcon} from '@atb/components/radio';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useState, ReactElement} from 'react';
import {StyleProp, View, ViewProps, ViewStyle} from 'react-native';

type BaseProps<T> = ViewProps & {
  items: T[];
  renderItem: (item: T, isSelected: boolean) => ReactElement | null;
  generateAccessibilityLabel?: (
    item: T,
    isSelected: boolean,
  ) => string | undefined;
  keyExtractor?: ((item: T, index: number) => string) | undefined;
  itemStyle?: StyleProp<ViewStyle>;
};

type SingleSelectProps<T> = BaseProps<T> & {
  mode: 'radio';
  onSelect: (selectedItem: T) => void;
};

type MultipleSelectProps<T> = BaseProps<T> & {
  mode: 'checkbox';
  onSelect: (selectedItems: T[]) => void;
};
type SelectGroupProps<T> = SingleSelectProps<T> | MultipleSelectProps<T>;

export const SelectGroup = <T,>(props: SelectGroupProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const {
    items,
    renderItem,
    generateAccessibilityLabel,
    keyExtractor,
    itemStyle,
  } = props;

  const multiple = props.mode === 'checkbox';

  const onItemSelect = (item: T) => {
    const newSelected = multiple
      ? selectedItems.includes(item)
        ? selectedItems.filter((it) => it !== item)
        : [...selectedItems, item]
      : [item];
    setSelectedItems(newSelected);
    props.mode === 'checkbox'
      ? props.onSelect(newSelected)
      : props.onSelect(newSelected[0]);
  };

  return (
    <View {...props} accessibilityRole={multiple ? 'combobox' : 'radiogroup'}>
      {items.map((item, i) => (
        <SelectItem
          style={itemStyle}
          item={item}
          selected={selectedItems.includes(item)}
          multiple={multiple}
          key={keyExtractor?.(item, i)}
          onSelect={onItemSelect}
          renderItem={renderItem}
          generateAccessibilityLabel={generateAccessibilityLabel}
        />
      ))}
    </View>
  );
};

type ItemProps<T> = {
  item: T;
  multiple: boolean;
  selected: boolean;
  onSelect: (item: T) => void;
  renderItem: (item: T, isSelected: boolean) => ReactElement | null;
  generateAccessibilityLabel?: (
    item: T,
    isSelected: boolean,
  ) => string | undefined;
  style?: StyleProp<ViewStyle>;
};
const SelectItem = <T,>({
  item,
  multiple,
  selected,
  onSelect,
  renderItem,
  generateAccessibilityLabel,
  style,
}: ItemProps<T>) => {
  const itemStyles = useItemStyles();
  const {theme} = useThemeContext();
  const background = theme.color.background.neutral[0].background;
  const selectedBackground = theme.color.interactive[2].active.background;
  const selectedBorder = theme.color.interactive[0].default.background;

  return (
    <View style={style ?? itemStyles.container}>
      <PressableOpacity
        style={{
          ...itemStyles.item,
          backgroundColor: selected ? selectedBackground : background,
          borderColor: selected ? selectedBorder : background,
        }}
        onPress={() => onSelect(item)}
        accessibilityRole={multiple ? 'checkbox' : 'radio'}
        accessibilityState={{selected: selected}}
        accessibilityLabel={
          generateAccessibilityLabel
            ? generateAccessibilityLabel(item, selected)
            : undefined
        }
      >
        {multiple ? (
          <Checkbox style={itemStyles.indicator} checked={selected} />
        ) : (
          <View style={itemStyles.indicator}>
            <RadioIcon
              checked={selected}
              color={theme.color.interactive[0].default.background}
            />
          </View>
        )}
        {renderItem(item, selected)}
      </PressableOpacity>
    </View>
  );
};

const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginBottom: theme.spacing.medium,
  },
  item: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
    borderWidth: 2,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.xLarge,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    marginRight: theme.spacing.medium,
  },
}));
