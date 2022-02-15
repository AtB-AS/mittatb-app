import {Theme} from '@atb-as/theme';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeText from '@atb/components/text';
import StyleSheet from '@atb/theme/StyleSheet';
import React from 'react';
import {Linking, ScrollView, TouchableOpacity, View} from 'react-native';

type Table = {
  type: 'table';
  data: TableElement[][];
};
type TableElement = TableData | TableHeading;

type TableData = {
  type: 'tableData';
  text: string;
};

type TableHeading = {
  type: 'tableHeading';
  text: string;
};

type InformationText = {
  type: 'text';
  text: string;
};
type InformationLink = {
  type: 'link';
  text: string;
  link: string;
};

type InformationHeading = {
  type: 'heading';
  text: string;
};

type InformationBulletPoint = {
  type: 'bullet-point';
  text: string;
};

type InformationProps = {
  informations: InformationElement[];
  title: string;
};

export type InformationElement =
  | Table
  | InformationText
  | InformationLink
  | InformationHeading
  | InformationBulletPoint;

const Info: React.FC<InformationProps> = ({
  children,
  title,
  informations,
  ...props
}) => {
  const styles = useStyles();

  const informationElements = informations.map((item) => {
    switch (item.type) {
      case 'heading':
        return <Header text={item.text}></Header>;
      case 'text':
        return <ThemeText>{item.text}</ThemeText>;
      case 'bullet-point':
        return (
          <ThemeText style={styles.bullet}>{`\u2022 ${item.text}`}</ThemeText>
        );
      case 'link':
        return <Link link={item}></Link>;
      case 'table':
        return <Table item={item}></Table>;
    }
  });
  return (
    <View style={styles.container}>
      <FullScreenHeader title={title} leftButton={{type: 'back'}} />
      <ScrollView contentContainerStyle={styles.content}>
        {informationElements}
      </ScrollView>
    </View>
  );
};

const Header = ({text}: {text: string}) => {
  const styles = useStyles();
  return (
    <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
      {text}
    </ThemeText>
  );
};

const Table = ({item}: {item: Table}) => {
  const styles = useStyles();
  const numberOfRows = item.data.length;
  const table = item.data.map((row, index) => {
    const isLastRow = index === numberOfRows - 1;
    return <Row isLastRow={isLastRow} row={row}></Row>;
  });
  return <View style={styles.tableContainer}>{table}</View>;
};

const Row = ({row, isLastRow}: {row: TableElement[]; isLastRow: boolean}) => {
  const styles = useStyles();
  const columnsInRow = row.length;
  const rowItems = row.map((rowItem, index) => {
    const isLastRowElement = index === columnsInRow - 1;
    switch (rowItem.type) {
      case 'tableHeading':
        return (
          <Cell
            size="large"
            text={rowItem.text}
            last={isLastRowElement}
            bottom={isLastRow}
          />
        );
      case 'tableData':
        return (
          <Cell
            text={rowItem.text}
            last={isLastRowElement}
            bottom={isLastRow}
          />
        );
    }
  });
  return <View style={styles.tableRow}>{rowItems}</View>;
};

const Link = ({link}: {link: InformationLink}) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={styles.link}
      onPress={() => Linking.openURL(link.link ?? '')}
      accessibilityRole="button"
    >
      <ThemeText type="body__primary--underline">{link.text}</ThemeText>
    </TouchableOpacity>
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
  bullet: {
    marginTop: theme.spacings.medium,
  },
  paragraphSpace: {
    marginTop: theme.spacings.medium,
  },
  link: {
    marginTop: theme.spacings.medium,
  },
  tableContainer: {marginBottom: theme.spacings.medium},
  tableRow: {flex: 1, flexDirection: 'row'},
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: theme.spacings.xSmall,
  },
}));

export default Info;
