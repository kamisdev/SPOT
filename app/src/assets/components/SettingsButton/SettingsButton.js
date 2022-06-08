import React from 'react';
import {View,TouchableHighlight} from 'react-native';
import {Button,Icon} from 'react-native-elements';
import styles from './SettingsButton.scss';

export default function SettingsButton(props){
    return(
        <TouchableHighlight
            onPress={props.onPress}
        >
        <View
            style={{...styles.buttonStyle}}
        >
            <View
                style={styles.iconBorder}
            >
                <Icon
                    name={props.iconName}
                    type={props.iconType}
                    size={28}
                    color="#fff"
                />
            </View>
                
            <Button
                buttonStyle={{
                    backgroundColor: null
                }}
                titleStyle={styles.titleStyle}
                title={props.title}
                onPress={()=>props.onPress()}
                disabled={props.disabled}
                
            />
            <Icon
                    name="chevron-small-right"
                    type="entypo"
                    size={30}
                    color="#111"
                    
            />
            
        </View>
        </TouchableHighlight>
        );
}