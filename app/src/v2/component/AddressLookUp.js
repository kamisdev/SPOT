import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {human} from 'react-native-typography';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import api from 'services/api';

navigator.geolocation = require('@react-native-community/geolocation');

const tempRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function AddressLookUp({
  onBackPress,
  onPressDone,
  initialLocation,
}) {
  const [location, setLocation] = useState(initialLocation);
  const [mapLoading, setMapLoading] = useState(false);

  const autoCompleteRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    if (location) {
      setTimeout(() => {
        mapRef.current?.animateCamera(
          {
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            zoom: 18,
            altitude: 18,
          },
          {duration: 800},
        );
      }, 700);
      autoCompleteRef.current?.setAddressText(location.address);
    } else {
      onPressCurrentLocation();
    }
  }, []);

  const handleOnPressDone = () => {
    if (!location) {
      Alert.alert(
        null,
        'Please enter you address or move the map to select location.',
      );
      return;
    }
    onPressDone(location);
  };

  const hasPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await check(permission);
      switch (result) {
        case RESULTS.GRANTED:
          console.log('Permission granted.');
          return true;
        default:
          requestPermission();
          break;
      }
    } catch (e) {
      console.log('Permission error: ', e);
    }
  };
  const requestPermission = () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = request(permission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          Alert.alert(
            null,
            'You have to allow location permission to get your current location.',
          );
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    } catch (e) {
      console.log('Permission error: ', e);
    }
  };

  const onPressClear = () => {
    autoCompleteRef.current.setAddressText('');
    setLocation(null);
  };
  const onPressGooglePlace = (data, details) => {
    console.log('address comp onPressgoogleplace: ', details);
    const region = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };
    setLocation({
      coords: region,
      address: details.formatted_address,
      components: details.address_components,
    });
    mapRef.current?.animateCamera(
      {center: region, zoom: 18, altitude: 18},
      {duration: 1000},
    );
  };

  const getLocationDetails = async (lat, lng) => {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json';
    url = encodeURI(
      `${url}?latlng=${lat},${lng}&key=${api.GOOGLE_MAPS_API_KEY}`,
    );

    try {
      const res = await axios.get(url);
      const details = res.data.results[0];
      return details;
    } catch (e) {
      console.log('maps error: ', e);
    }
  };

  const onPressCurrentLocation = () => {
    if (hasPermission()) {
      setMapLoading(true);
      Geolocation.getCurrentPosition(
        position => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          let url = 'https://maps.googleapis.com/maps/api/geocode/json';
          url = encodeURI(
            `${url}?latlng=${region.latitude},${region.longitude}&key=${
              api.GOOGLE_MAPS_API_KEY
            }`,
          );

          axios
            .get(url)
            .then(res => {
              const loc = res.data.results[0];
              setMapLoading(false);
              setLocation({
                coords: region,
                address: loc.formatted_address,
                components: loc.address_components,
              });
              autoCompleteRef.current?.setAddressText(loc.formatted_address);
              mapRef.current?.animateCamera(
                {center: region, zoom: 18, altitude: 18},
                {duration: 1000},
              );
            })
            .catch(err => console.log(err));
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true},
      );
    }
  };

  const onMapRegionChangeComplete = async region => {
    const locDetails = await getLocationDetails(
      region.latitude,
      region.longitude,
    );
    if (locDetails && locDetails.address_components) {
      setLocation({
        coords: {latitude: region.latitude, longitude: region.longitude},
        address: locDetails.formatted_address,
        components: locDetails.address_components,
      });
      autoCompleteRef.current?.setAddressText(locDetails.formatted_address);
    } else {
      setLocation(null);
      autoCompleteRef.current?.setAddressText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={R.colors.bittersweet} barStyle="default" /> */}
      <StatusBar backgroundColor={'green'} barStyle="default" />
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <VectorIcon
            font="MaterialCommunity"
            name="arrow-left"
            size={32}
            color={R.colors.white}
          />
        </TouchableOpacity>
        <View style={styles.inputTextContainer}>
          <Text style={styles.inputText}>Select location</Text>
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={handleOnPressDone}>
          <Text style={styles.doneBtnText}>DONE</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          // loadingEnabled={mapLoading}
          onRegionChangeComplete={onMapRegionChangeComplete}>
          {/* {location && <Marker coordinate={location.coords} />} */}
        </MapView>
      </View>
      <TouchableOpacity
        style={styles.myLocationBtn}
        onPress={onPressCurrentLocation}>
        <VectorIcon
          font="Material"
          name="my-location"
          size={28}
          color={R.colors.bittersweet}
        />
      </TouchableOpacity>

      <GooglePlacesAutocomplete
        ref={autoCompleteRef}
        placeholder="Enter address or move map to select address"
        onPress={onPressGooglePlace}
        query={{key: api.GOOGLE_MAPS_API_KEY, language: 'en'}}
        styles={{container: styles.autoCompleteContainer}}
        fetchDetails={true}
      />
      {location && (
        <TouchableOpacity style={styles.clearBtn} onPress={onPressClear}>
          <VectorIcon
            font="Feather"
            name="x"
            size={14}
            color={R.colors.white}
          />
        </TouchableOpacity>
      )}
      <View style={styles.mapPinContainer}>
        <Image style={styles.mapPin} source={R.images.icon.locationPin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 40,
  },
  headerBar: {
    flexDirection: 'row',
    backgroundColor: R.colors.bittersweet,
    alignItems: 'center',
    height: 40,
  },
  inputTextContainer: {
    flex: 1,
    //position: 'relative',
    marginHorizontal: 50,
  },
  doneBtn: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    //position: 'absolute',
    //right: 0,
  },
  doneBtnText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.white,
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    //position: 'absolute',
    //left: 5,
  },
  myLocationBtn: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  inputText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'center',
  },
  clearBtn: {
    position: 'absolute',
    top: 60,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: R.colors.bittersweet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoCompleteContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: R.colors.alto,
    padding: 7,
  },
  mapPinContainer: {
    position: 'absolute',
    top: R.values.y * 0.48,
    left: R.values.x * 0.45,
  },
  mapPin: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
