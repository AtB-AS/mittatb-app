import React from 'react';
import {StyleSheet} from '../../theme';
import {
  View,
  TouchableOpacity,
  AccessibilityProperties,
  Modal,
} from 'react-native';
import {useState, useRef, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../components/button';
import {Close, Adjust} from '../../assets/svg/icons/actions';
import SearchButton from '../../components/search-button';
import {
  formatToClock,
  formatToLongDateTime,
  formatToSimpleDate,
  isSameDay,
  daysBetween,
} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import subDays from 'date-fns/subDays';
import insets from '../../utils/insets';
import {screenReaderPause} from '../../components/accessible-text';
import ThemeIcon from '../../components/theme-icon';
import ThemeText from '../../components/text';
import {Time, Calendar} from '../../assets/svg/icons/date';
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
  const valueOrDefault = value ?? now();
  const [dateObjectInternal, setDateObjectInternal] = useState<DateOutput>(
    valueOrDefault,
  );
  const [modalVisible, setModalVisibile] = useState<boolean>(false);
  useEffect(() => {
    if (!value) {
      setDateObjectInternal(now());
    } else {
      setDateObjectInternal(value);
    }
  }, [value]);
  const toggleModal = () => {
    setModalVisibile(!modalVisible);
  };

  const onChange = (date?: Date) => {
    if (!date) {
      return;
    }
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
    toggleModal();
  };

  const searchValue = dateToText(valueOrDefault, timeOfLastSearch);

  return (
    <>
      <SearchButton
        accessible={true}
        accessibilityLabel={'Velg tidspunkt.' + screenReaderPause}
        accessibilityValue={{
          text: searchValue + ' er valgt.' + screenReaderPause,
        }}
        accessibilityHint={
          'Aktiver for å velge tidspunkt og dato.' + screenReaderPause
        }
        accessibilityRole="button"
        title="Når"
        text={searchValue}
        onPress={toggleModal}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={style.container}>
          <View style={style.content}>
            <View style={style.header}>
              <View style={style.headerTextContainer}>
                <ThemeText type="paragraphHeadline">Velg tidspunkt</ThemeText>
              </View>
              <TouchableOpacity
                onPress={toggleModal}
                accessibilityLabel="Lukk"
                accessibilityRole="button"
              >
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
            <TimePicker
              dateTime={dateOrDefault(dateObjectInternal)}
              onChange={onChange}
            />

            <Button
              accessible={true}
              accessibilityLabel="Søk etter reiser med nåværende valgte tidspunkt"
              accessibilityRole="search"
              onPress={onSave}
              text="Søk etter reiser"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};
const useStyle = StyleSheet.createThemeHook((theme, name) => ({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    zIndex: 0,
    flex: 1,
  },
  content: {
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level0,
    borderTopLeftRadius: theme.border.borderRadius.regular,
    borderTopRightRadius: theme.border.borderRadius.regular,
  },
  header: {
    flexDirection: 'row',
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginBottom: theme.spacings.medium,
    paddingVertical: theme.spacings.small,
    flexDirection: 'row',
  },
  datePickerToggler: {
    backgroundColor: theme.input.secondary.bg,
    borderRadius: theme.border.borderRadius.regular,
    minHeight: theme.heights.field,
    marginHorizontal: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.medium,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  fieldIcon: {
    marginRight: theme.spacings.medium,
  },
  dateTypeButton: {
    paddingBottom: 4,
    marginHorizontal: 6,
  },
  dateTypeButtonSelected: {
    borderBottomColor: theme.background.accent,
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
type DateTimePickerProps = {
  dateTime: Date;
  onChange(date?: Date): void;
};
const TimePicker: React.FC<DateTimePickerProps> = ({dateTime, onChange}) => {
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);

  const style = useStyle();

  const toggleDate = () => setDateOpen(!dateOpen);
  const toggleTime = () => setTimeOpen(!timeOpen);

  const dateChanged = (e: Event, date: Date | undefined) => {
    setTimeOpen(false);
    setDateOpen(false);
    onChange(date);
  };

  return (
    <View style={style.dateContainer}>
      <TouchableOpacity style={style.datePickerToggler} onPress={toggleDate}>
        <ThemeIcon style={style.fieldIcon} svg={Calendar} />
        <ThemeText>{getHumanizedDate(dateTime)}</ThemeText>
      </TouchableOpacity>
      <TouchableOpacity style={style.datePickerToggler} onPress={toggleTime}>
        <ThemeIcon style={style.fieldIcon} svg={Time} />
        <ThemeText>{formatToClock(dateTime)}</ThemeText>
      </TouchableOpacity>

      {dateOpen && (
        <DateTimePicker
          minimumDate={yesterday()}
          value={dateTime}
          onChange={dateChanged}
          locale="nb"
          mode="datetime"
          display="spinner"
        />
      )}
      {timeOpen && (
        <DateTimePicker
          minimumDate={yesterday()}
          value={dateTime}
          onChange={dateChanged}
          locale="nb"
          mode="time"
          display="spinner"
        />
      )}
    </View>
  );
};

function getHumanizedDate(date: Date): string {
  const daysFromNow = daysBetween(new Date(), date);
  console.log(daysFromNow);
  switch (daysFromNow) {
    case 0:
      return 'I dag';
    case 1:
      return 'I morgen';
    default:
      return formatToSimpleDate(date);
  }
}

export default DateInput;
