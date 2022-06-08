import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {human} from 'react-native-typography';
import ImageView from 'react-native-image-viewing';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';
import UserAvatar from 'component/UserAvatar';
import GalleryPhoto from 'component/GalleryPhoto';

import ProfileContent from './component/ProfileContent';
import Tabs from './component/Tabs';
import OwnerGallery from './component/OwnerGallery';

import R from 'res/R';

const photoWidth = R.values.x / 3 - 6;
const photoHeight = 125;

export default class OwnerProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      owner: props.route.params.owner,
      tab: 'pet',
      petListLoading: true,
      showImageViewer: false,
      imageViewerIndex: 0,
      imageViewerData: [],
    };
  }

  componentDidMount() {
    const {netInfo, getUserPets, getUserPhotos} = this.props;
    const {owner} = this.state;

    if (netInfo.isInternetReachable) {
      getUserPets(owner._id, () => {
        this.setState({petListLoading: false});
      });
      getUserPhotos(owner._id);
    } else {
      this.setState({petListLoading: false});
    }
  }

  componentDidUpdate(prevProps) {
    const {netInfo, navigation, error, getUserPets} = this.props;

    if (navigation.isFocused() && error !== prevProps.error) {
      Alert.alert(null, error.error.message);
    }

    if (netInfo !== prevProps.netInfo && netInfo.isInternetReachable) {
      getUserPets(owner._id, () => {
        this.setState({petListLoading: false});
      });
    }
  }

  onPressPet = pet => {
    const {navigation} = this.props;
    navigation.navigate('PetProfile', {pet});
  };

  onBackPress = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onPressMessageOwner = () => {
    const {navigation} = this.props;
    const {owner} = this.state;
    navigation.navigate('ChatScreen', {user: owner});
  };

  onPressTab = tab => {
    this.setState({tab});
  };

  renderPet = ({item}) => {
    const {petListLoading} = this.state;
    if (petListLoading) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.petContainer}
        onPress={() => this.onPressPet(item)}>
        <UserAvatar
          img={item.image ? {uri: item.image.image} : R.images.petDefaultAvatar}
          size={60}
        />
        <View style={styles.petInfoContainer}>
          <Text style={styles.petName}>{item.petName}</Text>
          <Text style={styles.petInfo}>{`${
            item.breed
          } | ${R.helper.computePetAge(item.birthDate)}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderGalleryPhoto = ({item, index}) => {
    return (
      <GalleryPhoto
        data={item}
        width={photoWidth}
        height={photoHeight}
        onPress={() => this.onPressGalleryPhoto(index)}
      />
    );
  };
  onPressGalleryPhoto = i => {
    const images = this.getImagesUri();
    this.setState({
      imageViewerData: images,
      imageViewerIndex: i,
      showImageViewer: true,
    });
  };

  getImagesUri = () => {
    const {owner} = this.state;
    const {userPhotos} = this.props;
    const photos =
      userPhotos && userPhotos[owner._id] ? userPhotos[owner._id] : [];

    if (!photos || photos.length === 0) {
      return [];
    }

    const imgs = [];
    photos.forEach(photo => {
      imgs.push({uri: photo.image});
    });

    return imgs;
  };

  getListData = () => {
    const {tab, owner} = this.state;
    const {userPets, userPhotos} = this.props;

    let data = [];
    if (tab === 'pet' && userPets && userPets[owner._id]) {
      data = userPets[owner._id];
    } else if (tab === 'gallery' && userPhotos && userPhotos[owner._id]) {
      data = userPhotos[owner._id];
    }

    return data;
  };

  render() {
    const {
      owner,
      tab,
      petListLoading,
      imageViewerData,
      imageViewerIndex,
      showImageViewer,
    } = this.state;
    const {userPets, userPhotos} = this.props;

    return (
      <ScreenContainer>
        <ScreenHeader title="Owner Profile" onBackPress={this.onBackPress} />
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={this.getListData()}
          keyExtractor={i => i._id}
          renderItem={tab === 'pet' ? this.renderPet : this.renderGalleryPhoto}
          numColumns={3}
          ListHeaderComponent={
            <>
              <ProfileContent
                data={owner}
                onPressMessage={this.onPressMessageOwner}
              />
              <Tabs tab={tab} onPressTab={this.onPressTab} />
              {petListLoading && (
                <ActivityIndicator
                  style={{marginTop: 30}}
                  size="large"
                  color={R.colors.bittersweet}
                />
              )}
            </>
          }
        />
        <ImageView
          images={imageViewerData}
          imageIndex={imageViewerIndex}
          visible={showImageViewer}
          onRequestClose={() => this.setState({showImageViewer: false})}
        />
        {/* {tab === 'pet' && (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={userPets && userPets[owner._id] ? userPets[owner._id] : []}
            keyExtractor={i => i._id}
            renderItem={this.renderPet}
            ListHeaderComponent={
              <>
                <ProfileContent
                  data={owner}
                  onPressMessage={this.onPressMessageOwner}
                />
                <Tabs tab={tab} onPressTab={this.onPressTab} />
                {petListLoading && (
                  <ActivityIndicator
                    style={{marginTop: 30}}
                    size="large"
                    color={R.colors.bittersweet}
                  />
                )}
              </>
            }
          />
        )}
        {tab === 'gallery' && (
          <OwnerGallery
            tab={tab}
            userPhotos={
              userPhotos && userPhotos[owner._id].length > 0
                ? userPhotos[owner._id]
                : []
            }
            owner={owner}
            onPressMessageOwner={this.onPressMessageOwner}
            onPressTab={this.onPressTab}
          />
        )} */}
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  petContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: R.colors.white,
    marginHorizontal: 15,
    marginTop: 10,
  },
  petInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  petName: {
    ...human.body,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  petInfo: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
  },
});
