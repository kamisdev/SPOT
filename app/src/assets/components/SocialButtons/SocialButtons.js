import React from 'react';
import {View,TouchableOpacity,Image} from 'react-native';
import styles from './SocialButtons.scss';

export default function SocialButtons(props){
    return(
        <TouchableOpacity
            onPress={props.onPress}
        >
            <View style={styles.button}>
                <Image 
                    source={props.image}
                    style={styles.icon}
                />
            </View>
        </TouchableOpacity>
    )
}