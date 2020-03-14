import React, {useState} from 'react';
import {Text, View, TextStyle} from 'react-native';
import {
  TextInput,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {StyleSheet} from '../theme';
import InputSearchIcon from './svg/InputSearchIcon';
import colors from '../theme/colors';
import useDebounce from './useDebounce';
import {useGeocoder} from './useGeocoder';
import {Location} from '../favorites/types';
import {NavigationProp} from '@react-navigation/native';

type Props = {
  onSelectLocation: (location: Location) => void;
  navigation: NavigationProp<any>;
};

const LocationSearch: React.FC<Props> = ({onSelectLocation, navigation}) => {
  const styles = useThemeStyles();
  const [text, setText] = useState<string>('');
  const debouncedText = useDebounce(text, 200);
  const locations = useGeocoder(debouncedText, null);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adresse eller stoppested</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Søk etter adresse eller stoppested"
          autoCorrect={false}
          autoCompleteType="off"
          placeholderTextColor={(styles.placeholder as TextStyle).color}
        />
        <InputSearchIcon style={styles.searchIcon} />
      </View>
      {!locations && (
        <View style={styles.chipContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FavoriteChip text="Min posisjon" icon={<Text>🚀</Text>} />
            <FavoriteChip text="Hjem" icon={<Text>🏠</Text>} />
            <FavoriteChip text="Jobb" icon={<Text>👩🏻‍💻</Text>} />
          </ScrollView>
        </View>
      )}
      {!!locations && (
        <>
          <View style={styles.subHeader}>
            <Text style={styles.subLabel}>Søkeresultater</Text>
            <View style={styles.subBar} />
          </View>
          <FlatList
            data={locations}
            renderItem={({item}) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  onSelectLocation?.(item);
                  navigation.goBack();
                }}
                style={{padding: 12, marginVertical: 12}}
              >
                <Text>
                  <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                  <Text>, {item.locality}</Text>
                </Text>
              </TouchableWithoutFeedback>
            )}
          />
        </>
      )}
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  placeholder: {
    color: theme.text.faded,
  },
  inputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 44,
    backgroundColor: theme.background.primary,
    borderBottomWidth: 2,
    borderRadius: 4,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
  chipContainer: {
    marginBottom: 24,
    height: 44,
  },
  subHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  subLabel: {
    color: theme.text.faded,
    fontSize: 12,
    marginRight: 12,
  },
  subBar: {
    height: 12,
    flexGrow: 1,
    borderBottomColor: theme.text.faded,
    borderBottomWidth: 1,
  },
}));

type ChipProps = {
  text: string;
  icon: JSX.Element;
};

const FavoriteChip: React.FC<ChipProps> = ({text, icon}) => {
  return (
    <View style={chipStyles.container}>
      {icon}
      <Text style={chipStyles.text}>{text}</Text>
    </View>
  );
};

const chipStyles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: colors.secondary.cyan,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationSearch;
