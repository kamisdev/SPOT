import React from 'react'
import {Image,View,Text} from 'react-native';
import {Button} from 'react-native-elements'
import { vw } from 'react-native-expo-viewport-units';
import styles from './OwnerStrip.scss';
import {userActions} from '../../../../redux/actions'
import AvatarSmall from '../AvatarSmall/AvatarSmall.js'
import { connect } from 'react-redux';

function OwnerStrip(props){
    const {userName,color,textColor,subtext,id,getOwner} = props; 
    return(
        <View style={{...styles.ownerStrip,backgroundColor:color}}>
            {userName&&
            <View style={styles.container}>
            <AvatarSmall
                source={props.avatar}
            />
            <View style={styles.details}>
                <Text style={{...styles.title,color:textColor,maxWidth:vw(40)}}>{userName}</Text>
                <Text style={{...styles.subtitle,color:textColor}}>{subtext}</Text>
            </View>
            {id?
            <Button
                title={'VIEW PROFILE'}
                buttonStyle={styles.viewProfile}
                titleStyle={styles.viewProfileText}
                onPress={()=>{props.navigation.navigate('Find Owners',{screen:'ProfileOwner'});getOwner(id)}}
            />:
            <Button
                title={'MY PROFILE'}
                buttonStyle={styles.viewProfile}
                titleStyle={styles.viewProfileText}
                onPress={()=>{props.navigation.navigate('Profile')}}
            />
            }
            </View>
            }
        </View>
    )
}

function mapState(state) {
    const {  owner } = state.user;
    return { owner };
  }
  

const actionCreators = {
    getOwner: userActions.getOwner,
  };

  export default connect(mapState,actionCreators)(OwnerStrip);
  