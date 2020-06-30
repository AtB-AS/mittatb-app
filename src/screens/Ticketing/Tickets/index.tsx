import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../';
import {secondsToDuration} from '../../../utils/date';
import {ArrowRight} from '../../../assets/svg/icons/navigation';
import {Expand} from '../../../assets/svg/icons/navigation';
import {useTicketState} from '../TicketContext';
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
    <Modal
      visible={props.show}
      presentationStyle={'pageSheet'}
      animationType={'slide'}
    >
      <View style={styles.modalRoot}>
        <View style={styles.modalHeaderContainer}>
          <Text style={styles.heading}>Kvittering</Text>
        </View>
        <View style={{marginVertical: 8}}>
          <TextInput
            style={styles.modalInput}
            onChangeText={(email) => setEmail(email)}
            keyboardType={'email-address'}
            placeholder={'E-post'}
          />
        </View>
        <View style={styles.modalButtonsContainer}>
          <TouchableHighlight onPress={() => submit()} style={styles.button}>
            <View style={styles.buttonContentContainer}>
              <Text style={styles.buttonText}>Send</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => props.close()}
            style={styles.button}
          >
            <View style={styles.buttonContentContainer}>
              <Text style={styles.buttonText}>Avbryt</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const Tickets: React.FC<Props> = ({navigation}) => {
  const {fareContracts, isRefreshingTickets, refreshTickets} = useTicketState();
  const [selectedFareContract, setSelectedFareContract] = useState<
    FareContract | undefined
  >(undefined);
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
                {secondsToDuration(fc.usage_valid_to - fc.usage_valid_from)} -{' '}
                {fc.product_name}
              </Text>
              <Expand />
            </View>
            <Text style={styles.textItem}>
              {fc.user_profiles.length > 1
                ? `${fc.user_profiles.length} Voksne`
                : `1 Voksen`}
            </Text>
            <Text style={styles.textItem}>Sone A</Text>
            <View style={styles.receiptContainer}>
              <Text style={styles.textItem}>Ordre-ID: {fc.order_id}</Text>
              <TouchableOpacity onPress={() => showReceiptModal(fc)}>
                <Text style={styles.textItem}>Kvittering</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.body}>Du har ingen aktive reiserettigheter</Text>
      )}
      <ReceiptModal
        fareContract={selectedFareContract}
        show={!!selectedFareContract}
        close={() => setSelectedFareContract(undefined)}
      />
      <TouchableHighlight
        onPress={() => navigation.push('Offer')}
        style={styles.button}
      >
        <View style={styles.buttonContentContainer}>
          <Text style={styles.buttonText}>Kjøp reiserett</Text>
          <ArrowRight fill="white" width={14} height={14} />
        </View>
      </TouchableHighlight>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {fontSize: 16, paddingVertical: 24},
  button: {padding: 12, backgroundColor: 'black', marginRight: 8},
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
    justifyContent: 'space-between',
  },
  modalRoot: {
    margin: 8,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
  },
  modalInput: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
  },
});

export default Tickets;
