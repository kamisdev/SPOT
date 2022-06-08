import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Image, ImageBackground,Text,FlatList, TouchableOpacity, TouchableHighlight, Modal, TouchableWithoutFeedback } from 'react-native';
import MapView, {Marker,AnimatedRegion,Animated} from 'react-native-maps';
import styles from './CompatibleOwners.scss';
import { Input,Button,Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import {locationActions,userActions} from '../../../redux/actions';
import AvatarSmall from '../../assets/components/AvatarSmall/AvatarSmall';
import pictureDisplay from '../../assets/helpers/pictureDisplay'

import Geolocation from '@react-native-community/geolocation';
import Header from '../../assets/components/Header/Header.js'
const { width, height } = Dimensions.get('window');
import arrow from '../../assets/img/navigation.png';
import pin from '../../assets/img/pin.png';
import avatar from '../../assets/img/sharmaine.png'

import CustomInput from '../../assets/components/CustomInput/CustomInput.js';
import WorkSansText from '../../assets/components/WorkSansText/WorkSansText.js'
import background from  '../../assets/img/RegisterBackground.png';

function CompatibleOwners({navigation,locationPredictions,searchLocation,updateCurrentLocation,getUsersAround,getLocationDetails,locationDetails,usersAround,user,getOwner}){
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922/10;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


    const [currentPosition,setCurrentPosition] = React.useState(
        new AnimatedRegion ({
        latitude: 37.33020696,
        longitude: -122.02657718,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }));
    const [inputLocation, setInputLocation] = React.useState('');
    const [showLocations, setShowLocations] = React.useState(false);
    const [customLocation, setCustomLocation] = React.useState(false);
    const [radius, setRadius] = React.useState(30);
    const [heading,setHeading] = React.useState('0deg');
    const [modalVisible, setModalVisible] = React.useState(false);

   React.useEffect(()=>{
       console.log(usersAround)
       if (locationDetails&&showLocations&&customLocation) {
           const loc = new AnimatedRegion({
            latitude:locationDetails.lat,
            longitude:locationDetails.lng,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA
        });
        if ((currentPosition.latitude._value===locationDetails.lat&&currentPosition.longitude._value===locationDetails.lng)){
            null;
        } else {
            setCurrentPosition(loc);
            setShowLocations(false);
        }
    }
   });

   const _toggler = () =>{
        if (customLocation){
            setCustomLocation(false);
            geo();
        } else {
            setCustomLocation(true);
            Geolocation.stopObserving();
        }
   }
   const geo = () => Geolocation.watchPosition((position) => {
        setCurrentPosition(new AnimatedRegion({
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA
        }));
        setHeading(position.coords.heading.toString()+'deg');

        updateCurrentLocation({
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
            heading: position.coords.heading
        });
        getUsersAround({
            radius: radius,
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
        });

    },
    err=>console.log(err),
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );

    const _getUsersAround = () => {
        getUsersAround({
            radius: radius,
            latitude: currentPosition.latitude._value,
            longitude: currentPosition.longitude._value
        });
    } 
    React.useEffect(()=>{
        _getUsersAround()
        Geolocation.requestAuthorization();
        geo();
        },[])

    return(
        <ImageBackground 
            style={{width: '100%', height: '100%'}}
            source={background}
        >
        <Header
            title="Find Owners"
        />
        <SafeAreaView style={{backgroundColor:'#FD6C59'}}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.centeredView}
                        onPressOut={() => {setModalVisible(false);_getUsersAround()}}
                    >
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <WorkSansText style={styles.modalText}>Search Radius (in meters)</WorkSansText>

                            <CustomInput 
                                value={radius?radius.toString():'0'}
                                style={styles.modalInput}
                                onChangeText={(text)=>setRadius(parseInt(text))}
                            />

                            <TouchableHighlight
                            style={{ ...styles.openButton}}
                            onPress={() => {
                                setModalVisible(false);
                                _getUsersAround()

                            }}
                            >
                            <WorkSansText style={styles.modalText}>Close</WorkSansText>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                    </TouchableOpacity>
            </Modal>

            <View style={styles.searchBarContainer}>
                <Input
                    placeholder='Search'
                    leftIcon={{ type: 'entypo', name: 'magnifying-glass',color: '#D8D8D8' }}
                    inputContainerStyle={styles.searchBar}
                    inputStyle={styles.searchBarText}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    value={inputLocation}
                    onChangeText={(text)=>{setInputLocation(text)}}
                />
                <Button
                    buttonStyle={styles.searchButton} 
                    onPress={()=>{
                        searchLocation(inputLocation);
                        setShowLocations(true);
                        Geolocation.stopObserving();
                        setCustomLocation(true);
                    }}
                    
                    icon={{
                        name: "arrowright",
                        type: "antdesign",
                        size: 17,
                    }}
                />
                
            </View>
            <View
                style={styles.subtitleSearchBar}
            >
                <TouchableOpacity
                    onPress={()=>{
                        _toggler()
                    }}
                >
                    <Text style={styles.subtitleText}>Self-tracking: {customLocation?'Off':'On'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>setModalVisible(true)}
                >
                    <Text style={styles.subtitleText}>Search Radius: {radius} m</Text>
                </TouchableOpacity>
            </View>
            {showLocations&&locationPredictions&&
                <View style={styles.placesContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={()=>{setShowLocations(false)}}
                    >
                        <Icon
                            name="closecircle"
                            type="antdesign"
                            size={20}
                            color="#b8b8b8"
                        />
                    </TouchableOpacity>
                        <FlatList
                            data={locationPredictions}
                            renderItem={({item}) => (
                                <TouchableOpacity 
                                    style={styles.place}
                                    onPress={()=>{
                                        getLocationDetails(item.place_id);
                                        setShowLocations(false);
                                    }}
                                >
                                    <Text>{item.description}</Text>
                                </TouchableOpacity>
                            )}
                        />    
                </View>
            }
        </SafeAreaView>
        <View style={styles.container}>
            <Animated
                style={StyleSheet.absoluteFillObject}
                region={currentPosition}
                initialRegion={{
                    latitude: 37.33020696,
                    longitude: -122.02657718,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker.Animated
                    coordinate={currentPosition}
                >
                    <Image
                        style={{height:width/7,width:width/7,transform: [{rotate: heading}]}}
                        source={arrow}
                    />
                </Marker.Animated>
                {usersAround&&usersAround.map((item)=>{
                    let coords = {
                        latitude:item.location.latitude,
                        longitude:item.location.longitude,
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA
                    }
                    if (user&&user._id===item._id){
                        return null
                    } else {
                        return (
                            <Marker
                                key={item._id}
                                coordinate={coords}
                                onCalloutPress={()=>{getOwner(item._id);navigation.navigate('ProfileOwner')}}
                            >
                                    <Image
                                        style={{height:width/8,width:width/11,marginBottom:30}}
                                        source={pin}
                                    />
                                <MapView.Callout>
                                    <AvatarSmall
                                            source={pictureDisplay(item.picture)}
                                        />
                                </MapView.Callout>
                            </Marker>
                        );
                    }  
                })
                }
          </Animated>
        </View>
        </ImageBackground>
    )
}


function mapState(state) {
    const { user } = state.user;
    const { locationPredictions,usersAround,locationDetails } = state.location
    return { locationPredictions,usersAround,locationDetails,user };
}

const actionCreators = {
    searchLocation: locationActions.searchLocation,
    updateCurrentLocation: locationActions.updateCurrentLocation,
    getUsersAround: locationActions.getUsersAround,
    getLocationDetails: locationActions.getLocationDetails,
    getOwner: userActions.getOwner,

};



export default connect(mapState,actionCreators)(CompatibleOwners);
  

