import * as Sections from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {useTranslation} from '@atb/translations';
import {Expand, ExpandLess} from '@atb/assets/svg/icons/navigation';
import {EstimatedCall, Quay} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import EstimatedCallItem from './EstimatedCallItem';
import SectionSeparator from '@atb/components/sections/section-separator';

type QuaySectionProps = {
  quay: Quay;
  isSelected: boolean;
  data: EstimatedCall[] | null;
  navigateToQuay: (arg0: Quay) => void;
  navigateToDetails: (
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
};

export default function QuaySection({
  quay,
  isSelected,
  data,
  navigateToQuay,
  navigateToDetails,
}: QuaySectionProps): JSX.Element {
  const [isHidden, setIsHidden] = useState(false);
  const styles = useStyles();
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();

  return (
    <View>
      <Sections.Section withPadding>
        <Sections.GenericClickableItem
          type="inline"
          onPress={() => {
            setIsHidden(!isHidden);
          }}
          accessibilityHint={
            isHidden
              ? t(DeparturesTexts.quaySection.a11yExpand)
              : t(DeparturesTexts.quaySection.a11yMinimize)
          }
        >
          <View style={styles.stopPlaceHeader}>
            <View style={styles.stopPlaceHeaderText}>
              <ThemeText
                type="body__secondary--bold"
                color="secondary"
                style={styles.rightMargin}
              >
                {quay.publicCode
                  ? quay.name + ' ' + quay.publicCode
                  : quay.name}
              </ThemeText>
              {!!quay.description && (
                <ThemeText
                  style={styles.rightMargin}
                  type="body__secondary"
                  color="secondary"
                >
                  {quay.description}
                </ThemeText>
              )}
            </View>
            <ThemeIcon svg={isHidden ? Expand : ExpandLess}></ThemeIcon>
          </View>
        </Sections.GenericClickableItem>
        {!isHidden && (
          <FlatList
            ItemSeparatorComponent={SectionSeparator}
            data={departures}
            renderItem={({item, index}) => (
              <Sections.GenericItem
                radius={
                  isSelected && index === departures.length - 1
                    ? 'bottom'
                    : undefined
                }
              >
                <EstimatedCallItem
                  departure={item}
                  navigateToDetails={navigateToDetails}
                ></EstimatedCallItem>
              </Sections.GenericItem>
            )}
            keyExtractor={(item) => item.serviceJourney?.id || ''}
            ListEmptyComponent={
              <>
                {data && (
                  <Sections.GenericItem
                    radius={isSelected ? 'bottom' : undefined}
                  >
                    <ThemeText color="secondary">
                      {t(DeparturesTexts.noDepartures)}
                    </ThemeText>
                  </Sections.GenericItem>
                )}
              </>
            }
          />
        )}
        {!data && (
          <Sections.GenericItem>
            <View style={{width: '100%'}}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </Sections.GenericItem>
        )}
        {!isSelected && !isHidden && (
          <Sections.LinkItem
            icon="arrow-right"
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            textType="body__primary--bold"
            onPress={() => navigateToQuay(quay)}
            accessibility={{
              accessibilityHint: t(DeparturesTexts.quaySection.a11yToQuayHint),
            }}
          ></Sections.LinkItem>
        )}
      </Sections.Section>
    </View>
  );
}

function getDeparturesForQuay(
  departures: EstimatedCall[] | null,
  quay: Quay,
): EstimatedCall[] {
  if (!departures) return [];
  return departures.filter(
    (departure) => departure && departure.quay?.id === quay.id,
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  stopPlaceHeader: {
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
  },
  stopPlaceHeaderText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  rightMargin: {
    marginRight: theme.spacings.medium,
  },
}));
