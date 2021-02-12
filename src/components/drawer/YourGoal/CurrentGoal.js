import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Slider,
  FlatList,
  ToastAndroid,
  Modal,
} from 'react-native';
import Header from '../../commons/Header';

import * as Progress from 'react-native-progress';
import * as constant from '../../../utils/constants';
import {onProfileAction} from '../../../action/Profile_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
// import Slider from '@react-native-community/slider';
import {changeGoalAction} from '../../../action/Profile_Action.js';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


var head,
  url = '';

var head,
  url = '';

class CurrentGoal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constant: [
        {name: 'Shobana', area: 'ANNA NAGAR', rank: 120},
        {name: 'Sheeba', area: 'SALIGRAMAM', rank: 1152},
      ],
      goal_type: {},
      image: {},
      itemPressed: '',
      showSave: true,
      modalVisible: false,
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
    // console.error(this.props.signIn.categories.data);
    if (
      this.props.signIn.categories.data != null &&
      this.props.signIn.categories != undefined
    ) {
      this.props.signIn.categories.data.filter((item, index) => {
        if (this.props.myProfile.goalDetails.goal_type == item.name) {
          let Image_Http_URL = {uri: item.image};

          this.setState({
            goal_type: item,
            image: Image_Http_URL,
          });
          // console.error(item);
        } else {
          // console.error(this.props.myProfile.goalDetails._id == item._id);
          // console.error('j');0
        }
      });
    }
  }

  onPress(item) {
    this.setState({itemPressed: item});
  }

  onChangeGaol() {
    if (this.state.itemPressed != '') {
      this.setState({showSave: false, modalVisible: true});
    } else {
      constant.toastAlert(
        'Please select your desired goal ',
        ToastAndroid.LONG,
      );
    }
  }

  onSaveGoal() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    url = Url.baseUrl + Url.changGoal;

    this.setState({modalVisible: true, showSave: true});

    // console.error(this.state.itemPressed);
    var inputs = {
      goal_type: this.state.itemPressed.name,
      member_id: this.props.signIn.member_id,
      level: this.props.myProfile.goalDetails.level,
      target_weight: this.props.myProfile.profileDetails.expected_weight,
    };

    this.props.changeGoalAction(head, url, methods.post, inputs).then((res) => {
      if (res.status == 200) {
        this.props.navigation.goBack();
      }
    });
  }

  renderItem = ({item, index}) => {
    let Image_Http_URL = {uri: item.image};
    if (this.state.goal_type.name != item.name) {
      return (
        <TouchableOpacity
          key={index}
          style={{
            marginTop: constant.HEIGHT * 5,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            borderColor:
              this.state.itemPressed != undefined &&
              this.state.itemPressed.name == item.name
                ? constant.THEME
                : '#707070',
            padding: constant.HEIGHT * 1,
            borderWidth: constant.HEIGHT * 0.1,
            borderRadius: constant.HEIGHT * 1,
            width: constant.HEIGHT * 35,
          }}
          onPress={() => this.onPress(item)}>
          <Image
            source={Image_Http_URL}
            style={{
              width: constant.HEIGHT * 6,
              height: constant.HEIGHT * 5,
              marginLeft: constant.HEIGHT * 1.5,
            }}
          />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: constant.HEIGHT * 2.5,
              marginRight: constant.HEIGHT * 1.5,
              color:
                this.state.itemPressed != undefined &&
                this.state.itemPressed.name == item.name
                  ? constant.THEME
                  : '#707070',
              fontSize:
                this.state.itemPressed != undefined &&
                this.state.itemPressed.name == item.name
                  ? constant.responsiveFontSize(2.2)
                  : constant.responsiveFontSize(1.8),
              fontFamily: constant.SUIFONT,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <Header navigation={this.props.navigation} />

          <View
            style={{
              backgroundColor: constant.WHITE,
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: constant.HEIGHT * 1,
                marginRight: constant.HEIGHT * 2.5,
                justifyContent:'space-between'
              }}>
                 <BackButtonwithTitle
                  title={null}
                  underLine={false}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                  
                  />
                 {/* <TouchableOpacity
                  onPress={(() => this.props.navigation.goBack())}
                  style={{
                    flexDirection: 'row',
                    margin: constant.HEIGHT * 1,
                    marginRight: constant.HEIGHT * 2,
                    width: constant.HEIGHT * 3,
                    height: constant.HEIGHT * 3,
                  }}>
              <Image
                source={constant.ICONARROWORANGE}
                style={{
                  width: constant.HEIGHT * 2,
                  height: constant.HEIGHT * 2,
                  alignSelf: 'center',
                  marginHorizontal: constant.HEIGHT * 1,
                }}
              />
              </TouchableOpacity> */}
              
             
            </View>
            <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: constant.SUIFONT,
                  fontSize: constant.responsiveFontSize(1.8),
                  fontWeight: 'bold',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#707070',
                }}>
                Current Fitness Goal
              </Text>
            <View
              style={{
                marginLeft: constant.HEIGHT * 5,
                marginRight: constant.HEIGHT * 2.5,
                borderRadius: constant.HEIGHT * 1,
              }}>
              <TouchableOpacity
                style={{
                  marginTop: constant.HEIGHT * 3,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#707070',
                  padding: constant.HEIGHT * 1,
                  borderWidth: constant.HEIGHT * 0.1,
                  borderRadius: constant.HEIGHT * 1,
                  width: constant.HEIGHT * 35,
                }}>
                <Image
                  source={this.state.image}
                  style={{
                    width: constant.HEIGHT * 5,
                    height: constant.HEIGHT * 5,
                    marginLeft: constant.HEIGHT * 1.5,
                  }}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: constant.HEIGHT * 4.5,
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(1.8),
                  }}>
                  {this.state.goal_type.name}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  backgroundColor: '#fdece7',
                  marginHorizontal: constant.HEIGHT * 3.5,
                  borderTopLeftRadius: constant.HEIGHT * 2,
                  borderTopRightRadius: constant.HEIGHT * 2,
                  paddingBottom: constant.HEIGHT * 7,
                }}>
                <Text
                  style={{
                    color: '#707070',
                    alignSelf: 'center',
                    marginTop: constant.HEIGHT * 2,
                    fontFamily: constant.SUIFONT,
                    fontSize: constant.responsiveFontSize(1.8),
                    fontWeight: 'bold',
                  }}>
                  Select Your Desired Goal
                </Text>

                <FlatList
                  data={this.props.signIn.categories.data}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => String(index)}
                  showsVerticalScrollIndicator={false}
                  renderItem={this.renderItem}
                />
                {this.state.showSave == true ? (
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      backgroundColor: constant.THEME,
                      borderRadius: constant.HEIGHT * 1.5,
                      marginTop: constant.HEIGHT * 5,
                      paddingHorizontal: constant.HEIGHT * 4,
                    }}
                    onPress={() => this.onChangeGaol()}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        paddingHorizontal: constant.HEIGHT * 2,
                        paddingVertical: constant.HEIGHT * 1,
                        color: constant.WHITE,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                width: '85%',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: constant.WHITE,
                  borderColor: '#6D6A6A',
                  borderWidth: constant.HEIGHT * 0.1,
                  borderRadius: constant.HEIGHT * 1,
                }}>
                <Text
                  style={{
                    fontSize: constant.responsiveFontSize(1.8),
                    marginTop: constant.HEIGHT * 5,
                    alignSelf: 'center',
                    fontFamily: constant.SUIFONT,
                    paddingHorizontal: constant.HEIGHT * 2,
                  }}>
                  Your plan will be updated to
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: constant.responsiveFontSize(1.8),
                      fontFamily: constant.SUIFONT,
                      color: constant.THEME,
                    }}>
                    {' ' + this.state.itemPressed.name + ' '}
                  </Text>
                  which will reset your plan progress stats (completed workouts,
                  minutes & calories) and also update your recommended workouts
                  for this and future weeks. Once changed you wont be able to
                  recover your current plan stats & metrics but your workout
                  history is always available under Profile
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: constant.HEIGHT * 3,
                    borderTopWidth: constant.HEIGHT * 0.1,
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: constant.HEIGHT * 2,
                      paddingVertical: constant.HEIGHT * 2,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      flex: 0.5,
                    }}
                    onPress={() =>
                      this.setState({modalVisible: false, showSave: true})
                    }>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),

                        color: '#6D6A6A',
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                        textAlign: 'center',
                      }}>
                      CANCEL
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      paddingHorizontal: constant.HEIGHT * 2,
                      paddingVertical: constant.HEIGHT * 2,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      flex: 0.5,
                      backgroundColor: constant.THEME,
                    }}
                    onPress={() => this.onSaveGoal()}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.8),
                        textAlign: 'center',
                        color: constant.WHITE,
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      SAVE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }

  showEmptyListView = () => {
    return <View />;
  };
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    myProfile: state.profileReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({changeGoalAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CurrentGoal);
