import {PixelRatio, Dimensions, StatusBar, Platform} from 'react-native';

// Precalculate Device Dimensions for better performance
const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;
const ar = x / y; // aspect ratio
const dpi = PixelRatio.get();

// Calculating ratio from iPhone breakpoints
const densityX = x < 320 ? 0.75 : 0.875;
const ratioX = x < 375 ? densityX : 1;

// We set our base font size value
const baseUnit = 16;

// We're simulating EM by changing font size according to Ratio
const unit = baseUnit * ratioX;

// We add an em() shortcut function
function em(value) {
  return unit * value;
}

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const {height: W_HEIGHT, width: W_WIDTH} = Dimensions.get('window');

let isIPhoneX = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX =
    (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
    (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
}

const getStatusBarHeight = skipAndroid => {
  return Platform.select({
    ios: isIPhoneX ? 44 : 20,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0,
  });
};

const imagePickerPhotoOptions = {
  mediaType: 'photo',
  maxWidth: 1200,
  maxHeight: 1200,
  includeBase64: false,
};

const rootStyles = {
  DEVICE_DENSITY: dpi,
  DEVICE_ASPECT_RATIO: ar,

  em,
  getStatusBarHeight,

  x,
  y,
  imagePickerPhotoOptions,
};

export default rootStyles;
