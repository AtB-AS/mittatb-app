import React, {useState} from 'react';
import {View, Text, StyleSheet, RefreshControl, TouchableOpacity, Modal, Button, SafeAreaView} from 'react-native';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../';
import {secondsToDuration} from '../../../utils/date';
import {ArrowRight} from '../../../assets/svg/icons/navigation';
import {Expand} from '../../../assets/svg/icons/navigation';
import {useTicketState} from '../TicketContext';
import Input from '../../../components/input';
import {FareContract, sendReceipt} from '../../../api/fareContracts';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Tickets'>;
};

interface ModalProps {
  fareContract?: FareContract;
  show: boolean;
  close: () => void;
}

const ReceiptModal: React.FC<ModalProps> = (props) => {
  const [email, setEmail] = useState('');
  const submit = async () => {
    if (props.fareContract) {
      sendReceipt(props.fareContract, email);
    }
    props.close();
  };
  return (
    <Modal visible={props.show} presentationStyle={'pageSheet'} animationType={'slide'}
    >
      <SafeAreaView style={styles.modalRoot}>
        <View style={styles.modalHeaderContainer}>
          <Text style={styles.heading}>Kvittering</Text>
        </View>
        <View>
          <Input onChangeText={email => setEmail(email)} keyboardType={'email-address'} label={'E-post'}/>
        </View>
        <View style={styles.modalButtonsContainer}>
          <Button title={'Send'} onPress={() => submit()}></Button>
          <Button title={'Avbryt'} onPress={() => props.close()}></Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const Tickets: React.FC<Props> = ({navigation}) => {
  const {fareContracts, isRefreshingTickets, refreshTickets} = useTicketState();
  const [selectedFareContract, setSelectedFareContract] = useState<FareContract | undefined>(undefined);
  const showReceiptModal = (f: FareContract) => {
    setSelectedFareContract(f);
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingTickets}
          onRefresh={refreshTickets}
        />
      }
    >
      <Text style={styles.heading}>Reiserettigheter</Text>
      {fareContracts && fareContracts.length ? (
        fareContracts.map((fc, i) => (
          <View key={i} style={styles.ticketContainer}>
            <View style={styles.ticketLineContainer}>
              <Text style={styles.textItem}>
                {secondsToDuration(fc.duration)} - {fc.product_name}
              </Text>
              <Expand/>
            </View>
            <Text style={styles.textItem}>1 voksen</Text>
            <Text style={styles.textItem}>Sone A</Text>
            <TouchableOpacity onPress={() => showReceiptModal(fc)}>
              <View style={styles.receiptContainer}>
                <Text style={styles.textItem}>Kvittering</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.body}>Du har ingen aktive reiserettigheter</Text>
      )}
      <ReceiptModal fareContract={selectedFareContract} show={!!selectedFareContract}
                    close={() => setSelectedFareContract(undefined)}></ReceiptModal>
      <TouchableHighlight
        onPress={() => navigation.push('Offer')}
        style={styles.button}
      >
        <View style={styles.buttonContentContainer}>
          <Text style={styles.buttonText}>Kjøp reiserett</Text>
          <ArrowRight fill="white" width={14} height={14}/>
        </View>
      </TouchableHighlight>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {fontSize: 16, paddingVertical: 24},
  button: {padding: 12, backgroundColor: 'black'},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  container: {padding: 24, backgroundColor: 'white', flex: 1},
  heading: {fontSize: 26, color: 'black', letterSpacing: 0.35},
  textItem: {fontSize: 16, paddingVertical: 4},
  ticketContainer: {
    marginVertical: 12,
    padding: 8,
    borderColor: 'black',
    borderWidth: 1,
  },
  ticketLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  receiptContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  modalRoot: {
    margin: 8,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default Tickets;
