import React from 'react';
import {AccessibilityProps, Switch, TouchableOpacity, View} from 'react-native';
import {Confirm} from '@atb/assets/svg/icons/actions';
import {StyleSheet, Theme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import ThemeIcon, {NavigationIcon} from '@atb/components/theme-icon';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';

export type ActionModes = 'check' | 'toggle' | 'heading-expand';
export type ActionItemProps = SectionItem<{
  text: string;
  onPress?(checked: boolean): void;
  checked?: boolean;
  mode?: ActionModes;
  accessibility?: AccessibilityProps;
}>;
export default function ActionItem({
  text,
  onPress,
  mode = 'check',
  checked = false,
  accessibility,
  ...props
}: ActionItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  if (mode === 'toggle') {
    return (
      <View style={[style.spaceBetween, topContainer]}>
        <ThemeText accessible={false} type="body" style={contentContainer}>
          {text}
        </ThemeText>
        <Switch
          value={checked}
          onValueChange={(v) => onPress?.(v)}
          accessibilityLabel={text}
          {...accessibility}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress?.(!checked)}
      style={[style.spaceBetween, topContainer]}
      accessibilityRole="switch"
      {...accessibility}
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
  const {t} = useTranslation();

  switch (mode) {
    case 'check': {
      if (checked) {
        return <ThemeIcon svg={Confirm} />;
      } else {
        return null;
      }
    }
    case 'heading-expand': {
      const text = checked
        ? t(SectionTexts.actionItem.headingExpand.toggle.contract)
        : t(SectionTexts.actionItem.headingExpand.toggle.expand);
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
