import React from 'react';
import {View} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

export default function CustomRadioButton(props) {
  return (
    <RadioForm formHorizontal={true} animation={true} initial={0} val>
      {props.radioProps.map((obj, i) => (
        <View style={{width: props.width, marginHorizontal: 5}} key={i}>
          <RadioButton labelHorizontal={true} key={i}>
            <RadioButtonInput
              onPress={value => props.onPress({value})}
              isSelected={obj.value === props.value}
              obj={obj}
              index={i}
              borderWidth={3}
              buttonSize={20}
              buttonInnerColor={props.color}
              buttonOuterColor={props.color}
              buttonOuterSize={30}
              buttonStyle={{}}
              buttonWrapStyle={{marginLeft: 10}}
            />
            <RadioButtonLabel
              onPress={value => props.onPress({value})}
              obj={obj}
              index={i}
              labelHorizontal={true}
              labelWrapStyle={{}}
              labelStyle={{fontFamily: 'WorkSans-Regular'}}
            />
          </RadioButton>
        </View>
      ))}
    </RadioForm>
  );
}
