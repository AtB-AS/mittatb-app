import React from 'react';
import {Switch, TouchableOpacity, View} from 'react-native';
import {Confirm} from '../../assets/svg/icons/actions';
import {StyleSheet, Theme} from '../../theme';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';
import NavigationIcon from '../theme-icon/navigation-icon';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';

export type ActionModes = 'check' | 'toggle' | 'heading-expand';
export type ActionItemProps = SectionItem<{
  text: string;
  onPress?(checked: boolean): void;
  checked?: boolean;
  mode?: ActionModes;
}>;
export default function ActionItem({
  text,
  onPress,
  mode = 'check',
  checked = false,
  ...props
}: ActionItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  if (mode === 'toggle') {
    return (
      <View style={[style.spaceBetween, topContainer]}>
        <ThemeText type="body" style={contentContainer}>
          {text}
        </ThemeText>
        <Switch value={checked} onValueChange={(v) => onPress?.(v)} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress?.(!checked)}
      style={[style.spaceBetween, topContainer]}
    >
      <ThemeText
        type={mode === 'heading-expand' ? 'paragraphHeadline' : 'body'}
        style={contentContainer}
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
  const style = useHeaderExpandStyle();

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

const useHeaderExpandStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  headerExpandIconGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerExpandIconGroup__text: {
    marginRight: theme.spacings.xSmall,
  },
}));
