import React from 'react';
import {View} from 'react-native';
import {Button,Icon} from 'react-native-elements'
import style from './UploadButton.scss'


export default function UploadButton(props){
    
    const [loaded, setLoaded] = React.useState(true);
    return(
        <View style={props.style}>
            {loaded&&
                <Button
                    onPress={props.onPress} 
                    icon={<Icon
                        name='cloud-upload'
                        type='simple-line-icon'
                        color='#fff'
                        size={35}
                        containerStyle={{marginRight:40}}
                    />}
                    titleStyle={style.titleStyle}
                    buttonStyle={style.buttonStyle}
                    title={'Upload Profile Picture'}
                />
            }
        </View>
    );
};