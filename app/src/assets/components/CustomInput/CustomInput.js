import React from 'react';
import {View,TextInput,Keyboard} from 'react-native'
import styles from './CustomInput.scss';


export default function CustomInput(props){
    const customStyle = props.multiline?'outerContainerMultiline':'outerContainer';

    return(
            <View style={{...styles[customStyle],...props.style}}>
                    <TextInput
                        {...props}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                        style={styles.inputStyle}
                        placeholder={props.placeholder}
                        value={props.value}
                        multiline={props.multiline}
                        onSubmitEditing={Keyboard.dismiss}
                        secureTextEntry={props.password}
                    />
            </View>
    );
}