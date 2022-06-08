import React from 'react';
import {
  AppState,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {Marker, AnimatedRegion, Animated} from 'react-native-maps';
import styles from './CompatibleOwners.scss';
import {Button, Icon} from 'react-native-elements';
import Slider from '@react-native-community/slider';
import {connect} from 'react-redux';
import {locationActions, userActions} from '../../../redux/actions';
import AvatarSmall from '../../assets/components/AvatarSmall/AvatarSmall';
import pictureDisplay from '../../assets/helpers/pictureDisplay';
import RNGooglePlaces from 'react-native-google-places';

import Geolocation from '@react-native-community/geolocation';
import Header from '../../assets/components/Header/Header.js';
const {width, height} = Dimensions.get('window');
import arrow from '../../assets/img/navigation.png';
import pin from '../../assets/img/pin.png';

import CustomInput from '../../assets/components/CustomInput/CustomInput.js';
import WorkSansText from '../../assets/components/WorkSansText/WorkSansText.js';
import background from '../../assets/img/RegisterBackground.png';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922 / 10;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class CompatibleOwners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputLocation: '',
      predictions: [],
      heading: '0deg',
      radius: 30,
      markerClicked: false,
      modalVisible: false,
      currentPosition: new AnimatedRegion({
        latitude: 0,
        longitude: 0,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      }),
    };
  }
  geolocationStartwatching() {
    this.watchID = Geolocation.watchPosition(
      position => {
        console.log(position);
        this.setState({
          heading: position.coords.heading.toString() + 'deg',
          currentPosition: new AnimatedRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA,
          }),
        });
        if (!this.state.markerClicked) {
          this.setState({
            regionPosition: new AnimatedRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              longitudeDelta: LONGITUDE_DELTA,
              latitudeDelta: LATITUDE_DELTA,
            }),
          });
        }
      },
      err => console.log(err),
      {
        distanceFilter: 100,
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }
  componentDidMount() {
    const {updateCurrentLocation, getUsersAround} = this.props;
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          heading: position.coords.heading.toString() + 'deg',
          currentPosition: new AnimatedRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA,
          }),
          regionPosition: new AnimatedRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA,
          }),
        });
        updateCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        });
        getUsersAround({
          radius: this.state.radius,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {
        distanceFilter: 100,
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
    this.geolocationStartwatching();
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  searchAddress(text) {
    this.setState({inputLocation: text});
    RNGooglePlaces.getAutocompletePredictions(text)
      .then(results => {
        this.setState({predictions: results});
      })
      .catch(error => console.log(error.message));
  }

  selectAddress(address) {
    const {getUsersAround} = this.props;
    RNGooglePlaces.lookUpPlaceByID(address.placeID, ['location'])
      .then(({location}) => {
        console.log(location);
        this.setState({
          regionPosition: new AnimatedRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: LATITUDE_DELTA,
          }),
          predictions: [],
        });
        Geolocation.clearWatch(this.watchID);
        getUsersAround({
          radius: this.state.radius,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      })
      .catch(error => console.log(error.message));
  }
  render() {
    const {navigation, usersAround, user, getOwner} = this.props;

    return (
      <ImageBackground
        style={{width: '100%', height: '100%', flex: 1}}
        source={background}>
        <Header title="Find Owners" navigation={navigation} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onCalloutPress={() => {
            this.setState({
              modalVisible: false,
            });
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.centeredView}
            onPressOut={() => this.setState({modalVisible: false})}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <WorkSansText style={styles.modalText}>
                  Search Radius
                </WorkSansText>
                <Slider
                  style={{width: 200, height: 40}}
                  minimumValue={0}
                  maximumValue={1000}
                  step={10}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#222222"
                  onValueChange={val => this.setState({radius: val})}
                />

                <WorkSansText style={styles.modalText}>
                  {this.state.radius} meters
                </WorkSansText>

                <TouchableHighlight
                  style={{...styles.openButton}}
                  onPress={() => {
                    this.setState({
                      modalVisible: false,
                    });
                  }}>
                  <WorkSansText style={styles.openButtonText}>
                    Apply
                  </WorkSansText>
                </TouchableHighlight>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, {width: width * 0.75}]}>
            <Icon type="entypo" name="magnifying-glass" color="#D8D8D8" />
            <TextInput
              style={styles.searchBarInput}
              onChangeText={text => this.searchAddress(text)}
              value={this.state.inputLocation}
              autoCorrect={false}
            />
          </View>
          <Button
            buttonStyle={styles.searchButton}
            onPress={() =>
              this.setState({
                modalVisible: true,
              })
            }
            icon={{
              name: 'filter',
              type: 'material-community',
              size: 20,
              color: '#555',
            }}
          />
        </View>
        <View style={styles.subtitleSearchBar}>
          <TouchableOpacity
            style={{
              height: 30,
            }}
            onPress={() => {
              this.watchID != null && Geolocation.clearWatch(this.watchID);
              this.geolocationStartwatching();
            }}>
            <Text style={styles.subtitleText}>Re-Center</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.subtitleText}>
              Search Radius: {this.state.radius} m
            </Text>
          </View>
        </View>
        <View style={styles.placesContainer}>
          <FlatList
            data={this.state.predictions}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.place}
                onPress={() => this.selectAddress(item)}>
                <Text style={styles.priText}>{item.primaryText}</Text>
                <Text style={styles.subText}>{item.secondaryText}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.container}>
          <Animated
            style={StyleSheet.absoluteFillObject}
            region={this.state.regionPosition}
            initialRegion={{
              latitude: 37.33020696,
              longitude: -122.02657718,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={() => {
              if (this.state.predictions?.length > 0) {
                this.setState({predictions: []});
              } else {
                this.setState({markerClicked: false});
              }
            }}>
            <Marker.Animated coordinate={this.state.currentPosition}>
              <Image
                style={{
                  height: width / 7,
                  width: width / 7,
                  transform: [{rotate: this.state.heading}],
                }}
                source={arrow}
              />
            </Marker.Animated>
            {usersAround &&
              usersAround.map(item => {
                let coords = {
                  latitude: 0,
                  longitude: 0,
                  longitudeDelta: LONGITUDE_DELTA,
                  latitudeDelta: LATITUDE_DELTA,
                };
                coords = {
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                  longitudeDelta: LONGITUDE_DELTA,
                  latitudeDelta: LATITUDE_DELTA,
                };
                if (user && user._id === item._id) {
                  return null;
                } else {
                  return (
                    <Marker
                      key={item._id}
                      coordinate={coords}
                      onPress={() => this.setState({markerClicked: true})}
                      onCalloutPress={() => {
                        getOwner(item._id);
                        navigation.navigate('ProfileOwner');
                        this.setState({markerClicked: false});
                      }}>
                      <Image
                        style={{
                          height: width / 8,
                          width: width / 11,
                          marginBottom: 30,
                        }}
                        source={pin}
                      />
                      <MapView.Callout>
                        <AvatarSmall source={pictureDisplay(item.picture)} />
                      </MapView.Callout>
                    </Marker>
                  );
                }
              })}
          </Animated>
        </View>
      </ImageBackground>
    );
  }
}

function mapState(state) {
  const {user} = state.user;
  const {locationPredictions, usersAround, locationDetails} = state.location;
  return {locationPredictions, usersAround, locationDetails, user};
}

const actionCreators = {
  searchLocation: locationActions.searchLocation,
  updateCurrentLocation: locationActions.updateCurrentLocation,
  getUsersAround: locationActions.getUsersAround,
  getLocationDetails: locationActions.getLocationDetails,
  getOwner: userActions.getOwner,
};

export default connect(
  mapState,
  actionCreators,
)(CompatibleOwners);
