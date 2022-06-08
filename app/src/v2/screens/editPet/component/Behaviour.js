import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {human} from 'react-native-typography';

import Input from 'component/Input';
import VectorIcon from 'component/VectorIcon';

import R from 'res/R';

export default function Behaviour({list, onAdd, onRemove}) {
  const [behaviorVal, setBehaviorVal] = useState('');

  const handleOnAddBehavior = () => {
    onAdd(behaviorVal);
    setBehaviorVal('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          containerStyle={{flex: 1}}
          label="Behaviour"
          placeholder="Enter pet behaviour"
          value={behaviorVal}
          onChangeText={t => setBehaviorVal(t)}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleOnAddBehavior}>
          <Text style={styles.addBtnText}>ADD</Text>
        </TouchableOpacity>
      </View>
      {list &&
        list.length > 0 &&
        list.map((o, index) => {
          return (
            <View key={index} style={styles.behaviorContainer}>
              <Image style={styles.pawIcon} source={R.images.icon.pet} />
              <Text style={styles.behavior}>{o}</Text>
              <TouchableOpacity onPress={() => onRemove(o)}>
                <VectorIcon
                  font="Feather"
                  name="x"
                  size={24}
                  color={R.colors.redRibbon}
                />
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    ...human.subhead,
    fontFamily: R.fonts.WorkSansSemiBold,
    color: R.colors.fontMain,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  addBtn: {
    padding: 15,
    marginLeft: 10,
    marginBottom: 5,
    backgroundColor: R.colors.bittersweet,
    borderRadius: 5,
  },
  addBtnText: {
    ...human.footnoteWhite,
    fontFamily: R.fonts.WorkSansSemiBold,
  },
  behaviorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  behavior: {
    ...human.callout,
    fontFamily: R.fonts.WorkSansRegular,
    flex: 1,
    marginHorizontal: 10,
  },
  pawIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
