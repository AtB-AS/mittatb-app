import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, TextInput} from 'react-native';
import {FareContractTicket, sendReceipt} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import Text from '../../../components/text';

interface ModalProps {
  fareContract?: FareContractTicket;
  show: boolean;
  close: () => void;
}

const ReceiptModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
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
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.modalButtonsContainer}>
          <TouchableOpacity onPress={() => submit()} style={styles.button}>
            <View style={styles.buttonContentContainer}>
              <Text style={styles.buttonText}>Send</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.close()} style={styles.button}>
            <View style={styles.buttonContentContainer}>
              <Text style={styles.buttonText}>Avbryt</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  button: {padding: 12, backgroundColor: 'black', marginRight: 8},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  heading: {fontSize: 26, color: 'black', letterSpacing: 0.35},
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
    color: 'black',
    borderColor: 'black',
    borderWidth: theme.border.width.slim,
    padding: 8,
  },
}));

export default ReceiptModal;
