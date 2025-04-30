import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {ScrollView, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {TransportationIconBoxList} from '@atb/components/icon-box';
import {ContentHeading} from '@atb/components/heading';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {TipsAndInformation} from './tips-and-information/TipsAndInformation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {MobilitySingleBenefitInfoSectionItem} from '@atb/mobility/components/MobilitySingleBenefitInfoSectionItem';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = RootStackScreenProps<'Root_TicketInformationScreen'>;

export const Root_TicketInformationScreen = (props: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfigurationContext();
  const {isTipsAndInformationEnabled} = useFeatureTogglesContext();
  const {benefits} = useOperatorBenefitsForFareProduct(
    props.route.params.preassignedFareProductId,
  );

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (f) => f.type === props.route.params.fareProductTypeConfigType,
  );
  const preassignedFareProduct = preassignedFareProducts.find(
    (p) => p.id === props.route.params.preassignedFareProductId,
  );

  return (
    <FullScreenView
      headerProps={{
        title: t(
          PurchaseOverviewTexts.ticketInformation.informationDetails.title,
        ),
        leftButton: {type: 'close'},
      }}
      contentColor={themeColor}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {preassignedFareProduct?.productDescription && (
          <>
            <ContentHeading
              color={themeColor}
              text={t(
                PurchaseOverviewTexts.ticketInformation.informationDetails
                  .descriptionHeading,
              )}
            />
            <Section>
              <GenericSectionItem>
                <View style={styles.descriptionContainer}>
                  {fareProductTypeConfig && (
                    <View style={styles.descriptionHeading}>
                      <TransportationIconBoxList
                        iconSize="xSmall"
                        modes={fareProductTypeConfig?.transportModes}
                      />
                      <ThemeText typography="body__primary--bold">
                        {getTextForLanguage(
                          fareProductTypeConfig.name,
                          language,
                        )}
                      </ThemeText>
                    </View>
                  )}
                  <ThemeText typography="body__secondary" isMarkdown={true}>
                    {getTextForLanguage(
                      preassignedFareProduct.productDescription,
                      language,
                    )}
                  </ThemeText>
                </View>
              </GenericSectionItem>
              {benefits?.map((b) => (
                <MobilitySingleBenefitInfoSectionItem benefit={b} key={b.id} />
              ))}
            </Section>
          </>
        )}
        {isTipsAndInformationEnabled && (
          <>
            <ContentHeading
              color={themeColor}
              text={t(
                PurchaseOverviewTexts.ticketInformation.informationDetails
                  .tipsInformation,
              )}
            />
            <TipsAndInformation />
          </>
        )}
      </ScrollView>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
      rowGap: theme.spacing.small,
    },
    descriptionContainer: {
      flex: 1,
    },
    descriptionHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.small,
      flexShrink: 1,
    },
  };
});
