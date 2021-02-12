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
  FlatList,
} from 'react-native';

// import Slider from '@react-native-community/slider';

import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import {onProfileAction} from '../../../action/Profile_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

import {onContactListAction} from '../../../action/SideDrawer_action';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


var head,
  url = '';

class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userItem: -1,
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.clientContact;

    var inputs = {
      member_id: this.props.signIn.member_id,
      type: 'list',
    };

    this.props.onContactListAction(head, url, methods.post, inputs);
  }

  showEmptyListView = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: constant.HEIGHT * 25,
        }}>
        <Text style={{opacity: 0.5, fontSize: constant.responsiveFontSize(2)}}>
          No Records Found
        </Text>
      </View>
    );
  };

  openClose(index) {
    console.log(index, this.state.userItem);
    if (index == this.state.userItem) {
      this.setState({
        userItem: -1,
      });
    } else {
      this.setState({
        userItem: index,
      });
    }
  }

  _renderItem = ({item, index}) => {
    var image = item.image != undefined ? item.image.fileName : null;

    var pro_pic = Url.baseUrl + Url.images + image;

    return (
      <View
        style={{
          borderColor: '#fbfafb',
          borderBottomWidth: constant.HEIGHT * 0.3,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: constant.HEIGHT * 3,
            marginRight: constant.HEIGHT * 1.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => {
            this.openClose(index);
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: constant.HEIGHT * 2.5,
              paddingBottom: constant.HEIGHT * 1,
            }}>
            {image != null ? (
              <Image
                source={{uri: pro_pic}}
                style={{
                  width: constant.HEIGHT * 4,
                  height: constant.HEIGHT * 4,
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={constant.ICONPROFILEIMG}
                style={{
                  width: constant.HEIGHT * 4,
                  height: constant.HEIGHT * 4,
                  alignSelf: 'center',
                }}
              />
            )}
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(2),
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
                marginLeft: constant.HEIGHT * 1,
              }}>
              {item.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {item.area != undefined ? (
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.4),
                  alignSelf: 'center',
                  color: constant.WHITE,
                  backgroundColor: '#959191',
                  padding: constant.HEIGHT * 0.7,
                  borderRadius: constant.HEIGHT * 0.7,
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                ANNA NAGAR
              </Text>
            ) : null}
            <Image
              source={constant.ICONRANK}
              style={{
                width: constant.HEIGHT * 2.5,
                height: constant.HEIGHT * 2.5,
                alignSelf: 'center',
                tintColor: constant.BLACK,
                marginLeft: constant.HEIGHT * 1.5,
              }}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(1.5),
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {item.rank}
            </Text>
          </View>
        </TouchableOpacity>
        {this.state.userItem == index ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#FEF6F6',
              borderRadius: constant.HEIGHT * 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: constant.HEIGHT * 3,
                marginVertical: constant.HEIGHT * 1,
              }}>
              {image != null ? (
                <Image
                  source={{uri: pro_pic}}
                  style={{
                    width: constant.HEIGHT * 4,
                    height: constant.HEIGHT * 4,
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <Image
                  source={constant.ICONPROFILEIMG}
                  style={{
                    width: constant.HEIGHT * 8,
                    height: constant.HEIGHT * 8,
                    alignSelf: 'center',
                  }}
                />
              )}
            </View>
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                marginLeft: constant.HEIGHT * 1,
                marginTop: constant.HEIGHT * 1,
              }}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'ios'
                      ? constant.REBOTOREGULAR
                      : constant.REBOTOREGULAR,
                  fontSize: constant.responsiveFontSize(1.8),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: constant.HEIGHT * 1.5,
                }}>
                <View style={{marginRight: constant.HEIGHT * 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={constant.ICONRANK}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 0.5,
                        marginRight: constant.HEIGHT * 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {item.rank}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      opacity: 0.5,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Rank
                  </Text>
                </View>
                <View style={{marginRight: constant.HEIGHT * 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={constant.ICONGYM}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 0.5,
                        marginRight: constant.HEIGHT * 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      34
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      opacity: 0.5,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Sessions
                  </Text>
                </View>
                <View style={{marginRight: constant.HEIGHT * 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={constant.ICONCONTACTS}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginBottom: constant.HEIGHT * 0.5,
                        marginRight: constant.HEIGHT * 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(1.8),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                      }}>
                      260
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      opacity: 0.5,
                      textAlign: 'center',
                      fontSize: constant.responsiveFontSize(1.5),
                      fontFamily: constant.SUIFONT,
                    }}>
                    Contacts
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'ios'
                    ? constant.REBOTOREGULAR
                    : constant.REBOTOREGULAR,
                fontSize: constant.responsiveFontSize(1.4),
                alignSelf: 'flex-end',
                color: constant.BLACK,
                borderBottomWidth: constant.HEIGHT * 0.1,
                borderColor: constant.BLACK,
                marginBottom: constant.HEIGHT * 1.5,
                marginRight: constant.HEIGHT * 2.5,
                fontFamily: constant.SUIFONT,
              }}>
              View full profile
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                    marginBottom: constant.HEIGHT * 12,
                    flex: 1,
                  }}>
                      <BackButtonwithTitle
                  title={'Contacts'}
                  underLine={true}
                  rightIconEnable={false}
                  icon={constant.ICONARROWORANGE}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                  
                  />

                  {/* <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginRight: constant.HEIGHT * 2,
                    }}>
                    <Image
                      source={constant.ICONARROWORANGE}
                      style={{
                        marginHorizontal: constant.HEIGHT * 1,
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        alignSelf: 'center',
                        tintColor: constant.THEME,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'ios'
                            ? constant.REBOTOREGULAR
                            : constant.REBOTOREGULAR,
                        fontSize: constant.responsiveFontSize(2),
                        opacity: 0.6,
                        flex: 1,
                        fontWeight: 'bold',
                        borderBottomWidth: constant.HEIGHT * 0.1,
                        borderColor: '#707070',
                        fontFamily: constant.SUIFONT,
                      }}>
                      Contacts
                    </Text>
                  </TouchableOpacity> */}
                  <FlatList
                    data={this.props.sideView.contactList}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index + ''}
                    ListEmptyComponent={this.showEmptyListView}
                  />
                  <View style={{height: constant.HEIGHT * 10}} />
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    myProfile: state.profileReducer,
    sideView: state.sideDrawerReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({onContactListAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
