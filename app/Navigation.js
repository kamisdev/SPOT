import React from 'react';
import {View,Text,Image} from 'react-native';
import { Svg, Path, Circle, G } from 'react-native-svg';
import { vw, vh } from 'react-native-expo-viewport-units';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import {TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';


import Register from './src/views/Register/Register.js';
import Login from './src/views/Login/Login.js';
import RegisterPet from './src/views/RegisterPet/RegisterPet.js';
import PetList from './src/views/PetList/PetList.js';
import ProfileHuman from './src/views/ProfileHuman/ProfileHuman.js';
import ProfilePet from './src/views/ProfilePet/ProfilePet.js';
import Inbox from './src/views/Inbox/Inbox.js'
import Thread from './src/views/Thread/Thread.js';
import Settings from './src/views/Settings/Settings.js'
import WebComponent from './src/views/WebComponent/WebComponent.js'

import CompatibleOwners from './src/views/CompatibleOwners/CompatibleOwners.js';
import ProfileOwner from './src/views/ProfileOwner/ProfileOwner.js'

import addressBook from './src/assets/img/address-book.png';
import pet from './src/assets/img/animal-paw-print-outline.png';
import find from './src/assets/img/find.png';
import conversation from './src/assets/img/conversation.png'
import { useSafeArea } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const ActivatedTab = (props) => {
  const insets = useSafeArea();

  return(
    <View key={props.key} 
      styles={{
        justifyContent: 'flex-end',
      }}
    >
      
      <View 
        style={{
          position:'relative',
          width: vw(25)
        }}
      >
      <Svg
      width={vw(25)} height={vw(22)}
        viewBox="0 0 316 297"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: insets.bottom,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.40,
          shadowRadius: 2.65,
        }}
      >
        <G transform="translate(63.000000, 0.000000)">
          <Circle fill="#FD6C59"  cx="89" cy="89" r="89"/>
        </G>

      </Svg>
      <Svg
      width={vw(25)} height={vw(22)}
        viewBox="0 0 316 297"
        preserveAspectRatio="none"
        style={{
          position:'absolute',
          bottom: insets.bottom,

        }}
      >
        <G transform="translate(0.000000, 89.000000)">
          <Path
            fill="#FD6C59" 
            d="M3.40268863e-09,0.0524908816 C3.11877119,0.339538931 6.19858836,0.958763298 9.187,1.9 C12.3775815,2.9133217 15.465031,4.22651734 18.408,5.822 C24.4642202,9.18787483 30.057101,13.3269024 35.046,18.135 C45.133,27.628 53.701,39.351 60.752,49.567 C76.8608852,80.1215908 107.336434,100.449939 141.73479,103.585596 C176.133145,106.721253 209.781994,92.2383033 231.15,65.1 C231.65,64.48 232.182,63.784 232.782,62.973 C233.67,61.784 234.548,60.553 235.392,59.312 C236.379,57.892 237.42,56.367 238.521,54.752 C245.369,44.716 254.747,30.971 266.749,19.868 C269.748006,17.0783839 272.925388,14.4869071 276.261,12.11 C279.596164,9.73546798 283.126447,7.64767324 286.814,5.869 C290.532848,4.08149751 294.428345,2.68759134 298.437,1.71 C302.603309,0.706664671 306.873581,0.199146055 311.159,0.198 C312.412637,0.203308395 313.665592,0.138540711 314.912,0.004 L316,0.004 L316,208 L0,208 L0,0.0524906839 Z"
          />
        </G>
        

      </Svg>
      </View>
      <Image 
        source={props.source}
        style={{
          height:vw(6),
          width: vw(6),
          resizeMode: 'contain',
          left: vw(9),
          position: "absolute",
          bottom: vw(12)+insets.bottom,
          zIndex: 99,
        }}
      />
    </View>
  )
}

function mapState(state) {
  const { 
    messageBadge
      } = state.message;

  return { 
    messageBadge

   };
}

const CustomTabBarStore = connect(mapState)(CustomTabBar)
function CustomTabBar({ state, descriptors, navigation, messageBadge }) {
  const insets = useSafeArea();

  return (
    <View style={{ 
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -2,
      }}>
        <View style={{ 
        flex:1,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor:'#FD6C59',
        height: insets.bottom+10
      }}></View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        var icon
        if(route.name==='Profile'){
             icon = addressBook;
         } else if (route.name==='My Pet'){
             icon = pet;

            } else if (route.name==='Find Owners'){
              icon = find;

            } else if (route.name==='Messages'){
              icon = conversation;
            }

        

        if (isFocused) {
          return (<ActivatedTab source={icon} />);
        } else {
        return (
          <View key={index} style={{
            flex:1,
            marginLeft: -1,
            minWidth: vw(25.5),
            }}>
          <SafeAreaView>
          <TouchableWithoutFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ 
             
              height: vw(15.5), 
              backgroundColor:'#FD6C59',
                            
            }}
          >
            <View
              style={{
                flex:1, 
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
                }}
            >
              {route.name==='Messages'&& messageBadge>0 &&
              <View
                style={{
                  backgroundColor: 'white',
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  position: 'absolute',
                  top: 3,
                  right: vw(5),
                  zIndex: 2,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text
                  style={{
                    color: 'red',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {messageBadge}
                </Text>
              </View>
              } 
              <Image
                source={icon}
                overflow="visible"
                style={{
                  height:25,
                  width: 25,
                  resizeMode: 'contain'
                }}
              />
              <Text
                style={{ 
                  fontFamily: 'WorkSans-SemiBold',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textAlign:'center', 
                  fontSize: 10
                  }}
              >
                {label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          </SafeAreaView>
          </View>
        );
        }
      })}
    </View>
  );
}

const PetStack = () =>  {
  return (
    <Stack.Navigator
    initialRouteName={'PetList'} 
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="ProfilePet" component={ProfilePet} />
      <Stack.Screen name="PetList" component={PetList} />
      <Stack.Screen name="RegisterPet" component={RegisterPet} />
    </Stack.Navigator>
  );
};

const OwnerStack = () =>  {
  return (
    <Stack.Navigator
    initialRouteName={'CompatibleOwners'} 
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="CompatibleOwners" component={CompatibleOwners} />
      <Stack.Screen name="ProfileOwner" component={ProfileOwner} />
      <Stack.Screen name="OwnerPet" component={ProfilePet} />
    </Stack.Navigator>
  );
};

const MessageStack = () =>  {
  return (
    <Stack.Navigator
    initialRouteName={'Inbox'} 
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen name="Thread" component={Thread} />
    </Stack.Navigator>
  );
};

const SettingsStack = () =>  {
  return (
    <Stack.Navigator
    initialRouteName={'Settings'} 
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="WebComponent" component={WebComponent} />

    </Stack.Navigator>
  );
};


const TabNavigation = () =>  {
  return (
      <Tab.Navigator
        tabBar={props => <CustomTabBarStore {...props} />}
        
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
        initialRouteName={'Profile'}
      >
        <Tab.Screen name="Profile" component={ProfileHuman} />
        <Tab.Screen name="My Pet" component={PetStack} />
        <Tab.Screen name="Find Owners" component={OwnerStack} />
        <Tab.Screen name="Messages" component={MessageStack} />
      </Tab.Navigator>
  );
};

const Navigation=() =>{
  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabbed" component={TabNavigation} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SettingsStack" component={SettingsStack} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default Navigation;
