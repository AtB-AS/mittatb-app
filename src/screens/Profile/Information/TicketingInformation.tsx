import {Linking, TouchableOpacity, View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {InformationTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import ThemeText from '@atb/components/text';

export default function TicketingInformation() {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(InformationTexts.ticketing.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText>{t(InformationTexts.ticketing.texts.part1Text)}</ThemeText>
        <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
          {t(InformationTexts.ticketing.texts.part2Heading)}
        </ThemeText>
        <ThemeText>{t(InformationTexts.ticketing.texts.part2Text)}</ThemeText>
        <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
          {t(InformationTexts.ticketing.texts.part3Heading)}
        </ThemeText>

        <PriceTable />
        <ThemeText>{t(InformationTexts.ticketing.texts.part3Text)}</ThemeText>
        <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
          {t(InformationTexts.ticketing.texts.part4Heading)}
        </ThemeText>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(t(InformationTexts.ticketing.texts.part4Link.url))
          }
          accessibilityRole="button"
        >
          <ThemeText type="body__primary--underline">
            {t(InformationTexts.ticketing.texts.part4Link.text)}
          </ThemeText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const PriceTable = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableRow}>
        <Cell
          size="large"
          text={t(InformationTexts.ticketing.texts.part3Table.row1Label)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row1Value1)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row1Value2)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row1Value3)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row1Value4)}
          last={true}
        />
      </View>
      <View style={styles.tableRow}>
        <Cell
          size="large"
          text={t(InformationTexts.ticketing.texts.part3Table.row2Label)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row2Value1)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row2Value2)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row2Value3)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row2Value4)}
          last={true}
        />
      </View>
      <View style={styles.tableRow}>
        <Cell
          size="large"
          text={t(InformationTexts.ticketing.texts.part3Table.row3Label)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row3Value1)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row3Value2)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row3Value3)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row3Value4)}
          last={true}
        />
      </View>
      <View style={styles.tableRow}>
        <Cell
          size="large"
          bottom={true}
          text={t(InformationTexts.ticketing.texts.part3Table.row4Label)}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row4Value1)}
          bottom={true}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row4Value2)}
          bottom={true}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row4Value3)}
          bottom={true}
        />
        <Cell
          text={t(InformationTexts.ticketing.texts.part3Table.row4Value4)}
          bottom={true}
          last={true}
        />
      </View>
    </View>
  );
};

const Cell = ({
  text,
  size = 'small',
  last = false,
  bottom = false,
}: {
  text: string;
  size?: 'small' | 'large';
  last?: boolean;
  bottom?: boolean;
}) => {
  const styles = useStyles();
  return (
    <View
      style={{
        ...styles.tableCell,
        width: size === 'small' ? '12%' : '52%',
        borderRightWidth: last ? 1 : 0,
        borderBottomWidth: bottom ? 1 : 0,
      }}
    >
      <ThemeText style={{textAlign: size === 'small' ? 'center' : undefined}}>
        {text}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  content: {
    padding: theme.spacings.medium,
  },
  paragraphHeading: {
    marginVertical: theme.spacings.medium,
  },
  tableContainer: {marginBottom: theme.spacings.medium},
  tableRow: {flex: 1, flexDirection: 'row'},
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: theme.spacings.xSmall,
  },
}));
