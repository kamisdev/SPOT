import React from 'react';

import {Text,FlatList, ImageBackground,View,RefreshControl,TextInput,SafeAreaView,TouchableOpacity,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import { connect } from 'react-redux';
import {
    useFocusEffect,
  } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';  
import socketIOClient from "socket.io-client";
import { ENDPOINT } from 'react-native-dotenv';

import pictureDisplay from '../../assets/helpers/pictureDisplay'

import background from  '../../assets/img/RegisterBackground.png';
import CustomHeader from '../../assets/components/Header/Header.js';
import ChatBubble from '../../assets/components/ChatBubble/ChatBubble.js';
import OwnerStrip from '../../assets/components/OwnerStrip/OwnerStrip.js';
import AvatarSmall from '../../assets/components/AvatarSmall/AvatarSmall.js'
import QuicksandBoldText from '../../assets/components/QuicksandBoldText/QuicksandBoldText.js'

import owner from '../../assets/img/raymond-colt.png';

import styles from './Inbox.scss'
import CustomTabView from '../../assets/components/CustomTabView/CustomTabView';
import {messageActions} from '../../../redux/actions'

function Inbox({
    navigation,
    user,
    threads,
    fetchingThreads,
    viewInbox,
    messageSent,
    setBadge
    }){
        const [response, setResponse] = React.useState(false);

    React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        setBadge(0);
    });

    return unsubscribe;
    }, [navigation]);
        
    React.useEffect(()=>{
        viewInbox(user._id);
    },[messageSent])

    
    React.useEffect(()=>{
        if (response){
            viewInbox(user._id);
            setResponse(false)
        }
    },[response])

    React.useEffect(()=>{
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            setResponse(true);
            viewInbox(user._id)
        })
        return ()=>socket.disconnect
    },[])
        
    
    return(
        <ImageBackground 
            style={{width: '100%', height: '100%'}}
            source={background}
        >
        <CustomHeader
    navigation={navigation}            title={'Messages'}
        />
        <SafeAreaView style={styles.container}>
            {fetchingThreads&&
                <ActivityIndicator
                    size="large"
                    color='#cccccc'
                />
            }
            {!fetchingThreads&&
            <FlatList
                refreshControl={<RefreshControl refreshing={false} onRefresh={()=>viewInbox(user._id)}/>}
                data={threads} 
                renderItem={({item})=>{
                    if (user) {
                    const member = item.member1Id===user._id? 'member1': 'member2'
                    const receiver = item.member1Id===user._id? 'member2': 'member1'

                    const time = new Date(item.timestamp)
                    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
                    const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(time) 
                    
                    return(
                        <TouchableOpacity 
                            style={{...styles.chatBubble}}
                            onPress={()=>navigation.navigate("Thread",{threadId:item._id,receiver:{id:item[receiver+'Id'],name:item[receiver+'Name'],picture:item[receiver+'Picture'],timestamp:`${da}/${mo}/${ye}`,}})}
                        >
                            <AvatarSmall
                                source={pictureDisplay(item[receiver+'Picture'])}
                            />
                            <View style={styles.texts}>
                                <View style={styles.upperText}>
                                    <QuicksandBoldText style={{fontSize:18}}> {item[receiver+'Name']} </QuicksandBoldText>
                                    <Text style={styles.text}>{`${da}/${mo}/${ye}`}</Text>
                                </View>
                                <Text style={{...styles.textBody}}>
                                { ((item.lastMessage).length > 80) ? 
                                ((((item.lastMessage)).substring(0,80-3)) + '...') : 
                                (item.lastMessage) }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                    } else {
                        return null
                    }
                }}
                keyExtractor={item => item.id}
            />
            }
        </SafeAreaView>
        </ImageBackground>
    )
}

/*function Messages(props){
    const routes = [
        { key: 0, title: 'Matched Owner', component:()=><Message {...props}/> },
        { key: 1, title: 'Messages', component: ()=><MessageList {...props}/>},
      ];
      const [index, setIndex] = React.useState(0);

    return(
        <ImageBackground 
            style={{width: '100%', height: '100%'}}
            source={background}
        >
            <CustomHeader
    navigation={navigation}                title={'Messages'}
            />
            <CustomTabView
                routes={routes}
                view={index}
                setIndex={setIndex}
                tabColor="#FD6C59"
                activatedColor="#FFFFFF"
                color="#000000"
            />

            
        </ImageBackground>
    )
}*/


function mapState(state) {
    const { user } = state.user;
    const { 
        threads,
        fetchingThreads,
        messageSent,
        } = state.message;

    return { 
        user,
        threads,
        fetchingThreads,
        messageSent,
     };
  }

const actionCreators = {
    viewInbox: messageActions.viewInbox,
    setBadge: messageActions.setBadge
};


export default connect(mapState,actionCreators)(Inbox);
