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

type Props = RootStackScreenProps<'Root_TicketInformationScreen'>;

export const Root_TicketInformationScreen = (props: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
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
        {preassignedFareProduct.productDescription && (
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
            </Section>
          </>
        )}
      </ScrollView>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_2.background,
    padding: theme.spacings.medium,
  },
  descriptionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
  },
}));
