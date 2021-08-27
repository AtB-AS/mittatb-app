import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {CreditCard, Vipps} from '@atb/assets/svg/icons/ticketing';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import Button from '@atb/components/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import { ActionItem } from '@atb/components/sections';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import { useEffect } from 'react';
import { borderRadius } from '@atb-as/theme';
import { ArrowRight } from '@atb/assets/svg/icons/navigation';
import { themeColor } from '@atb/screens/Onboarding/WelcomeScreen';
import { PaymentOptionType } from '../index';
import OptionalNextDayLabel from '@atb/components/optional-day-header';
import { Confirm } from '@atb/assets/svg/icons/actions';


type Props = {
  onSelect: (value: PaymentOptionType) => void;
  options: Array<PaymentOptionType>;
};

const SelectCreditCard: React.FC<Props> = ({onSelect, options}) => {
  const {t, language} = useTranslation();
  const [selectedOption, setSelectedOption] = useState<PaymentOptionType>();
  const styles = useStyles();
  const {theme} = useTheme();

  useEffect(() => {
    console.log('selected option', selectedOption)
  }, [selectedOption])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 24,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
        }}>Velg betalingsmåte</Text>
      </View>
      <FlatList
        data={options}
        keyExtractor={item => item.type}
        renderItem={({ item }) => {
          return (
            <PaymentOption
              key={item.type}
              option={item}
              selected={selectedOption?.type === item.type}
              onSelect={(val: PaymentOptionType) => {
                console.log('hello?')
                setSelectedOption(val)
              }}
            ></PaymentOption>
          )
        }}
      ></FlatList>
      <Button
        style={{
          marginTop: 6
        }}
        color='primary_2'
        text="Til betaling"
        onPress={() => {
          if (selectedOption) {
            onSelect(selectedOption)
          }
        }}
        disabled={!selectedOption}
        icon={ArrowRight}
        iconPosition='right'
      ></Button>
    </SafeAreaView>
  )
};

type PaymentOptionsProps = {
  option: PaymentOptionType;
  selected: boolean;
  onSelect: (value: PaymentOptionType) => void;
}

const PaymentOption: React.FC<PaymentOptionsProps> = ({option, selected, onSelect, ...props}) => {
  const { theme } = useTheme();
  const[ save, setSave ] = useState<boolean>(option.save ?? false)

  function getIcon(type: string) {
    switch (type) {
      case 'VIPPS':
        return null
      case 'MASTERCARD':
        return null
      case 'VISA':
        return null
      default:
        return null;
    }
  }

  function select() {
    onSelect(Object.assign({}, option, {
      save: save
    }))
  }

  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      marginVertical: 6,
      padding: 24,
      backgroundColor: theme.colors.background_0.backgroundColor,
      borderRadius: 8,
    }}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        accessibilityHint={option.accessibilityHint}
        onPress={select}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            marginRight: 12,
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            backgroundColor: selected ? theme.colors.primary_2.backgroundColor : theme.colors.background_0.backgroundColor,
            borderColor: theme.colors.primary_2.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {
              selected ?
                <View style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: theme.colors.background_0.backgroundColor,
                }} />
                : null
            }
          </View>
          <Text>{option.description}</Text>
        </View>
        {getIcon(option.type)}
      </TouchableOpacity>
      {selected && !option.id && option.type !== 'VIPPS' ? (
        <View>
          <Text style={{
            paddingTop: 18,
            opacity: 0.6,
          }}>Lagre bankkortet for fremtidige betalinger?</Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flex: 1,
              flexDirection: 'row',
              paddingTop: 6,
            }}
            onPress={() => {
              setSave(!save)
              select()
            }}
          >
            <View style={{
              marginRight: 12,
              height: 24,
              width: 24,
              borderRadius: 4,
              borderWidth: 2,
              backgroundColor: save ? theme.colors.primary_2.backgroundColor : theme.colors.background_0.backgroundColor,
              borderColor: theme.colors.primary_2.backgroundColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {
                save ?
                  <Confirm fill='white'></Confirm>
                  : null
              }
            </View>
            <Text>Lagre kort</Text>
          </TouchableOpacity>
        </View>
      ) : null }
    </View>
  )
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
    paddingHorizontal: 12
  },
  paymentButton: {
    marginTop: theme.spacings.medium,
  },
}));

export default SelectCreditCard