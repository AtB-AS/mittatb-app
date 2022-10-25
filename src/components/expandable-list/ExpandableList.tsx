import {ActivityIndicator, View} from 'react-native';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {FlatList} from 'react-native-gesture-handler';
import SectionSeparator from '@atb/components/sections/section-separator';
import React, {useEffect, useState} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import ExpandableListTexts from '@atb/translations/components/ExpandableList';

type EstimatedListProps = {
  header: string;
  headerDesc?: string;
  data: any[];
  dataLimit?: number;
  renderItem: (data: any, index: number) => {};
  noDataText: string;
  onShowMore?: (data: any) => void;
  testID?: string;
  keyExtractor: (data: any, index: number) => string;
  shouldForceExpandList?: boolean;
};

export function ExpandableList({
  header,
  headerDesc,
  data,
  dataLimit,
  renderItem,
  noDataText,
  onShowMore,
  testID,
  keyExtractor,
  shouldForceExpandList,
}: EstimatedListProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (shouldForceExpandList) {
      setIsMinimized(false);
    }
  }, [shouldForceExpandList]);

  const {t} = useTranslation();
  const styles = useStyles();

  const shouldShowMoreItems =
    !isMinimized && dataLimit && data.length > dataLimit && onShowMore;

  return (
    <View testID={testID}>
      <Sections.Section withFullPadding>
        <Sections.GenericClickableItem
          type="inline"
          onPress={() => {
            setIsMinimized(!isMinimized);
          }}
          accessibilityHint={
            isMinimized
              ? t(ExpandableListTexts.a11yExpand)
              : t(ExpandableListTexts.a11yMinimize)
          }
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <ThemeText
                type="body__secondary--bold"
                color="secondary"
                style={styles.rightMargin}
                testID={testID + 'Name'}
              >
                {header}
              </ThemeText>
              <ThemeText
                style={styles.rightMargin}
                type="body__secondary"
                color="secondary"
                testID={testID + 'Description'}
              >
                {headerDesc}
              </ThemeText>
            </View>
            <ThemeIcon svg={isMinimized ? ExpandMore : ExpandLess} />
          </View>
        </Sections.GenericClickableItem>
        {!isMinimized && renderItem && (
          <FlatList
            ItemSeparatorComponent={SectionSeparator}
            data={data && data.slice(0, dataLimit)}
            renderItem={({item, index}) => (
              <Sections.GenericItem
                radius={shouldShowMoreItems ? undefined : 'bottom'}
                testID={testID + 'expandableItem' + index}
              >
                <View style={{flex: 1}}>{renderItem(item, index)}</View>
              </Sections.GenericItem>
            )}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <>
                {data && (
                  <Sections.GenericItem radius={'bottom'}>
                    <ThemeText
                      color="secondary"
                      type="body__secondary"
                      style={{textAlign: 'center', width: '100%'}}
                    >
                      {noDataText}
                    </ThemeText>
                  </Sections.GenericItem>
                )}
              </>
            }
          />
        )}
        {!data && !isMinimized && (
          <Sections.GenericItem>
            <View style={{width: '100%'}}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </Sections.GenericItem>
        )}
        {shouldShowMoreItems && (
          <Sections.LinkItem
            icon="arrow-right"
            text={header}
            textType="body__primary--bold"
            onPress={onShowMore}
            accessibility={{
              accessibilityHint: t(ExpandableListTexts.a11yMoreData),
            }}
            testID={'ShowMoreItems'}
          ></Sections.LinkItem>
        )}
      </Sections.Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
  },
  headerText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  rightMargin: {
    marginRight: theme.spacings.medium,
  },
}));
