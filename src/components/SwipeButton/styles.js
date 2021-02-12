import {StyleSheet} from 'react-native';
import constant from '../../utils/constants';

const styles = StyleSheet.create({
  swipeout: {
    backgroundColor: '#dbddde',
    overflow: 'hidden',
  },
  swipeoutBtnTouchable: {
    flex: 1,
  },
  swipeoutBtn: {
    alignItems: 'center',
    backgroundColor: '#b6bec0',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 10,
  },
  swipeoutBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
  swipeoutBtns: {
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  swipeoutContent: {},
  colorDelete: {
    backgroundColor: '#dc4545',
    marginRight: 5,
  },
  colorPrimary: {
    backgroundColor: '#006fff',
  },
  colorSecondary: {
    backgroundColor: '#fd9427',
  },
});

export default styles;
