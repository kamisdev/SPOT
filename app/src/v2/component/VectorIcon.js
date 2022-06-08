import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function VectorIcon({font, name, size, color, style, fontType}) {
  switch (font) {
    case 'Feather':
      return (
        <View style={style}>
          <Feather name={name} size={size} color={color} />
        </View>
      );
    case 'FontAwesome':
      return (
        <View style={style}>
          <FontAwesome name={name} size={size} color={color} />
        </View>
      );
    case 'MaterialCommunity':
      return (
        <View style={style}>
          <MaterialCommunityIcons name={name} size={size} color={color} />
        </View>
      );
    case 'AntDesign':
      return (
        <View style={style}>
          <AntDesign name={name} size={size} color={color} />
        </View>
      );
    case 'Ionicons':
      return (
        <View style={style}>
          <Ionicons name={name} size={size} color={color} />
        </View>
      );
    case 'SimpleLine':
      return (
        <View style={style}>
          <SimpleLineIcons name={name} size={size} color={color} />
        </View>
      );
    case 'Material':
      return (
        <View style={style}>
          <MaterialIcons name={name} size={size} color={color} />
        </View>
      );
    default:
      return <View />;
  }
}
