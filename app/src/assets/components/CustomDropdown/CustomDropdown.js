import React from 'react';
import {View} from 'react-native';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';


export default function CustomDropdown(props){
    

    return(
        <View
            style={{width:props.width}}
        >
            <RNPickerSelect
                items={props.items}
                value={props.value}
                onValueChange={props.onValueChange}
                useNativeAndroidPickerStyle={false}
                textInputProps={{ underlineColorAndroid: 'cyan' }}
                placeholder={props.placeholder}
                style={{
                    inputIOS: {
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderColor: '#D8D8D8',
                        color: 'black',
                        paddingRight: 30, // to ensure the text is never behind the icon
                      },
                      inputAndroid: {
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderWidth: 0.5,
                        borderColor: '#D8D8D8',
                        borderRadius: 8,
                        color: 'black',
                        paddingRight: 30, // to ensure the text is never behind the icon
                      },
                }}
                Icon={() => {
                return <Chevron size={1} color="gray" style={{marginTop:20}} />;
                }}
            />
        </View>
    );
};