import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Vipps} from '@atb/assets/svg/icons/ticketing';
import {StyleSheet, useTheme} from '@atb/theme';
import Button from '@atb/components/button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from '@atb/translations';
import {useState, useEffect} from 'react';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {PaymentOption as PaymentOptionType} from '@atb/preferences';
import {Confirm} from '@atb/assets/svg/icons/actions';
import {parseISO} from 'date-fns';
import VisaLogo from '@atb/assets/svg/icons/ticketing/cardproviders/Visa';
import MasterCardLogo from '@atb/assets/svg/icons/ticketing/cardproviders/MasterCard';

type Props = {
  onSelect: (value: PaymentOptionType) => void;
  options: Array<PaymentOptionType>;
};

const SelectCreditCard: React.FC<Props> = ({onSelect, options}) => {
  const {t, language} = useTranslation();
  const [selectedOption, setSelectedOption] = useState<PaymentOptionType>();
  const styles = useStyles();
  const {theme} = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          Velg betalingsmåte
        </Text>
      </View>
      <FlatList
        data={options}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item, index}) => {
          return (
            <PaymentOption
              key={item.type}
              option={item}
              selected={
                JSON.stringify({
                  type: selectedOption?.type,
                  id: selectedOption?.id,
                }) === JSON.stringify({type: item.type, id: item.id})
              }
              onSelect={(val: PaymentOptionType) => {
                setSelectedOption(val);
              }}
            ></PaymentOption>
          );
        }}
      ></FlatList>
      <Button
        style={{
          marginTop: 6,
        }}
        color="primary_2"
        text="Til betaling"
        onPress={() => {
          if (selectedOption) {
            onSelect(selectedOption);
          }
        }}
        disabled={!selectedOption}
        icon={ArrowRight}
        iconPosition="right"
      ></Button>
    </SafeAreaView>
  );
};

type PaymentOptionsProps = {
  option: PaymentOptionType;
  selected: boolean;
  onSelect: (value: PaymentOptionType) => void;
};

const PaymentOption: React.FC<PaymentOptionsProps> = ({
  option,
  selected,
  onSelect,
}) => {
  const {theme} = useTheme();
  const [save, setSave] = useState<boolean>(option.save ?? false);

  useEffect(() => {
    if (selected) {
      select();
    }
  }, [save]);

  function getIcon(type: number) {
    switch (type) {
      case 2:
        return Vipps;
      case 4:
        return MasterCardLogo();
      case 3 | 1:
        return VisaLogo();
      default:
        return null;
    }
  }

  function select() {
    onSelect(
      Object.assign({}, option, {
        save: save,
      }),
    );
  }

  function getExpireDate(iso: string): string {
    let date = parseISO(iso);
    if (date.getDate() === 1) {
      let sinceEpoc = date.getTime();
      sinceEpoc = sinceEpoc - 86400000;
      date = new Date(sinceEpoc);
    }
    let year = date.getFullYear();
    let month = date.getMonth();
    if (month === 0) {
      month = 12;
      year--;
    }
    return `${month < 10 ? '0' + month : month}/${year.toString().slice(2, 4)}`;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginVertical: 6,
        padding: 24,
        backgroundColor: theme.colors.background_0.backgroundColor,
        borderRadius: 8,
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        accessibilityHint={option.accessibilityHint}
        onPress={select}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              marginRight: 12,
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              backgroundColor: selected
                ? theme.colors.primary_2.backgroundColor
                : theme.colors.background_0.backgroundColor,
              borderColor: theme.colors.primary_2.backgroundColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selected ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: theme.colors.background_0.backgroundColor,
                }}
              />
            ) : null}
          </View>
          <Text>{option.description}</Text>
          {option.id ? (
            <Text
              style={{
                paddingLeft: 8,
              }}
            >
              **** {`${option.masked_pan}`}
            </Text>
          ) : null}
        </View>
        {option.id ? getIcon(option.type) : null}
      </TouchableOpacity>
      {selected && !option.id && option.type !== 2 ? (
        <View>
          <Text
            style={{
              paddingTop: 18,
              opacity: 0.6,
            }}
          >
            Lagre bankkortet for fremtidige betalinger?
          </Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flex: 1,
              flexDirection: 'row',
              paddingTop: 6,
            }}
            onPress={() => {
              setSave(!save);
            }}
          >
            <View
              style={{
                marginRight: 12,
                height: 24,
                width: 24,
                borderRadius: 4,
                borderWidth: 2,
                backgroundColor: save
                  ? theme.colors.primary_2.backgroundColor
                  : theme.colors.background_0.backgroundColor,
                borderColor: theme.colors.primary_2.backgroundColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {save ? <Confirm fill="white"></Confirm> : null}
            </View>
            <Text>Lagre kort</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {option.expires_at ? (
        <View>
          <Text
            style={{
              opacity: 0.6,
              paddingTop: 18,
              paddingLeft: 36,
            }}
          >
            {getExpireDate(option.expires_at)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
    paddingHorizontal: 12,
  },
  paymentButton: {
    marginTop: theme.spacings.medium,
  },
}));

export default SelectCreditCard;
