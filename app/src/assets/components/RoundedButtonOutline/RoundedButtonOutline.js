import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import style from './RoundedButtonOutline.scss';

export default function RoundedButtonOutline(props){
    return(
        <View
            style={props.style}
        >
            <Button 
                titleStyle={style.titleStyle}
                buttonStyle={style.buttonStyle}
                title={props.title}
                onPress={()=>props.onPress()}
            />
        </View>
        );
}