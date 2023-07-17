import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {StopPlace} from '@atb/api/types/stopPlaces';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';

type StopPlaceSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlace;
  toHarbor?: StopPlace;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (params: Root_PurchaseHarborSearchScreenParams) => void;
  style?: StyleProp<ViewStyle>;
};

export const HarborSelection = forwardRef<
  TouchableOpacity,
  StopPlaceSelectionProps
>(
  (
    {
      fareProductTypeConfig,
      fromHarbor,
      toHarbor,
      preassignedFareProduct,
      onSelect,
      style,
    }: StopPlaceSelectionProps,
    harborInputSectionItemRef,
  ) => {
    const styles = useStyles();
    const {t} = useTranslation();

    return (
      <View style={style} accessible={false}>
        <ThemeText
          type="body__secondary"
          color="secondary"
          style={styles.sectionText}
          accessibilityLabel={t(
            PurchaseOverviewTexts.stopPlaces.harborSelection.select.a11yLabel,
          )}
        >
          {t(PurchaseOverviewTexts.stopPlaces.harborSelection.select.text)}
        </ThemeText>
        <Section accessible={false}>
          <GenericClickableSectionItem
            ref={harborInputSectionItemRef}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t(
              PurchaseOverviewTexts.stopPlaces.harborSelection.from.a11yLabel(
                fromHarbor?.name,
              ),
            )}
            accessibilityHint={t(
              PurchaseOverviewTexts.stopPlaces.harborSelection.from.a11yHint,
            )}
            onPress={() =>
              onSelect({
                fareProductTypeConfig,
                preassignedFareProduct,
              })
            }
            testID="selectHarborsButton"
          >
            <>
              <View style={styles.fromHarbor}>
                <ThemeText
                  color="secondary"
                  type="body__secondary"
                  style={styles.toFromLabel}
                >
                  {t(PurchaseOverviewTexts.fromToLabel.from)}
                </ThemeText>
                <HarborLabel harbor={fromHarbor} />
              </View>
            </>
          </GenericClickableSectionItem>
          <GenericClickableSectionItem
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t(
              PurchaseOverviewTexts.stopPlaces.harborSelection.to.a11yLabel(
                fromHarbor?.name,
              ),
            )}
            accessibilityHint={t(
              PurchaseOverviewTexts.stopPlaces.harborSelection.to.a11yHint,
            )}
            onPress={() =>
              fromHarbor &&
              onSelect({
                fromHarbor,
                fareProductTypeConfig,
                preassignedFareProduct,
              })
            }
            testID="selectHarborsButton"
          >
            <View style={styles.toHarbor}>
              <ThemeText
                color={!!fromHarbor ? 'secondary' : 'disabled'}
                type="body__secondary"
                style={styles.toFromLabel}
              >
                {t(PurchaseOverviewTexts.fromToLabel.to)}
              </ThemeText>
              <HarborLabel harbor={toHarbor} disabled={!fromHarbor} />
            </View>
          </GenericClickableSectionItem>
        </Section>
      </View>
    );
  },
);

const HarborLabel = ({
  harbor,
  disabled = false,
}: {
  harbor?: StopPlace;
  disabled?: boolean;
}) => {
  const harborName = harbor?.name;
  const {t} = useTranslation();
  return harborName ? (
    <ThemeText type="body__primary--bold">{harborName}</ThemeText>
  ) : (
    <ThemeText
      style={{flexShrink: 1}}
      color={disabled ? 'disabled' : 'primary'}
    >
      {t(PurchaseOverviewTexts.stopPlaces.harborSelection.noneSelected.text)}
    </ThemeText>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
  fromHarbor: {
    flexDirection: 'row',
  },
  toHarbor: {
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  toFromLabel: {
    minWidth: 40,
    marginRight: theme.spacings.small,
  },
}));
