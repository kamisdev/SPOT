import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import style from './RoundedButton.scss';

export default function RoundedButton(props){
    return(
        <View
            style={props.style}
        >
            <Button 
                titleStyle={style.titleStyle}
                buttonStyle={{...style.buttonStyle,backgroundColor:props.color}}
                title={props.title}
                onPress={()=>props.onPress()}
                disabled={props.disabled}
            />
        </View>
        );
}