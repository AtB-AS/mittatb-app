import React from 'react';
import {Switch, TouchableOpacity, View} from 'react-native';
import {Confirm} from '../../assets/svg/icons/actions';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';
import NavigationIcon from '../theme-icon/navigation-icon';
import useListStyle from './style';

export type ActionModes = 'check' | 'toggle' | 'heading-expand';
export type ActionItemProps = {
  text: string;
  onPress?(checked: boolean): void;
  checked?: boolean;
  mode?: ActionModes;
};
export default function ActionItem({
  text,
  onPress,
  mode = 'check',
  checked = false,
}: ActionItemProps) {
  const style = useListStyle();

  if (mode === 'toggle') {
    return (
      <View style={[style.baseItem, style.action]}>
        <ThemeText type="body">{text}</ThemeText>
        <Switch value={checked} onValueChange={(v) => onPress?.(v)} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress?.(!checked)}
      style={[style.baseItem, style.action]}
    >
      <ThemeText
        type={mode === 'heading-expand' ? 'paragraphHeadline' : 'body'}
      >
        {text}
      </ThemeText>
      <ActionModeIcon mode={mode} checked={checked} />
    </TouchableOpacity>
  );
}

function ActionModeIcon({
  mode,
  checked,
}: Pick<ActionItemProps, 'mode' | 'checked'>) {
  const style = useListStyle();

  switch (mode) {
    case 'check': {
      if (checked) {
        return <ThemeIcon svg={Confirm} />;
      } else {
        return null;
      }
    }
    case 'heading-expand': {
      const text = checked ? 'Skjul' : 'Vis';
      const icon = checked ? 'expand-less' : 'expand-more';
      return (
        <View style={style.headerExpandIconGroup}>
          <ThemeText style={style.headerExpandIconGroup__text} type="lead">
            {text}
          </ThemeText>
          <NavigationIcon mode={icon} />
        </View>
      );
    }
  }
  return null;
}
