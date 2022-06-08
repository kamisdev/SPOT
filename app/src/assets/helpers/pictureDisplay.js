import { BUCKET_URL } from 'react-native-dotenv';
import defaultAvatar from '../img/default-avatar.png'

export default function pictureDisplay(uri){
    if (uri){
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    if (uri.match(regex)){
        return {uri:uri}
    } else {
        return {uri:BUCKET_URL+uri}
    }
    } else {
        return defaultAvatar
    }
}