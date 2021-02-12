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
  ToastAndroid,
} from 'react-native';

import * as Progress from 'react-native-progress';
import * as constant from './../../utils/constants';
import Header from './../commons/Header';
import StatusBar from './../commons/StatusBar';
import {onProfileAction} from './../../action/Profile_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from './../../NetworkConfig/ApiUrlConstatnts';
import {onContactListAction} from './../../action/SideDrawer_action';

import {
  onSearchAction,
  getSearchService,
  getSearchFailure,
  getUserDetailsAction,
  getCenterDetailsAction,
} from './../../action/Header_Action';

var head,
  url = '';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userItem: -1,
      searchText: '',
      type: 'people',
    };
  }

  componentDidMount() {
    this.onSearch();
  }

  showEmptyListView = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          flex: 1,
          marginTop: constant.HEIGHT * 25,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: constant.responsiveFontSize(2.2),
            fontFamily: constant.SUIFONT,
            opacity: 0.5,
          }}>
          No data found
        </Text>
      </View>
    );
  };

  onRequest(item, type) {
    // console.error(item);
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };
    url = Url.baseUrl + Url.clientContact;

    var inputs = {
      member_id: this.props.signIn.member_id,
      request_id: item.member_id,
      type: 'send',
    };

    this.props.onContactListAction(head, url, methods.post, inputs);
  }

  handleSearch(text) {
    this.setState({searchText: text}, () => {
      // if (this.state.type == '' || text == '') {
      // constant.toastAlert('Select Type to Search', ToastAndroid.LONG);
      // } else {
      //   this.props.getSearchService();
      this.onSearch();
      // }
    });
  }

  onSelectType(type) {
    this.setState({type: type}, () => {
      // if (this.state.searchText == '') {
      //   constant.toastAlert('Select keyword to Search', ToastAndroid.LONG);
      // } else {
      this.onSearch();
      // }
    });
  }

  onSearch() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.search;

    var inputs = {
      member_id: this.props.signIn.member_id,
      keywords: this.state.searchText,
      type: this.state.type,
    };

    this.props.onSearchAction(head, url, methods.post, inputs);
  }

  onClientTrainer(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.get_UserDetails;

    var inputs = {
      user_id: item._id,
    };

    this.props
      .getUserDetailsAction(head, url, methods.post, inputs, item)
      .then((res) => {
        if (res.status == 200) {
          this.props.navigation.navigate('ClientProfileTrainer');
        }
      });
  }

  onClientCenter(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.get_centerDetails;

    var inputs = {
      center_id: item._id,
    };

    this.props
      .getCenterDetailsAction(head, url, methods.post, inputs, item)
      .then((res) => {
        if (res.status == 200) {
          this.props.navigation.navigate('ClientProfileCenter');
        }
      });
  }

  onClientProfile(item) {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.myProfile + item.member_id;

    if (item.member_id == this.props.signIn.member_id) {
      this.props.navigation.navigate('Profile');
    } else {
      this.props
        .onProfileAction(head, url, methods.get, true)
        .then((response) => {
          if (response.status == 200) {
            this.props.navigation.navigate('ClientProfile');
          }
        });
    }
  }

  _renderItem = ({item, index}) => {
    var image =
      this.state.type == 'people'
        ? item.image != undefined &&
          item.image != '' &&
          item.image.path != undefined &&
          item.image.path != ''
          ? Url.baseUrl + '/' + item.image.path
          : null
        : this.state.type == 'trainers'
        ? item.image != undefined &&
          item.image != '' &&
          item.image.path != undefined &&
          item.image.path != ''
          ? Url.baseUrl + '/' + item.image.path
          : null
        : this.state.type == 'centers'
        ? item.image != undefined &&
          item.image.length != 0 &&
          item.image[0] != undefined &&
          item.image[0].filename != undefined
          ? Url.baseUrl + Url.images + item.image[0].filename
          : null
        : null;
    return this.state.type == 'people' ? (
      <TouchableOpacity
        style={{
          borderRadius: constant.HEIGHT * 2,
          backgroundColor: constant.WHITE,
          borderColor: constant.WHITECOLOR,
          marginTop: constant.HEIGHT * 2,
          marginBottom: constant.HEIGHT * 0.5,
          elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
          shadowOffset:
            Platform.OS === 'ios'
              ? {
                  width: 0,
                  height: constant.HEIGHT * 2,
                }
              : null,
          shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
          shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: constant.HEIGHT * 2,
        }}
        onPress={() => this.onClientProfile(item)}>
        <View style={{flexDirection: 'row', marginLeft: constant.HEIGHT * 1}}>
          {/* {image != null ? ( */}
          <Image
            source={image != null ? {uri: image} : constant.ICONPROFILEIMG}
            resizeMode={'contain'}
            style={{
              width: constant.HEIGHT * 10,
              height: constant.HEIGHT * 10,
              alignSelf: 'center',
              borderRadius: constant.HEIGHT * 2.5,
              marginLeft: constant.HEIGHT * 2,
            }}
          />
          {/* ) : (
            <Image
              source={constant.ICONPROFILEIMG}
              style={{
                width: constant.HEIGHT * 10,
                height: constant.HEIGHT * 10,
                borderRadius: constant.HEIGHT * 8,
                alignSelf: 'center',
                tintColor: constant.GREY,
              }}
            />
          )} */}
          <View
            style={{
              marginLeft: constant.HEIGHT * 2,
              alignSelf: 'center',
              // flex: 0.5,
            }}>
            <Text
              style={{
                color: '#5D5C5C',
                fontWeight: 'bold',
                fontSize: constant.responsiveFontSize(2.2),
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
                    marginTop: constant.HEIGHT * 0.8,
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
                      fontSize: constant.responsiveFontSize(1.8),
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.session}
                  </Text>
                </View>
                <Text
                  style={{
                    opacity: 0.5,
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontFamily: constant.SUIFONT,
                    marginTop: constant.HEIGHT * 0.8,
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
                    resizeMode={'cover'}
                    source={constant.ICONCONTACTS}
                    style={{
                      width: constant.HEIGHT * 3,
                      height: constant.HEIGHT * 3,
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
                      alignItems: 'center',
                      marginBottom: constant.HEIGHT * 0.7,

                      fontFamily: constant.SUIFONT,
                    }}>
                    {item.contact}
                  </Text>
                </View>
                <Text
                  style={{
                    opacity: 0.5,
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontFamily: constant.SUIFONT,
                  }}>
                  Contacts
                </Text>
              </View>
              <View style={{marginRight: constant.HEIGHT * 2}}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={constant.ICONCONTACTS}
                    style={{
                      width: constant.HEIGHT * 3,
                      height: constant.HEIGHT * 3,
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
                    {item.contact}
                  </Text>
                </View>
                <Text
                  style={{
                    opacity: 0.5,
                    textAlign: 'center',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontFamily: constant.SUIFONT,
                  }}>
                  Mutual
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginRight: constant.HEIGHT * 3,
                borderRadius: constant.HEIGHT * 1,
                alignItems: 'center',
              }}
              onPress={() => this.onRequest(item)}>
              <Image
                source={constant.ICONADDFRIEND}
                style={{
                  width: constant.HEIGHT * 4.5,
                  height: constant.HEIGHT * 4.5,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.state.type == 'trainers' ? (
      <TouchableOpacity
        style={{
          borderRadius: constant.HEIGHT * 2,
          backgroundColor: constant.WHITE,
          borderColor: constant.WHITECOLOR,
          marginTop: constant.HEIGHT * 2,
          marginBottom: constant.HEIGHT * 0.5,
          elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
          shadowOffset:
            Platform.OS === 'ios'
              ? {
                  width: 0,
                  height: constant.HEIGHT * 2,
                }
              : null,
          shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
          shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: constant.HEIGHT * 2,
        }}
        onPress={() => this.onClientTrainer(item, index)}>
        <View style={{flexDirection: 'row', marginLeft: constant.HEIGHT * 2}}>
          <Image
            source={image != null ? {uri: image} : constant.ICONPROFILEIMG}
            resizeMode={'contain'}
            style={{
              width: constant.HEIGHT * 10,
              height: constant.HEIGHT * 10,
              alignSelf: 'center',
              borderRadius: constant.HEIGHT * 2.5,
              marginLeft: constant.HEIGHT * 2,
              tintColor: constant.GREY,
            }}
          />

          <View
            style={{
              marginLeft: constant.HEIGHT * 2,
              alignSelf: 'center',
              // flex: 0.5,
            }}>
            <Text
              style={{
                color: '#5D5C5C',
                fontWeight: 'bold',
                fontSize: constant.responsiveFontSize(2.2),
                fontFamily: constant.SUIFONT,
              }}>
              {item.name}
            </Text>

            <View
              style={{flexDirection: 'row', marginTop: constant.HEIGHT * 1}}>
              <Text
                style={{
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.8),
                  fontFamily: constant.SUIFONT,
                  opacity: 0.5,
                }}>
                {'Experience : '}
              </Text>
              <Text
                style={{
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.8),
                  fontFamily: constant.SUIFONT,
                  opacity: 0.5,
                }}>
                {item.years_of_exp + ' years'}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: constant.HEIGHT * 0.5}}>
              <Text
                style={{
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.8),
                  fontFamily: constant.SUIFONT,
                  opacity: 0.5,
                }}>
                {'Role : '}
              </Text>
              <Text
                style={{
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.8),
                  fontFamily: constant.SUIFONT,
                  opacity: 0.5,
                }}>
                {item.roles == undefined
                  ? ''
                  : item.roles.role_name == undefined
                  ? ''
                  : item.roles.role_name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.state.type == 'centers' ? (
      <TouchableOpacity
        onPress={() => this.onClientCenter(item, index)}
        style={{
          borderRadius: constant.HEIGHT * 2,
          backgroundColor: constant.WHITE,
          borderColor: constant.WHITECOLOR,
          marginTop: constant.HEIGHT * 2.5,
          elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
          shadowOffset:
            Platform.OS === 'ios'
              ? {
                  width: 0,
                  height: constant.HEIGHT * 2,
                }
              : null,
          shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
          shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
          paddingVertical: constant.HEIGHT * 2,
        }}>
        <View style={{flexDirection: 'row', marginLeft: constant.HEIGHT * 2}}>
          <Image
            source={image != null ? {uri: image} : constant.ICONPROFILEIMG}
            style={{
              width: constant.HEIGHT * 10,
              height: constant.HEIGHT * 15,
              alignSelf: 'center',
              borderRadius: constant.HEIGHT * 2.5,
              marginLeft: constant.HEIGHT * 2,
            }}
          />
          <View
            style={{
              marginLeft: constant.HEIGHT * 2,
              marginRight: constant.HEIGHT * 2,
              alignSelf: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#5D5C5C',
                fontWeight: 'bold',
                fontSize: constant.responsiveFontSize(2.2),
                fontFamily: constant.SUIFONT,
              }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                flex: 0.6,
                opacity: 0.5,
                marginRight: constant.HEIGHT * 2,
              }}>
              {item.address}
            </Text>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                opacity: 0.5,
              }}>
              {item.state}
            </Text>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                opacity: 0.5,
              }}>
              {item.city}
            </Text>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.8),
                fontFamily: constant.SUIFONT,
                opacity: 0.5,
              }}>
              {item.pin_code}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View />
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
                    paddingBottom: constant.HEIGHT * 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.goBack();
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginRight: constant.HEIGHT * 0.5,
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
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        borderRadius: constant.HEIGHT * 2,
                        backgroundColor: constant.WHITE,
                        borderColor: constant.WHITECOLOR,
                        marginRight: constant.HEIGHT * 2,
                        elevation:
                          Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
                        shadowOffset:
                          Platform.OS === 'ios'
                            ? {
                                width: 0,
                                height: constant.HEIGHT * 2,
                              }
                            : null,
                        shadowRadius:
                          Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
                        shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
                      }}>
                      <Image
                        style={{
                          alignSelf: 'center',
                          width: constant.HEIGHT * 2,
                          height: constant.HEIGHT * 2,
                          marginHorizontal: constant.HEIGHT * 1.5,
                        }}
                        source={constant.ICONSEARCH}
                      />
                      <TextInput
                        style={[
                          {
                            fontFamily: constant.SUIFONT,
                            fontSize: constant.responsiveFontSize(2.2),
                            color: '#888888',
                            width: '100%',
                            letterSpacing: constant.HEIGHT * 0.1,
                            marginLeft: constant.HEIGHT * 0.5,
                            fontWeight: 'bold',
                          },
                        ]}
                        placeholder={'Search'}
                        value={this.state.searchText}
                        returnKeyType={'done'}
                        numberOfLines={1}
                        renderToHardwareTextureAndroid
                        ref="name"
                        enablesReturnKeyAutomatically={true}
                        // autoFocus={true}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        autoCompleteType={'name'}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#888888"
                        onChangeText={(text) => this.handleSearch(text)}
                        onSubmitEditing={() => {}}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: constant.HEIGHT * 2,
                      marginRight: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 3,
                      alignSelf: 'center',
                      flex: 1,
                    }}>
                    {/* <TouchableOpacity
                      style={{
                        flex: 0.31,
                        width: constant.HEIGHT * 12,
                        backgroundColor:
                          this.state.type == 'workout'
                            ? constant.THEME
                            : '#ececec',
                        paddingVertical: constant.HEIGHT * 1,
                        paddingHorizontal: constant.HEIGHT * 2,
                        borderRadius: constant.HEIGHT * 2,
                      }}
                      onPress={() => this.onSelectType('workout')}>
                      <Text
                        style={{
                          color:
                            this.state.type == 'workout'
                              ? constant.WHITE
                              : '#858282',
                          fontSize: constant.responsiveFontSize(1.8),
                          fontFamily: constant.SUIFONT,
                          textAlign: 'center',
                        }}>
                        Workout
                      </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      style={{
                        flex: 0.3,
                        width: constant.HEIGHT * 11,
                        backgroundColor:
                          this.state.type == 'people'
                            ? constant.THEME
                            : '#ececec',
                        paddingVertical: constant.HEIGHT * 1,
                        borderRadius: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                        marginLeft: constant.HEIGHT * 1,
                      }}
                      onPress={() => this.onSelectType('people')}>
                      <Text
                        style={{
                          color:
                            this.state.type == 'people'
                              ? constant.WHITE
                              : '#858282',
                          fontSize: constant.responsiveFontSize(1.8),
                          fontFamily: constant.SUIFONT,
                          alignItems: 'center',
                          textAlign: 'center',
                        }}>
                        People
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        marginLeft: constant.HEIGHT * 1,
                        flex: 0.3,

                        width: constant.HEIGHT * 12,
                        backgroundColor:
                          this.state.type == 'trainers'
                            ? constant.THEME
                            : '#ececec',
                        paddingVertical: constant.HEIGHT * 1,
                        borderRadius: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}
                      onPress={() => this.onSelectType('trainers')}>
                      <Text
                        style={{
                          color:
                            this.state.type == 'trainers'
                              ? constant.WHITE
                              : '#858282',
                          fontSize: constant.responsiveFontSize(1.8),
                          fontFamily: constant.SUIFONT,
                          textAlign: 'center',
                        }}>
                        Trainers
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 0.3,

                        marginLeft: constant.HEIGHT * 1,
                        width: constant.HEIGHT * 12,
                        backgroundColor:
                          this.state.type == 'centers'
                            ? constant.THEME
                            : '#ececec',
                        paddingVertical: constant.HEIGHT * 1,
                        borderRadius: constant.HEIGHT * 2,
                        paddingHorizontal: constant.HEIGHT * 2,
                      }}
                      onPress={() => this.onSelectType('centers')}>
                      <Text
                        style={{
                          color:
                            this.state.type == 'centers'
                              ? constant.WHITE
                              : '#858282',
                          fontSize: constant.responsiveFontSize(1.8),
                          fontFamily: constant.SUIFONT,
                          textAlign: 'center',
                        }}>
                        Centers
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {this.props.header.searchLoad == false ? (
                    this.props.header.searchList.length != 0 ? (
                      <FlatList
                        data={this.props.header.searchList}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index + ''}
                        ListEmptyComponent={this.showEmptyListView}
                      />
                    ) : (
                      this.showEmptyListView()
                    )
                  ) : (
                    <View
                      style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        marginTop: constant.HEIGHT * 25,
                      }}>
                      <Progress.Circle
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          // backgroundColor: 'red',
                        }}
                        // progress={this.state.progress}
                        indeterminate={true}
                        color={'#FF67A4'}
                      />
                    </View>
                  )}
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
    header: state.headerReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSearchAction,
      getSearchService,
      getSearchFailure,
      onProfileAction,
      onContactListAction,
      getUserDetailsAction,
      getCenterDetailsAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Search);
