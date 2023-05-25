import React, {useEffect, useState} from 'react';
import {AccessibilityProps, TouchableOpacity, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {NavigationIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';

import {animateNextChange} from '@atb/utils/animation';
import {TextNames} from '@atb/theme/colors';

type Props = SectionItemProps<
  {
    text: string;
    textType?: TextNames;
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
  textType,
  showIconText = false,
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
  }, [props.expanded]);

  const onPress = () => {
    animateNextChange();
    setExpanded(!expanded);
    if ('onPress' in props) {
      props.onPress(!expanded);
    }
  };

  return (
    <View
      style={topContainer}
      accessible={true}
      accessibilityLabel={text}
      accessibilityHint={
        expanded
          ? t(SectionTexts.expandableSectionItem.a11yHint.contract)
          : t(SectionTexts.expandableSectionItem.a11yHint.expand)
      }
      accessibilityRole="button"
      accessibilityState={{
        expanded: expanded,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={sectionStyle.spaceBetween}
        testID={testID}
        {...accessibility}
      >
        <ThemeText style={contentContainer} type={textType}>
          {text}
        </ThemeText>
        <ExpandIcon expanded={expanded} showText={showIconText} />
      </TouchableOpacity>
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
