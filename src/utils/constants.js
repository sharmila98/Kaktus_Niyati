import {Dimensions, Platform, ToastAndroid} from 'react-native';
import Orientation from 'react-native-orientation';

export const PLATFORM = Platform.OS;

export const NOINTERCONNECT = 'No Internet connection';

export const HEIGHT = Dimensions.get('window').height / 100;
export const WIDTH = Dimensions.get('window').width / 100;

export var responsiveFontSize = (f) => {
  const initial = Orientation.getInitialOrientation();
  var value = Dimensions.get('window').width;
  const tempHeight = (16 / 9) * value;
  return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(value, 2)) * (f / 100);
};

export const respFontSize = (f) => {
  var value = Dimensions.get('window').height;
  const tempHeight = (16 / 9) * value;
  return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(value, 2)) * (f / 100);
};

export const WHITE = '#fff';
export const BLACK = '#000';

export const GREY = 'grey';
export const GREYLIGHT = '#C7C5C5';
export const FACEBOOK = '#4267B2';
export const GOOGLE = '#4285F4';
export const SPLASHTEXT='#354657'

export const THEME = '#00A7E1';
export const THEMEGRADIENT = '#F9F5F7';
export const BORDER = '#00000029';
export const BORDERDRAWER = '#959191';
export const TEXTCOLOR = '#5D5C5C';

export const GREENCOLOR = '#205859';
export const GREENLIGHT = '#2EF363';

export const ICONKAKTUS = require('./../assets/icons/BlueKaktus.png');
export const ICONKAKTUSLOGO = require('./../assets/icons/KaktusLogo.png');
export const ICONMAINLOGO= require('./../assets/icons/MainLogo.png');
export const ICONPOWERDEDLOGO = require('./../assets/icons/PoweredLogo.png');
export const ICONFINGERPRINT = require('./../assets/icons/Fingerprint.png');
export const ICONORANGE = require('./../assets/icons/IconOrange.png');
export const ICONBLUE = require('./../assets/icons/IconBlue.png');
export const ICONGREEN = require('./../assets/icons/IconGreen.png');
export const ICONHEART = require('./../assets/icons/IconHeart.png');
export const ICONWATERMARK = require('./../assets/icons/WaterMark.png');
export const ICONARROW = require('./../assets/icons/IconArrowOrange.png');
export const ICONUNCHECK = require('./../assets/icons/icon_uncheck.png');
export const ICONCALENDER = require('./../assets/icons/Calender.png');
export const ICONTICK = require('./../assets/icons/Tick.png');
export const ICONCONFLICT = require('./../assets/icons/conflict.png');

export const SUIFONT = 'SegoeUI';
export const SUIBOLDFONT = 'SegoeUI-Bold';
export const SUIITALICFONT = 'SegoeUI-Italic';
export const PROXIMANOVABOLDFONT = 'ProximaNova-Bold';
export const PROXIMANOVAREGULARFONT = 'ProximaNova-Regular';




export const toastAlert = (string, duration) => {
  if (Platform.OS == 'android') {
    ToastAndroid;
    return ToastAndroid.show(string, duration);
  } else {
    return alert(string);
  }
};
