import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import {human} from 'react-native-typography';
import Snackbar from 'react-native-snackbar';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import CustomButton from 'component/CustomButton';
import LoadingOverlay from 'component/LoadingOverlay';

import Pet from './component/Pet';

import R from 'res/R';

export default function MyPet({
  netInfo,
  navigation,
  error,
  me,
  userPets,
  //creators
  getUserPets,
  deletePet,
  getPetPhotos,
}) {
  const [screenError, setScreenError] = useState(error);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    if (netInfo.isInternetReachable) {
      getUserPets(me._id, () => {
        setLoading(false);
      });
    } else {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (error && error !== screenError && navigation.isFocused()) {
      setShowLoadingOverlay(false);
      Alert.alert('Error', error.error.message);
      setScreenError(error);
    }
  }, [error]);

  const onMenuPress = () => {
    navigation.navigate('SettingsNavigation');
  };

  const onPressAddPet = () => {
    navigation.navigate('AddPet');
  };

  const onRefreshList = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    setRefreshing(true);
    getUserPets(me._id, () => {
      setRefreshing(false);
    });
  };

  const onPressDeletePet = pet => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'No network connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    if (!pet) {
      return;
    }

    Alert.alert('Delete pet', 'Are you sure you want to delete this pet?', [
      {text: 'CANCEL'},
      {
        text: 'DELETE',
        onPress: () => {
          setLoadingText('Deleting pet...');
          setShowLoadingOverlay(true);
          getPetPhotos(pet._id, async res => {
            for (const photo of res) {
              await R.firebase.deleteFile(photo.key);
            }
            deletePet(pet._id, () => {
              setShowLoadingOverlay(false);
              Alert.alert(null, 'Pet deleted.');
            });
          });
        },
      },
    ]);
  };

  const onPressPet = pet => {
    navigation.navigate('PetProfile', {pet});
  };
  const onPressEditPet = pet => {
    navigation.navigate('EditPet', {pet});
  };

  const renderPet = ({item}) => {
    return (
      <Pet
        data={item}
        onPress={() => onPressPet(item)}
        onPressDelete={() => onPressDeletePet(item)}
        onPressEdit={() => onPressEditPet(item)}
      />
    );
  };
  const renderListFooter = () => {
    if (userPets[me._id] && userPets[me._id].length > 0) {
      return null;
    }
    return <Text style={styles.noDataText}>No pet added yet.</Text>;
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="My Pet" onMenuPress={onMenuPress} />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={R.colors.bittersweet} />
        ) : (
          <FlatList
            data={userPets[me._id] ? userPets[me._id] : []}
            keyExtractor={i => i._id}
            renderItem={renderPet}
            refreshing={refreshing}
            onRefresh={onRefreshList}
            ListFooterComponent={renderListFooter}
          />
        )}
        <CustomButton
          containerStyle={styles.addBtn}
          label="ADD PET"
          onPress={onPressAddPet}
        />
      </View>
      <LoadingOverlay isVisible={showLoadingOverlay} text={loadingText} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 10,
    backgroundColor: R.colors.white,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
    paddingTop: 10,
  },
  addBtn: {
    marginHorizontal: 40,
    marginTop: 30,
    marginBottom: 20,
  },
  addBtnText: {
    ...human.calloutWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  noDataText: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    textAlign: 'center',
    marginTop: 20,
  },
});
