import React from 'react'
import {Image,View,ScrollView} from 'react-native';
import styles from './AvatarLarge.scss';
import defaultAva from '../../img/default-avatar.png'

export default function AvatarLarge(props){
    const [error,isError] = React.useState(false)

    return(
        <View style={styles.outerCircle}>
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