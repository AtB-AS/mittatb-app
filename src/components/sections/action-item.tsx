import React, {useEffect, useState} from 'react';
import {
  AccessibilityProps,
  AccessibilityRole,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import {Confirm} from '@atb/assets/svg/icons/actions';
import {StyleSheet, Theme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import NavigationIcon from '@atb/components/theme-icon/navigation-icon';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';
import InternalLabeledItem from './internals/internal-labeled-item';

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
  const [checkedState, setCheckedState] = useState(checked);

  function useDelay(ms: number) {
    const [gate, setGate] = useState(false);
    useEffect(() => {
      setTimeout(() => {
        setGate(true);
      }, ms);
    });
    return gate;
  }

  // A bug in RN borks Switch animations when Switch is used inside react navigation
  // A small delay to render seems to mitigate the bug
  const delayRender = useDelay(10);

  if (mode === 'toggle') {
    return (
      <>
        {delayRender && (
          <InternalLabeledItem label={text} accessibleLabel={false} {...props}>
            <Switch
              value={checkedState}
              onValueChange={(value) => handleValueChange(value)}
              accessibilityLabel={text}
              {...accessibility}
            />
          </InternalLabeledItem>
        )}
      </>
    );
  }

  function handleValueChange(value: boolean) {
    setCheckedState(value);
    onPress?.(value);
  }

  const role: AccessibilityRole = mode === 'check' ? 'radio' : 'switch';
  const stateName = mode === 'check' ? 'selected' : 'expanded';

  return (
    <TouchableOpacity
      onPress={() => onPress?.(!checked)}
      style={[style.spaceBetween, topContainer]}
      accessibilityRole={role}
      accessibilityState={{
        [stateName]: checked,
      }}
      {...accessibility}
    >
      <ThemeText
        type={
          mode === 'heading-expand' ? 'body__primary--bold' : 'body__primary'
        }
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
          <ThemeText
            style={style.headerExpandIconGroup__text}
            type="body__secondary"
          >
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
