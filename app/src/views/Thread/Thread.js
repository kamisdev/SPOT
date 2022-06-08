

import React from 'react';

import {Text,FlatList, ImageBackground,View,ScrollView,TextInput,SafeAreaView,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import { connect } from 'react-redux';
import pictureDisplay from '../../assets/helpers/pictureDisplay'
import {messageActions} from '../../../redux/actions'
import socketIOClient from "socket.io-client";
import { ENDPOINT } from 'react-native-dotenv';
import moment from 'moment';


import background from  '../../assets/img/RegisterBackground.png';
import CustomHeader from '../../assets/components/Header/Header.js';
import ChatBubble from '../../assets/components/ChatBubble/ChatBubble.js';
import OwnerStrip from '../../assets/components/OwnerStrip/OwnerStrip.js';
import AvatarSmall from '../../assets/components/AvatarSmall/AvatarSmall.js'
import QuicksandBoldText from '../../assets/components/QuicksandBoldText/QuicksandBoldText.js'

import owner from '../../assets/img/raymond-colt.png';

import styles from './Thread.scss'

function Thread({
    navigation,
    route,
    user,
    messages,
    fetchingMessages,
    sendingMessage,
    sendMessage,
    viewInbox,
    viewThread,
    threadId
}){
    const {receiver} = route.params;
    const [response, setResponse] = React.useState(false);
    const [writeMessage,setwriteMessage] = React.useState({
        member1Id: user._id,
        member1Name: `${user.firstName} ${user.lastName}`,
        member1Picture: user.picture,
        member2Id: receiver.id,
        member2Name: receiver.name,
        member2Picture: receiver.picture,
        lastMessage: ""
    });
    const scroll = React.useRef(null);

   

    React.useEffect(()=>{
        if (response){
            setwriteMessage({...writeMessage,lastMessage:''});
            viewThread(threadId,false)
            setResponse(false)
        }
    },[response])

    React.useEffect(()=>{
        viewThread(route.params.threadId,true)
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            console.log("emitted");
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
            back
            onPress={()=>navigation.navigate("Inbox")}
        />
        <View style={{height:'90%'}}>
        <OwnerStrip 
                userName={`${receiver.name}`}
                avatar={pictureDisplay(receiver.picture)}
                color="#ffffff"
                textColor="#000000"
                subtext={receiver.timestamp}
                navigation={navigation}
                owner={true}
                id={receiver.id}
            />
            <SafeAreaView style={{flex:1,justifyContent: 'flex-end',}}>
            
            <ScrollView
                ref={scroll}
                style={styles.flip}
            >
               {/*<ChatBubble
                        avatar={pictureDisplay(user.picture)}
                        name={'Me'}
                        text={writeMessage.lastMessage}
                        color="#26CFEC"
                        textColor="#FFFFFF"
                        timestamp={'Sending...'}
                        inverted
               />*/}
                
            {user&&messages&&messages.map(message=>{
                    let timestamp
                    if (message.timestamp==='Sending...'){
                        timestamp='Sending...'
                    } else {
                        const time = new Date(message.timestamp)
                        const now = Date.now()
                       /* const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
                        const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(time)

                        if (dtf.formatToParts(time)!==dtf.formatToParts(Date.now())){
                            timestamp = `${da}/${mo}/${ye}`
                        } else {
                            timestamp = new Intl.DateTimeFormat('en', {  hour: 'numeric', minute: 'numeric'})
                        }*/
                        if (moment(time).isSame(now, 'day')){
                            timestamp = moment(time).format('LT');
                        } else {
                            timestamp = moment(time).calendar()
                        }       
                    }
                    
                    if (user&&message.senderId===user._id||timestamp==='Sending...'){
                        return(
                            <ChatBubble
                                avatar={pictureDisplay(user.picture)}
                                name={'Me'}
                                text={message.message}
                                color="#26CFEC"
                                textColor="#FFFFFF"
                                timestamp={timestamp}
                                inverted
                            />
                        )
                    }else {
                        return(
                            <ChatBubble
                                name={receiver.name}
                                avatar={pictureDisplay(receiver.picture)}
                                text={message.message}
                                color="#FFFFFF"
                                timestamp={timestamp}
                            />
                        )
                    }
                    
                })
            }

                    
                
                </ScrollView>
                <View style={styles.composer}>
                    <TextInput
                        style={styles.textComposer}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                        multiline={true}
                        placeholder="Write Message"
                        onChangeText={(text)=>{setwriteMessage({...writeMessage,lastMessage:text})}}
                        value={writeMessage.lastMessage}
                    />
                    <Button 
                        icon={{
                            name: "arrowright",
                            type: "antdesign",
                            size: 20,
                            color: "white"
                          }}
                        buttonStyle={styles.sendButton}
                        onPress={()=>{sendMessage(writeMessage)}}
                    />

                </View>
            </SafeAreaView>
        </View>
        </ImageBackground>
    )
}

function mapState(state) {
    const { user } = state.user;
    const { 
        messages,
        fetchingMessages,
        sendingMessage,
        messageSent,
        threadId
        } = state.message;

    return { 
        user,
        messages,
        fetchingMessages,
        sendingMessage,
        messageSent,
        threadId
     };
  }

const actionCreators = {
    viewThread: messageActions.viewThread,
    viewInbox: messageActions.viewInbox,
    sendMessage: messageActions.sendMessage
};

export default connect(mapState,actionCreators)(Thread);
