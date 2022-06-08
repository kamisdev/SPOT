import React from 'react';
import { Text } from 'react-native';


export default function WorkSansText(props){
    
    const [loaded, setLoaded] = React.useState(true);

    return(
        <>
        {loaded&&
        <Text
            style={{...props.style,fontFamily:'Quicksand-Bold'}}
        >
            {props.children}
        </Text>
        }
        </>
    );
}