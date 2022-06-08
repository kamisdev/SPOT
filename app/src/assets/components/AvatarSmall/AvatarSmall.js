import React from 'react'
import {Image,View,ScrollView} from 'react-native';
import { vw } from 'react-native-expo-viewport-units';
import styles from './AvatarSmall.scss';
import defaultAva from '../../img/default-avatar.png'

export default function AvatarSmall(props){
    const [error,isError] = React.useState(false)
    return(
        <View style={{...styles.outerCircle,width:vw(15),height:vw(15),borderRadius:vw(8)}}>
           {error?
                <Image 
                    source={defaultAva}
                    style={styles.innerCircle}
                   
                />
                :
                <Image 
                    source={props.source}
                    style={styles.innerCircle}
                    onError={()=>isError(true)}
                />
            }
        </View>
    );
};