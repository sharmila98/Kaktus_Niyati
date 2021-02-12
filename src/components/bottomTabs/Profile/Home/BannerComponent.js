import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Url, methods} from '../../NetworkConfig/ApiUrlConstatnts';
var banner_image = '';
export default BannerComponent = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  height,
}) => {
  banner_image = Url.baseUrl + Url.images + item.banner_fileImage[0].filename;

  // console.error(banner_image);
  return (
    <View>
      <TouchableOpacity
      // style={styles.container}
      // onPress={() => onPress(item, index)}
      >
        <Image
          style={{height: constant.HEIGHT * 28, resizeMode: 'contain'}}
          source={{uri: banner_image}}
        />
      </TouchableOpacity>
    </View>
  );
};
