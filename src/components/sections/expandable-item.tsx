import React, {useState} from 'react';
import {AccessibilityProps, TouchableOpacity, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {NavigationIcon} from '@atb/components/theme-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

import {animateNextChange} from '@atb/utils/animation';

type Props = SectionItem<{
  text: string;
  expandContent: React.ReactNode;
  showIconText: boolean;
  initiallyExpanded?: boolean;
  accessibility?: AccessibilityProps;
}>;

export default function ExpandableItem({
  text,
  expandContent,
  showIconText,
  initiallyExpanded = false,
  accessibility,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useStyles();

  const [expanded, setExpanded] = useState(initiallyExpanded);

  const onPress = () => {
    animateNextChange();
    setExpanded(!expanded);
  };

  return (
    <View style={topContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={sectionStyle.spaceBetween}
        accessibilityRole="switch"
        accessibilityState={{
          expanded,
        }}
        {...accessibility}
      >
        <ThemeText style={contentContainer}>{text}</ThemeText>
        <ExpandIcon expanded={expanded} showText={showIconText} />
      </TouchableOpacity>
      {expanded && <View style={styles.expandContent}>{expandContent}</View>}
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
      ? t(SectionTexts.actionItem.headingExpand.toggle.contract)
      : t(SectionTexts.actionItem.headingExpand.toggle.expand)
    : undefined;
  const icon = expanded ? 'expand-less' : 'expand-more';
  return (
    <View style={styles.expandIcon}>
      {text && (
        <ThemeText style={styles.expandIcon__text} type="body__secondary">
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
    marginRight: theme.spacings.xSmall,
  },
  expandContent: {
    marginTop: theme.spacings.medium,
  },
}));
