import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import VectorIcon from 'component/VectorIcon';

import R from 'res/R';
import {human} from 'react-native-typography';

export default function ChatInput({onPressSend}) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [inputVal, setInputVal] = useState('');

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

  const handleOnPressSend = () => {
    if (!inputVal || inputVal === '') {
      return;
    }

    onPressSend(inputVal, () => setInputVal(''));
    // setInputVal('');
  };

  return (
    <Animatable.View
      transition="marginBottom"
      style={[styles.container, {marginBottom: 20}]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          multiline
          value={inputVal}
          onChangeText={t => setInputVal(t)}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleOnPressSend}>
          <VectorIcon
            font="Feather"
            name="arrow-right"
            size={22}
            color={R.colors.white}
          />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    backgroundColor: R.colors.white,
    borderRadius: 10,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomColor: R.colors.alto,
    borderBottomWidth: 1,
    margin: 10,
    paddingBottom: 8,
  },
  input: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansRegular,
    padding: 0,
    flex: 1,
    paddingHorizontal: 5,
    minHeight: 35,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendBtn: {
    backgroundColor: R.colors.pictonBlue,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
