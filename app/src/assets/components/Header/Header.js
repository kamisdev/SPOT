import React from 'react';
import {Header,Icon} from 'react-native-elements';
import QuicksandBoldText from '../QuicksandBoldText/QuicksandBoldText.js'
import { TouchableOpacity } from 'react-native';
import {useRoute} from '@react-navigation/native';

export default function CustomHeader(props) {
    const route = useRoute();

    return(
        <Header
            statusBarProps={{barStyle:'light-content'}}
            containerStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'space-around',
                borderBottomWidth:0 
            }}
            leftComponent={
                <TouchableOpacity
                    onPress={props.onPress}
                >
                    {props.back?
                    <Icon
                    name='chevron-left'
                    type='feather'
                    color='#fff'
                    size={40}
                    iconStyle={{marginLeft:10}}
                    />:
                    null
                    }
                </TouchableOpacity>
            }
            centerComponent={
                <QuicksandBoldText
                    style={{fontSize:22, color:'#fff'}}
                >
                    {props.title}
                </QuicksandBoldText>
            }
            rightComponent={
                <>
                {props.noRight?
                null:
                <TouchableOpacity
                    onPress={()=>{
                        if (route.name==="Settings"){
                            props.navigation.goBack()

                        } else {
                            props.navigation.navigate("SettingsStack",{animation:null})}}
                        }
                >
                    <Icon
                    name='menu'
                    type='feather'
                    color='#fff'
                    size={36}
                    iconStyle={{marginRight:10}}
                    />
                </TouchableOpacity>
                }
                </>
            }
        />
    );
}
