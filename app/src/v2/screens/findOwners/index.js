import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Callout,
} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import UserAvatar from 'component/UserAvatar';

import SearchBar from './component/SearchBar';
import FAB from './component/FAB';
import FilterOption from './component/FilterOption';
import ListView from './component/ListView';
import SearchAddressModal from './component/SearchAddressModal';
import CalloutContent from './component/CalloutContent';

import R from 'res/R';
import api from 'services/api';
import {human} from 'react-native-typography';

const tempRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const mapZoomLevel = 15;
const mapAnimationDuration = 800;
const CIRCLE_RADIUS = 120;

export default class FindOwners extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mapLoading: false,
      fromLocation: {
        latitude: props.me.latitude,
        longitude: props.me.longitude,
      },
      currentLocation: null,
      radius: 30,
      showFilterOption: false,
      screenView: 'map',
      showAddressSearch: false,
      searchText: '',
      refreshingList: false,
      showCustomCallout: false,
      customCalloutData: props.me,
    };

    this.markerRef = {};
  }

  componentDidMount() {
    const {netInfo, me, getNearbyOwners} = this.props;
    const {radius} = this.state;

    if (netInfo.isInternetReachable) {
      getNearbyOwners({radius, latitude: me.latitude, longitude: me.longitude});
      this.moveToCurrentLocation();
    }
  }

  componentDidUpdate(prevProps) {
    const {navigation, error} = this.props;

    if (error && error !== prevProps.error && navigation.isFocused()) {
      Alert.alert('Error', error.error.message);
    }
  }

  onMenuPress = () => {
    const {navigation} = this.props;
    navigation.navigate('SettingsNavigation');
  };

  hasLocationPermission = async () => {
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
          this.requestLocationPermission();
          break;
      }
    } catch (e) {
      console.log('Permission error: ', e);
    }
  };
  requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await request(permission);
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

  onMapReady = () => {
    const {me} = this.props;
    const {fromLocation} = this.state;

    this.mapRef.animateCamera(
      {
        center: {
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
        },
        zoom: mapZoomLevel,
        altitude: mapZoomLevel,
      },
      {duration: mapAnimationDuration},
    );
  };

  moveToCurrentLocation = async () => {
    const {netInfo, getNearbyOwners, me} = this.props;
    const {radius} = this.state;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    const hasPermission = await this.hasLocationPermission();
    if (hasPermission) {
      this.setState({mapLoading: true});
      try {
        Geolocation.getCurrentPosition(
          position => {
            getNearbyOwners({
              radius,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            this.setState({
              currentLocation: position.coords,
              mapLoading: false,
              fromLocation: position.coords,
              showCustomCallout: false,
              customCalloutData: me,
              searchText: '',
            });
            this.mapRef.animateCamera(
              {
                center: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                zoom: mapZoomLevel,
                altitude: mapZoomLevel,
              },
              {duration: mapAnimationDuration},
            );
          },
          error => console.log(error.code, error.message),
          {enableHighAccuracy: true},
        );
      } catch (e) {
        console.log('GetCurrentLocation error: ', e);
      }
    }
  };

  onChangeRadius = rad => {
    const {netInfo, me, getNearbyOwners} = this.props;
    const {currentLocation, fromLocation} = this.state;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    this.setState({radius: rad});
    const loc = {
      latitude: fromLocation.latitude,
      longitude: fromLocation.longitude,
    };
    getNearbyOwners({...loc, radius: rad});
  };

  onChangeView = () => {
    const {screenView} = this.state;
    const {me} = this.props;

    if (screenView === 'map') {
      this.setState({
        showCustomCallout: false,
        customCalloutData: me,
        screenView: 'list',
      });
    } else {
      this.setState({
        showCustomCallout: false,
        customCalloutData: me,
        screenView: 'map',
      });
    }
  };

  onPressSearch = () => {
    this.setState({showAddressSearch: true});
  };

  onPressLocationSearched = loc => {
    const {getNearbyOwners} = this.props;
    const {radius, screenView} = this.state;

    const region = {
      latitude: loc.geometry.location.lat,
      longitude: loc.geometry.location.lng,
    };

    this.setState({searchText: loc.formatted_address, fromLocation: region});

    if (screenView === 'map') {
      this.mapRef.animateCamera(
        {center: region, zoom: mapZoomLevel, altitude: mapZoomLevel},
        {duration: mapAnimationDuration},
      );
    } else {
    }

    getNearbyOwners({...region, radius});
  };

  onRefreshList = () => {
    const {netInfo, getNearbyOwners} = this.props;
    const {fromLocation, radius} = this.state;

    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    this.setState({refreshingList: true});
    getNearbyOwners(
      {
        latitude: fromLocation.latitude,
        longitude: fromLocation.longitude,
        radius,
      },
      () => {
        this.setState({refreshingList: false});
      },
    );
  };

  onPressViewInMap = (loc, owner) => {
    this.setState({screenView: 'map'});
    setTimeout(() => {
      this.mapRef.animateCamera(
        {center: loc, zoom: 18, altitude: 18},
        {duration: mapAnimationDuration},
      );
      // this.markerRef[ownerId].showCallout();
      this.setState({showCustomCallout: true, customCalloutData: owner});
    }, 800);
  };
  onPressViewProfile = owner => {
    const {navigation} = this.props;
    navigation.navigate('OwnerProfile', {owner});
  };

  onPressCallout = owner => {
    const {navigation} = this.props;
    navigation.navigate('OwnerProfile', {owner});
  };

  onPressMarker = owner => {
    const loc = {latitude: owner.latitude, longitude: owner.longitude};
    this.setState({showCustomCallout: true, customCalloutData: owner});
    this.mapRef.animateCamera(
      {center: loc, zoom: 18, altitude: 18},
      {duration: mapAnimationDuration},
    );
  };

  onPressMap = () => {
    const {me} = this.props;
    this.setState({showCustomCallout: false, customCalloutData: me});
  };

  onPressMapCheckCoords = e => {
    const {nearbyOwners} = this.props;
    const {coordinate} = e.nativeEvent;
    let selectedOwner;
    let selectedOwnerDistance;
    if (nearbyOwners && nearbyOwners.length > 0) {
      nearbyOwners.map(owner => {
        const distance = R.helper.calculateDistance(
          {
            latitude: owner.latitude,
            longitude: owner.longitude,
          },
          coordinate,
        );
        if (distance <= CIRCLE_RADIUS) {
          if (!selectedOwner) {
            selectedOwner = owner;
            selectedOwnerDistance = distance;
          } else if (
            selectedOwner &&
            selectedOwnerDistance &&
            distance < selectedOwnerDistance
          ) {
            selectedOwner = owner;
            selectedOwnerDistance = distance;
          }
        }
      });
    }

    if (selectedOwner) {
      this.onPressMarker(selectedOwner);
    } else {
      this.onPressMap();
    }
  };

  render() {
    const {
      mapLoading,
      radius,
      currentLocation,
      showFilterOption,
      screenView,
      showAddressSearch,
      searchText,
      fromLocation,
      refreshingList,
      showCustomCallout,
      customCalloutData,
    } = this.state;
    const {me, nearbyOwners} = this.props;

    return (
      <ScreenContainer>
        <ScreenHeader title="Find Owners" onMenuPress={this.onMenuPress} />
        <SearchBar
          radius={radius}
          searchText={searchText}
          onPressFilter={() => this.setState({showFilterOption: true})}
          onSearchLocation={this.onPressSearch}
        />
        <View style={styles.mapContainer}>
          {screenView === 'map' && (
            <MapView
              ref={ref => (this.mapRef = ref)}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              onMapReady={this.onMapReady}
              onPress={this.onPressMapCheckCoords}>
              <Circle
                center={{
                  latitude: fromLocation.latitude,
                  longitude: fromLocation.longitude,
                }}
                radius={radius * 1000}
                strokeWidth={2}
                strokeColor={R.colors.bittersweet}
              />
              <Marker
                coordinate={{
                  latitude: currentLocation
                    ? currentLocation.latitude
                    : me.latitude,
                  longitude: currentLocation
                    ? currentLocation.longitude
                    : me.longitude,
                }}>
                <Image
                  style={[styles.navigationIcon]}
                  source={R.images.icon.navigation}
                />
              </Marker>
              {nearbyOwners &&
                nearbyOwners.length > 0 &&
                nearbyOwners.map(owner => {
                  const {latitude, longitude} = owner;
                  if (owner._id === me._id) {
                    return null;
                  }

                  return (
                    <View key={owner._id}>
                      {/* <Marker
                        ref={ref => (this.markerRef[owner._id] = ref)}
                        coordinate={{latitude, longitude}}
                        onPress={() => this.onPressMarker(owner)}>
                        <Image
                          style={styles.pinIcon}
                          source={R.images.icon.locationPin}
                        />
                      </Marker> */}
                      <Circle
                        center={{
                          latitude,
                          longitude,
                        }}
                        radius={CIRCLE_RADIUS}
                        strokeWidth={2}
                        strokeColor={R.colors.amethyst}
                        fillColor={
                          owner._id === customCalloutData._id
                            ? R.colors.rgbaCustom(253, 108, 89, 0.3)
                            : R.colors.rgbaWhiteColor(0.2)
                        }
                        onPress={() => console.log('huehue')}
                      />
                    </View>
                  );
                })}
            </MapView>
          )}
          {screenView === 'list' && (
            <ListView
              nearbyOwners={
                nearbyOwners && nearbyOwners.length > 0
                  ? nearbyOwners.filter(o => o._id !== me._id)
                  : []
              }
              refreshing={refreshingList}
              onRefresh={this.onRefreshList}
              currentLocation={{
                latitude: currentLocation
                  ? currentLocation.latitude
                  : me.latitude,
                longitude: currentLocation
                  ? currentLocation.longitude
                  : me.longitude,
              }}
              onPressViewInMap={this.onPressViewInMap}
              onPressViewProfile={this.onPressViewProfile}
            />
          )}
          <View style={styles.fabContainer}>
            {screenView === 'map' && (
              <FAB
                style={styles.fab}
                icon={{
                  font: 'Material',
                  name: 'my-location',
                  size: 24,
                  color: R.colors.bittersweet,
                }}
                onPress={this.moveToCurrentLocation}
              />
            )}
            <FAB
              style={styles.fab}
              icon={{
                font: 'Ionicons',
                name: screenView === 'list' ? 'map-outline' : 'list',
                size: 28,
                color: R.colors.amethyst,
              }}
              onPress={this.onChangeView}
            />
          </View>
          <FilterOption
            isVisible={showFilterOption}
            onClose={() => this.setState({showFilterOption: false})}
            radius={radius}
            onChangeRadius={this.onChangeRadius}
          />
          {showCustomCallout && (
            <TouchableOpacity
              style={styles.customCallout}
              onPress={() => this.onPressCallout(customCalloutData)}>
              <CalloutContent
                owner={customCalloutData}
                currentLocation={currentLocation}
              />
            </TouchableOpacity>
          )}
        </View>
        <SearchAddressModal
          isVisible={showAddressSearch}
          onClose={() => this.setState({showAddressSearch: false})}
          onPressLocation={this.onPressLocationSearched}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    paddingBottom: 60,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fab: {
    marginRight: 15,
    marginBottom: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 0,
  },
  navigationIcon: {
    width: R.values.x * 0.12,
    height: R.values.x * 0.12,
    resizeMode: 'contain',
  },
  pinIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    opacity: 0,
  },
  customCallout: {
    position: 'absolute',
    top: 20,
    left: 30,
    right: 30,
    backgroundColor: R.colors.white,
    elevation: 3,
  },
});
