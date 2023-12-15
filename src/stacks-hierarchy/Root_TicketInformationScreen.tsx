import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {SectionHeading} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/SectionHeading';
import {TransportationIconBoxList} from '@atb/components/icon-box';
import {useTipsAndInformationEnabled} from '@atb/tips-and-information/use-tips-and-information-enabled';

import React from 'react';
import {TipsAndInformation} from '@atb/tips-and-information';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {BenefitImage} from '@atb/mobility/components/BenefitImage';

type Props = RootStackScreenProps<'Root_TicketInformationScreen'>;

export const Root_TicketInformationScreen = (props: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
  const showTipsAndInformation = useTipsAndInformationEnabled();
  const {isLoading, benefits} = useOperatorBenefitsForFareProduct(
    props.route.params.preassignedFareProduct.id,
  );

  const fareProductTypeConfig = props.route.params.fareProductTypeConfig;
  const preassignedFareProduct = props.route.params.preassignedFareProduct;

  return (
    <FullScreenView
      headerProps={{
        title: t(
          PurchaseOverviewTexts.ticketInformation.informationDetails.title,
        ),
        leftButton: {type: 'close'},
      }}
    >
      <ScrollView style={styles.container}>
        {(preassignedFareProduct.productDescription || benefits.length > 0) && (
          <>
            <SectionHeading>
              {t(
                PurchaseOverviewTexts.ticketInformation.informationDetails
                  .descriptionHeading,
              )}
            </SectionHeading>
            <Section>
              <GenericSectionItem>
                <View style={styles.descriptionHeading}>
                  <TransportationIconBoxList
                    iconSize="small"
                    modes={fareProductTypeConfig.transportModes}
                  />
                  <ThemeText type="body__primary--bold">
                    {getTextForLanguage(fareProductTypeConfig.name, language)}
                  </ThemeText>
                </View>
                <ThemeText type="body__secondary" isMarkdown={true}>
                  {getTextForLanguage(
                    preassignedFareProduct.productDescription,
                    language,
                  )}
                </ThemeText>
              </GenericSectionItem>
              {!isLoading &&
                benefits.length > 0 &&
                benefits.map((b) => (
                  <GenericSectionItem key={b.formFactor + b.ticketDescription}>
                    <View style={styles.mobilityBenefit}>
                      <BenefitImage
                        formFactor={b.formFactor}
                        eligible={false}
                      />
                      <ThemeText
                        type="body__secondary"
                        style={styles.mobilityBenefitText}
                      >
                        {getTextForLanguage(b.ticketDescription, language)}
                      </ThemeText>
                    </View>
                  </GenericSectionItem>
                ))}
            </Section>
          </>
        )}

        {showTipsAndInformation && (
          <View style={styles.tipsAndInformation}>
            <SectionHeading>
              {t(
                PurchaseOverviewTexts.ticketInformation.informationDetails
                  .tipsInformation,
              )}
            </SectionHeading>
            <TipsAndInformation />
          </View>
        )}
      </ScrollView>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    padding: theme.spacings.medium,
  },
  descriptionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
  },
  tipsAndInformation: {
    marginTop: theme.spacings.medium,
  },
  mobilityBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.spacings.medium,
  },
  mobilityBenefitText: {
    flexShrink: 1,
  },
}));
