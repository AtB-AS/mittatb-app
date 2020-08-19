import React from 'react';
import { AccessibilityProps, Text, StyleSheet as StyleSheetNative } from "react-native";
import {StyleSheet} from '../../theme';

type LabelProps = {
} & AccessibilityProps;

const NonVisualSupportLabel:  React.FC<LabelProps> = ({...props}) => {
    return(
        <Text style={styles.accessibleLabel}>{props.children}</Text>
    );
};
const styles = StyleSheet.create({
    accessibleLabel: {
        fontSize: 0
    }
})
export default NonVisualSupportLabel;