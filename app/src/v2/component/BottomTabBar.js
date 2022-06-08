import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
} from 'react-native';
import {human} from 'react-native-typography';
import {Svg, Path, Circle, G} from 'react-native-svg';
import {vw, vh} from 'react-native-expo-viewport-units';
import {useSafeArea} from 'react-native-safe-area-context';

import CustomBadge from './CustomBadge';

import R from 'res/R';

export default function BottomTabBar({state, descriptors, navigation}) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  });

  return !isKeyboardVisible ? (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          navigation.navigate(route.name, {screen: route.name});
          // if (!isFocused && !event.defaultPrevented) {
          //   navigation.navigate(route.name);
          // }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let icon = R.images.icon.profile;
        if (route.name === 'MyPet') {
          icon = R.images.icon.pawOutline;
        } else if (route.name === 'FindOwners') {
          icon = R.images.icon.find;
        } else if (route.name === 'Message') {
          icon = R.images.icon.message;
        }

        return isFocused ? (
          <ActiveTab key={label} icon={icon} label={label} route={route.name} />
        ) : (
          <TouchableWithoutFeedback
            key={label}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}>
            <View style={styles.tab}>
              <Image style={styles.tabIcon} source={icon} />
              <Text style={styles.tabText}>{label.toUpperCase()}</Text>
              {label === 'Message' && (
                <CustomBadge containerStyle={styles.badgeContainer} />
              )}
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  ) : null;
}

// function ActiveTab({label, route}) {
//   let imgSrc = R.images.homeActive;
//   if (route === 'MyPet') {
//     imgSrc = R.images.petActive;
//   } else if (route === 'FindOwners') {
//     imgSrc = R.images.placeActive;
//   } else if (route === 'Message') {
//     imgSrc = R.images.messageActive;
//   }

//   return (
//     <View style={{width: R.values.x / 4}}>
//       <Image
//         style={{width: R.values.x / 4, height: undefined, aspectRatio: 0.88}}
//         source={imgSrc}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 0,
//     alignItems: 'flex-end',
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: R.colors.bittersweet,
//     height: vw(19.13),
//   },
//   tabText: {
//     ...human.caption2White,
//     fontFamily: R.fonts.WorkSansSemiBold,
//     marginTop: 7,
//   },
//   tabIcon: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
// });

function ActiveTab({icon, label}) {
  const insets = useSafeArea();
  return (
    <View
      style={{
        position: 'relative',
        width: R.values.x / 4,
      }}>
      <Svg
        width={R.values.x / 4}
        height={R.values.x / 4 - 10}
        viewBox="0 0 316 297"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: insets.bottom,
          // shadowColor: '#000',
          // shadowOffset: {
          //   width: 0,
          //   height: 4,
          // },
          // shadowOpacity: 0.4,
          // shadowRadius: 2.65,
        }}>
        <G transform="translate(63.000000, 0.000000)">
          <Circle fill="#FD6C59" cx="89" cy="89" r="89" />
        </G>
      </Svg>
      <Svg
        width={R.values.x / 4}
        height={R.values.x / 4 - 10}
        viewBox="0 0 316 297"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: insets.bottom,
        }}>
        <G transform="translate(0.000000, 89.000000)">
          <Path
            fill="#FD6C59"
            d="M3.40268863e-09,0.0524908816 C3.11877119,0.339538931 6.19858836,0.958763298 9.187,1.9 C12.3775815,2.9133217 15.465031,4.22651734 18.408,5.822 C24.4642202,9.18787483 30.057101,13.3269024 35.046,18.135 C45.133,27.628 53.701,39.351 60.752,49.567 C76.8608852,80.1215908 107.336434,100.449939 141.73479,103.585596 C176.133145,106.721253 209.781994,92.2383033 231.15,65.1 C231.65,64.48 232.182,63.784 232.782,62.973 C233.67,61.784 234.548,60.553 235.392,59.312 C236.379,57.892 237.42,56.367 238.521,54.752 C245.369,44.716 254.747,30.971 266.749,19.868 C269.748006,17.0783839 272.925388,14.4869071 276.261,12.11 C279.596164,9.73546798 283.126447,7.64767324 286.814,5.869 C290.532848,4.08149751 294.428345,2.68759134 298.437,1.71 C302.603309,0.706664671 306.873581,0.199146055 311.159,0.198 C312.412637,0.203308395 313.665592,0.138540711 314.912,0.004 L316,0.004 L316,208 L0,208 L0,0.0524906839 Z"
          />
        </G>
      </Svg>
      <Image
        style={[styles.activeTabIcon, {bottom: vw(12) + insets.bottom}]}
        source={icon}
      />
      {label === 'Message' && (
        <CustomBadge containerStyle={styles.badgeActiveContainer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.bittersweet,
    height: vw(15.5),
  },
  tabText: {
    ...human.caption2White,
    fontFamily: R.fonts.WorkSansSemiBold,
    marginTop: 7,
  },
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  activeTabIcon: {
    height: vw(6.5),
    width: vw(6.5),
    resizeMode: 'contain',
    left: vw(8.7),
    position: 'absolute',
    // bottom: vw(12) + insets.bottom,
    // zIndex: 99,
  },
  badgeActiveContainer: {
    position: 'absolute',
    top: -10,
    right: vw(9),
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    right: vw(8),
  },
});
