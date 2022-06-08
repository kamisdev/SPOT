import React from 'react';
import {Text,FlatList,Image,View} from 'react-native';
import styles from './PawList.scss';
import bullet from '../../img/animal-paw-print.png';

export default function PawList(props){
    return(
        <View style={styles.container}>
            <FlatList
            data={props.list}
            renderItem={({item}) => (
                <View style={styles.itemContainer}>
                    <Image source={bullet} style={{height:22,width:22}} />
                    <Text style={styles.item}>{item.key}</Text>
                </View>
            )}
            />
        </View>
    );
};