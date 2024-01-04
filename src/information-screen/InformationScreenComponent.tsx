import {Theme} from '@atb-as/theme';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme/StyleSheet';
import React from 'react';
import {Linking, View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

type InformationTable = {
  type: 'table';
  data: TableElement[][];
};

type TableData = {
  type: 'tableData';
  text: string;
};

type TableHeading = {
  type: 'tableHeading';
  text: string;
};

type TableElement = TableData | TableHeading;

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

export type InformationElement =
  | InformationTable
  | InformationText
  | InformationLink
  | InformationHeading
  | InformationBulletPoint;

type InformationProps = {
  informations: InformationElement[];
  title: string;
};

export const InformationScreenComponent: React.FC<InformationProps> = ({
  title,
  informations,
}) => {
  const styles = useStyles();

  const informationElements = informations.map((item, index) => {
    switch (item.type) {
      case 'heading':
        return <Header text={item.text} key={index} />;
      case 'text':
        return <ThemeText key={index}>{item.text}</ThemeText>;
      case 'bullet-point':
        return (
          <ThemeText
            style={styles.bullet}
            key={index}
          >{`\u2022 ${item.text}`}</ThemeText>
        );
      case 'link':
        return <Link link={item} key={index} />;
      case 'table':
        return <Table table={item} key={index} />;
    }
  });
  return (
    <FullScreenView
      headerProps={{
        title,
        leftButton: {type: 'close'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading text={title} ref={focusRef} />
      )}
    >
      <View style={styles.content}>{informationElements}</View>
    </FullScreenView>
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

const Table = ({table}: {table: InformationTable}) => {
  const styles = useStyles();
  const numberOfRows = table.data.length;
  const tableRows = table.data.map((row, index) => {
    const isLastRow = index === numberOfRows - 1;
    return <Row isLastRow={isLastRow} row={row} key={index} />;
  });
  return <View style={styles.tableContainer}>{tableRows}</View>;
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
            key={index}
            size="large"
            text={rowItem.text}
            last={isLastRowElement}
            bottom={isLastRow}
          />
        );
      case 'tableData':
        return (
          <Cell
            key={index}
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
    <PressableOpacity
      style={styles.link}
      onPress={() => Linking.openURL(link.link ?? '')}
      accessibilityRole="button"
    >
      <ThemeText type="body__primary--underline">{link.text}</ThemeText>
    </PressableOpacity>
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
  content: {
    padding: theme.spacings.medium,
  },
  paragraphHeading: {
    marginVertical: theme.spacings.medium,
  },
  bullet: {
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
