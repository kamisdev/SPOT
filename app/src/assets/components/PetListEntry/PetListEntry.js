import React from 'react';
import {View,Image,Text} from 'react-native';
import {Button,Icon} from 'react-native-elements';
import styles from './PetListEntry.scss';
import { vw } from 'react-native-expo-viewport-units';
import AvatarSmall from '../AvatarSmall/AvatarSmall.js'

export default function PetListEntry(props){
    return(
        <View style={styles.container}>
            <AvatarSmall
                source={props.avatar}
            />
               
            <View style={styles.details}>
                <Text style={styles.title}>{props.name}</Text>
                <Text style={styles.subtitle}>{props.breed} | {props.age} year (s) old</Text>
            </View>
            <>
            {props.options&&
            <>
            <View style={styles.buttonGroup}>
            <Button
                buttonStyle={styles.buttonRound}
                onPress={()=>props.editPet()}
                icon={
                    <Icon
                        name="edit"
                        type="feather"
                        size={15}
                        color="#26CFEC"
                    />
                }
            />
            <Button
                buttonStyle={styles.buttonRound}
                onPress={()=>props.deletePet()}
                icon={
                    <Icon
                        name="close"
                        size={20}
                        color="#FD6C59"
                    />
                }
            />
            </View>
            </>
            }
        </>
        </View>
    );
};