import React from 'react';
import {View,TouchableOpacity,Text} from 'react-native';
import { vh } from 'react-native-expo-viewport-units';

import styles from './CustomTabView.scss';

export default function CustomTabView(props){
    const {activatedColor,tabColor,color} = props;
    return(
        <>
            <View style={styles.tabsContainer}>
            
                {props.routes.map((r)=>{
                    if(r.key===props.view){
                        return(
                            <View style={{...styles.activatedTab,backgroundColor:activatedColor}} key={r.key}>
                                <Text style={{...styles.font,color:color}}>{r.title}</Text>
                            </View>
                        );
                    }else{
                        return(
                            <TouchableOpacity 
                                style={{...styles.tab,backgroundColor:tabColor}} 
                                key={r.key}
                                onPress={()=>props.setIndex(r.key)}
                            >
                                <Text style={styles.font}>{r.title}</Text>
                            </TouchableOpacity>
                        );
                    };

                })}
            </View>
            <View  style={{...styles.tabContent,minHeight:vh(45),backgroundColor:props.routes[props.view].transparent?'transparent':'white'}}>
                {props.routes[props.view].component()}
            </View>
        </>
    );
};