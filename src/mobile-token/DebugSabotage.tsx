import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {AttestationSabotage} from '@entur-private/abt-token-state-react-native-lib';
import {Platform, View} from 'react-native';

type SabotageProps = {
  sabotage?: AttestationSabotage;
  setSabotage: (sabotage?: AttestationSabotage) => void;
};

/**
 * Helper to allow sabotaging of attestation in debug mode
 */
export const DebugSabotage = ({sabotage, setSabotage}: SabotageProps) => {
  return (
    <View>
      <SabotageButtonsModalContainer setSabotage={setSabotage} />
      <AttestationSabotageText sabotage={sabotage} />
    </View>
  );
};

type SabotageButtonsProps = {
  setSabotage: (sabotage?: AttestationSabotage) => void;
};

function SabotageButtonsModalContainer({setSabotage}: SabotageButtonsProps) {
  if (Platform.OS === 'android') {
    return <AndroidSabotageButtons setSabotage={setSabotage} />;
  }

  if (Platform.OS === 'ios') {
    return <IOSSabotageButtons setSabotage={setSabotage} />;
  }

  throw new Error('Unknown platform ' + Platform.OS);
}

function AndroidSabotageButtons({setSabotage}: SabotageButtonsProps) {
  const onAttestationCreationErrorPermanent = () => {
    setSabotage({
      attestationCreationError: {
        type: 'playIntegrityApiApiException',
        code: 'PlayStoreNotFound',
      },
    });
  };

  const onAttestationCreationErrorTransient = () => {
    setSabotage({
      attestationCreationError: {
        type: 'playIntegrityApiApiException',
        code: 'NetworkError',
      },
    });
  };

  const onAttestationCreationErrorUserTransient = () => {
    setSabotage({
      attestationCreationError: {
        type: 'playIntegrityApiApiException',
        code: 'PlayStoreVersionOutdated',
      },
    });
  };

  const onInputManipulation = () => {
    setSabotage({
      attestationInputManipulation: {
        type: 'nonce',
      },
    });
  };

  const onOutputManipulation = () => {
    setSabotage({
      attestationOutputManipulation: {
        type: 'jwt-signature',
      },
    });
  };

  const onDisable = () => {
    setSabotage(undefined);
  };

  return (
    <View>
      <ThemeText>Prevent creation of attestation (locally)</ThemeText>
      <Button
        onPress={onAttestationCreationErrorTransient}
        text="Transient: NetworkError"
        style={styles.button}
      />
      <Button
        onPress={onAttestationCreationErrorUserTransient}
        text="User transient: PlayStoreVersionOutdated"
        style={styles.button}
      />
      <Button
        onPress={onAttestationCreationErrorPermanent}
        text="Permanent: PlayStoreNotFound"
        style={styles.button}
      />

      <ThemeText>Attestation input mainpulation (fails remotely)</ThemeText>
      <Button
        onPress={onInputManipulation}
        text="Manipulate nonce"
        style={styles.button}
      />

      <ThemeText>Attestation output manipulation (fails remotely)</ThemeText>
      <Button
        onPress={onOutputManipulation}
        text="Manipulate JWT signature"
        style={styles.button}
      />

      <ThemeText>Other</ThemeText>
      <Button onPress={onDisable} text="Disable" style={styles.button} />
    </View>
  );
}

function IOSSabotageButtons({setSabotage}: SabotageButtonsProps) {
  const onUnknownAttestationCreationError = () => {
    setSabotage({
      attestationCreationError: {
        type: 'DCError',
        code: 'unknownSystemFailure',
      },
    });
  };

  const onInvalidKeyAttestationCreationError = () => {
    setSabotage({
      attestationCreationError: {
        type: 'DCError',
        code: 'invalidKey',
      },
    });
  };

  const onInputManipulation = () => {
    setSabotage({
      attestationInputManipulation: {
        type: 'nonce',
      },
    });
  };

  const onOutputManipulation = () => {
    setSabotage({
      attestationOutputManipulation: {
        type: 'attestationResult',
        code: 'attestationObject',
      },
    });
  };

  const onDisable = () => {
    setSabotage(undefined);
  };

  return (
    <View>
      <ThemeText>Prevent creation of attestation (locally)</ThemeText>
      <Button
        onPress={onUnknownAttestationCreationError}
        text="Unknown creation error"
        style={styles.button}
      />

      <Button
        onPress={onInvalidKeyAttestationCreationError}
        text="Invalid key creation error"
        style={styles.button}
      />

      <ThemeText>Attestation input mainpulation (fails remotely)</ThemeText>
      <Button
        onPress={onInputManipulation}
        text="Manipulate nonce"
        style={styles.button}
      />

      <ThemeText>Attestation output manipulation (fails remotely)</ThemeText>
      <Button
        onPress={onOutputManipulation}
        text="Manipulate attestation object"
        style={styles.button}
      />

      <ThemeText>Other</ThemeText>
      <Button onPress={onDisable} text="Disable" style={styles.button} />
    </View>
  );
}

type AttestationSabotageProps = {
  sabotage?: AttestationSabotage;
};

function AttestationSabotageText({sabotage}: AttestationSabotageProps) {
  if (!sabotage) {
    return <ThemeText>Attestation Sabotage: none</ThemeText>;
  }

  if (sabotage.attestationCreationError) {
    return <ThemeText>Attestation Sabotage: Creation</ThemeText>;
  }

  if (sabotage.attestationInputManipulation) {
    return <ThemeText>Attestation Sabotage: Input mainpulation</ThemeText>;
  }

  if (sabotage.attestationOutputManipulation) {
    return <ThemeText>Attestation Sabotage: Output mainpulation</ThemeText>;
  }

  return <ThemeText>Unknown</ThemeText>;
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  container: {
    marginVertical: 8,
  },
});
