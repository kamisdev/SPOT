import React from 'react';
import {Svg, Path} from 'react-native-svg';
import {View, Text} from 'react-native';
import styles from './ChatBubble.scss';
import AvatarSmall from '../AvatarSmall/AvatarSmall';
import QuicksandBoldText from '../QuicksandBoldText/QuicksandBoldText';
import * as Animatable from 'react-native-animatable';

export default function ChatBubble(props) {
  return (
    <View style={{...styles.container, transform: [{scaleY: -1}]}}>
      <Animatable.View
        animation="fadeInUpBig"
        style={{...styles.chatBubble, backgroundColor: props.color}}>
        <AvatarSmall source={props.avatar} />
        <View style={styles.texts}>
          <View style={styles.upperText}>
            <QuicksandBoldText style={{fontSize: 18, color: props.textColor}}>
              {props.name}
            </QuicksandBoldText>
            <Text style={{...styles.text, color: props.textColor}}>
              {props.timestamp}
            </Text>
          </View>
          <Text
            style={{...styles.text, marginRight: 20, color: props.textColor}}>
            {props.text}
          </Text>
        </View>
      </Animatable.View>
      <View style={props.inverted ? styles.chatArrowFlip : styles.chatArrow}>
        <Animatable.View animation="fadeInUpBig">
          <Svg
            style={styles.svg}
            width="100%"
            height="100%"
            viewBox="0 0 300 400">
            <Path
              fill={props.color}
              d="M5718,952v91.008l63.676-76.888Z"
              transform="translate(-5668 -695)"
            />
          </Svg>
        </Animatable.View>
      </View>
    </View>
  );
}
