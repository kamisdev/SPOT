import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';

import ScreenContainer from 'component/ScreenContainer';
import ScreenHeader from 'component/ScreenHeader';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function WebComponent({netInfo, navigation, route}) {
  const {url} = route.params;
  const [loading, setLoading] = useState(true);

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <ScreenHeader onBackPress={onBackPress} />
      <View style={styles.webContainer}>
        {/* {loading && (
          <ActivityIndicator
            style={{marginTop: 20}}
            size="large"
            color={R.colors.bittersweet}
          />
        )} */}
        {netInfo.isInternetReachable ? (
          <WebView source={{uri: url}} onLoad={() => setLoading(false)} />
        ) : (
          <Text style={styles.noInternet}>No internet connection</Text>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
  noInternet: {
    ...human.title3,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginTop: 40,
    textAlign: 'center',
  },
});
