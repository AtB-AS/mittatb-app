import React, {useEffect, useState} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {NavigationIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';

import {animateNextChange} from '@atb/utils/animation';
import {TextNames} from '@atb/theme/colors';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {LabelType} from '@atb-as/config-specs';
import {LabelInfo} from '@atb/components/label-info';

type Props = SectionItemProps<
  {
    text: string;
    prefixNode?: React.ReactNode;
    suffixNode?: React.ReactNode;
    textType?: TextNames;
    label?: LabelType;
    showIconText?: boolean;
    testID?: string;
    accessibility?: AccessibilityProps;
  } & (
    | {
        initiallyExpanded?: boolean;
        expandContent: React.ReactNode;
        expanded?: boolean;
      }
    | {
        onPress(expanded: boolean): void;
        expanded: boolean;
      }
  )
>;

/**
 * Expandable section item, which both can be used as a controlled component
 * with the expanded state being maintained outside, or with the expanded state
 * encapsulated inside the component
 */
export function ExpandableSectionItem({
  text,
  prefixNode,
  suffixNode,
  textType,
  showIconText = false,
  label,
  accessibility,
  testID,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useStyles();
  const {t} = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(
    'expanded' in props ? props.expanded ?? false : !!props.initiallyExpanded,
  );

  useEffect(() => {
    if ('expanded' in props && props.expanded !== expanded) {
      animateNextChange();
      setExpanded(props.expanded ?? false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.expanded]);

  const onPress = () => {
    animateNextChange();
    setExpanded(!expanded);
    if ('onPress' in props) {
      props.onPress(!expanded);
    }
  };

  return (
    <View style={topContainer}>
      <PressableOpacity
        accessibilityHint={
          expanded
            ? t(SectionTexts.expandableSectionItem.a11yHint.contract)
            : t(SectionTexts.expandableSectionItem.a11yHint.expand)
        }
        accessibilityRole="button"
        accessibilityState={{
          expanded: expanded,
        }}
        onPress={onPress}
        style={sectionStyle.spaceBetween}
        testID={testID}
        {...accessibility}
      >
        {prefixNode}
        <ThemeText style={contentContainer} typography={textType}>
          {text}
        </ThemeText>
        {suffixNode}
        {label && <LabelInfo label={label} />}
        <ExpandIcon expanded={expanded} showText={showIconText} />
      </PressableOpacity>
      {expanded && 'expandContent' in props && (
        <View style={styles.expandContent}>{props.expandContent}</View>
      )}
    </View>
  );
}

function ExpandIcon({
  expanded,
  showText,
}: {
  expanded: boolean;
  showText: boolean;
}) {
  const styles = useStyles();
  const {t} = useTranslation();

  const text = showText
    ? expanded
      ? t(SectionTexts.expandableSectionItem.iconText.contract)
      : t(SectionTexts.expandableSectionItem.iconText.expand)
    : undefined;
  const icon = expanded ? 'expand-less' : 'expand-more';
  return (
    <View style={styles.expandIcon}>
      {text && (
        <ThemeText style={styles.expandIcon__text} typography="body__secondary">
          {text}
        </ThemeText>
      )}
      <NavigationIcon mode={icon} />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  expandIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandIcon__text: {
    marginRight: theme.spacing.xSmall,
  },
  expandContent: {
    marginTop: theme.spacing.medium,
  },
}));
