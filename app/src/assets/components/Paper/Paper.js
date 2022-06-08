import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './Paper.scss';

export default function Paper(props){
    if (props.onPress){
        return(
            <TouchableOpacity
            style={{...styles.container,marginBottom:props.last?300:15}}
            onPress={props.onPress}
            >
                {props.children}
            </TouchableOpacity>
        );
    } else {
        return(
            <View
                style={{...styles.container,marginBottom:props.last?300:15}}
            >
                {props.children}
            </View>
        );
    }
    
}