import * as React from 'react';
import {StyleSheet, useTheme} from '../../theme';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {View, TouchableOpacity, AccessibilityProperties} from 'react-native';
import {useState, useRef, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import Button from '../../components/button';
import {Close} from '../../assets/svg/icons/actions';
import {formatToClock, formatToLongDateTime} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import subDays from 'date-fns/subDays';
import insets from '../../utils/insets';
import {screenReaderPause} from '../../components/accessible-text';
import ThemeIcon from '../../components/theme-icon';
import ThemeText from '../../components/text';

type DateTypesWithoutNow = 'departure' | 'arrival';
type DateTypes = DateTypesWithoutNow | 'now';
export type DateOutput =
  | {
      date: Date;
      type: DateTypesWithoutNow;
    }
  | {
      type: 'now';
    };

type DateInputProps = {
  onDateSelected(value: DateOutput): void;
  value?: DateOutput;
  timeOfLastSearch?: Date;
};
const now = (): DateOutput => ({
  type: 'now',
});

function dateTypeToText(type: DateTypes): string {
  switch (type) {
    case 'arrival':
      return 'Ankomst';
    case 'departure':
      return 'Avreise';
    case 'now':
    default:
      return 'Nå';
  }
}

function dateToText(date: DateOutput, timeOfSearch: Date): string {
  if (date.type === 'now') {
    return `Avreise nå (${formatToClock(timeOfSearch)})`;
  }

  if (date.type === 'arrival') {
    return `Ankomst ${formatToLongDateTime(date.date, nb)}`;
  }

  return `Avreise ${formatToLongDateTime(date.date, nb)}`;
}

const DateTypeButton: React.FC<
  {
    type: DateTypes;
    selected: DateTypes;
    onPress(type: DateTypes): void;
  } & AccessibilityProperties
> = ({type, selected, onPress, ...props}) => {
  const style = useStyle();
  const isSelected = type === selected;

  return (
    <View
      style={[
        style.dateTypeButton,
        isSelected ? style.dateTypeButtonSelected : undefined,
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(type)}
        hitSlop={insets.symmetric(12, 8)}
        {...props}
      >
        <ThemeText type="paragraphHeadline">{dateTypeToText(type)}</ThemeText>
      </TouchableOpacity>
    </View>
  );
};

const DateInput: React.FC<DateInputProps> = ({
  onDateSelected,
  value,
  timeOfLastSearch = new Date(),
}) => {
  const style = useStyle();
  const {theme} = useTheme();
  const valueOrDefault = value ?? now();
  const [dateObjectInternal, setDateObjectInternal] = useState<DateOutput>(
    valueOrDefault,
  );
  useEffect(() => {
    if (!value) {
      setDateObjectInternal(now());
    } else {
      setDateObjectInternal(value);
    }
  }, [value]);

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClose = () => {
    modalizeRef.current?.close();
  };

  const onChange = (date: Date) => {
    if (dateObjectInternal.type === 'now') {
      setDateObjectInternal({
        date,
        type: 'departure',
      });
    } else {
      setDateObjectInternal({
        date,
        type: dateObjectInternal.type,
      });
    }
  };

  const setNow = () => {
    setDateObjectInternal(now());
  };

  const setType = (type: DateTypesWithoutNow) => {
    setDateObjectInternal({
      date: dateOrDefault(dateObjectInternal),
      type,
    });
  };

  const onSave = () => {
    onDateSelected(dateObjectInternal);
    onClose();
  };

  const searchValue = dateToText(valueOrDefault, timeOfLastSearch);

  return (
    <>
      <Button
        accessible={true}
        accessibilityLabel={'Velg tidspunkt.' + screenReaderPause}
        accessibilityValue={{
          text: searchValue + ' er valgt.' + screenReaderPause,
        }}
        accessibilityHint={
          'Aktiver for å velge tidspunkt og dato.' + screenReaderPause
        }
        accessibilityRole="button"
        text={searchValue}
        onPress={onOpen}
        mode="primary4"
      />

      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
          tapGestureEnabled={false}
        >
          <View style={style.container}>
            <View style={style.header}>
              <View style={style.headerTextContainer}>
                <ThemeText type="paragraphHeadline">Velg tidspunkt</ThemeText>
              </View>
              <TouchableOpacity onPress={onClose}>
                <ThemeIcon svg={Close} />
              </TouchableOpacity>
            </View>

            <View style={style.options}>
              <DateTypeButton
                onPress={setNow}
                type="now"
                selected={dateObjectInternal.type}
                accessible={true}
                accessibilityLabel="Sett avreisetidspunkt til nå"
                accessibilityRole="button"
              />
              <DateTypeButton
                onPress={setType}
                type="departure"
                selected={dateObjectInternal.type}
                accessible={true}
                accessibilityLabel="Velg avreisetidspunkt"
                accessibilityRole="button"
              />
              <DateTypeButton
                onPress={setType}
                type="arrival"
                selected={dateObjectInternal.type}
                accessible={true}
                accessibilityLabel="Velg ankomststidspunkt"
                accessibilityRole="button"
              />
            </View>

            <View style={style.dateContainer}>
              <DatePicker
                minimumDate={yesterday()}
                date={dateOrDefault(dateObjectInternal)}
                onDateChange={onChange}
                locale="nb"
                fadeToColor={theme.background.level0}
                textColor={theme.text.colors.primary}
              />
            </View>

            <Button
              accessible={true}
              accessibilityLabel="Søk etter reiser med nåværende valgte tidspunkt"
              accessibilityRole="search"
              onPress={onSave}
              text="Søk etter reiser"
            />
          </View>
        </Modalize>
      </Portal>
    </>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level0,
  },
  dateContainer: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
    paddingBottom: theme.spacings.medium,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.spacings.medium,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: theme.spacings.large,
    alignItems: 'center',
  },
  dateTypeButton: {
    paddingBottom: 4,
    marginHorizontal: 6,
  },
  dateTypeButtonSelected: {
    borderBottomColor: theme.text.colors.focus,
    borderBottomWidth: 2,
  },
}));

function dateOrDefault(dateObject: DateOutput) {
  if (dateObject.type === 'now') {
    return new Date();
  }
  return dateObject.date;
}

function yesterday() {
  return subDays(new Date(), 1);
}

export default DateInput;
