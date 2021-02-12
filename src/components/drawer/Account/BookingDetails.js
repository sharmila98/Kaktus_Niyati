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
  Modal,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';

import * as constant from '../../../utils/constants';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {RFC_2822} from 'moment';
import {updatePrivacyAction} from '../../../action/Profile_Action';
import {BookingAction} from '../../../action/SideDrawer_action';
import moment from 'moment';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';
import {sendInvoice} from '../../../action/Payement_action';

var head,
  url = '';

var bookedDate = '',
  currentDate = '',
  expiryDate = '';

class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expiryDate: '',
      emailModal: false,
      userEmail: '',
      fromPay: false,
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);

    // let date = this.props.sideView.bookingDetails[0].date;

    // bookedDate = moment(date).format('DD MMM YYYY');

    this.setState({
      fromPay: this.props.route.params.fromPay,
    });

    if (this.props.sideView.bookingItemDetails.package_details != undefined) {
      expiryDate = moment(this.props.sideView.bookingItemDetails.date).add(
        21,
        'days',
      );
      currentDate = moment(new Date());

      this.setState({expiryDate: expiryDate.diff(currentDate, 'days')});
    }
  }

  getDottedLines() {
    return (
      <Text
        style={{
          color: constant.GREY,
          fontWeight: 'bold',
          fontFamily: constant.SUIFONT,
        }}
        ellipsizeMode="clip"
        numberOfLines={1}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - -
      </Text>
    );
  }

  expiryDate(date, created) {
    var expiryDate = moment(date);
    var currentDate = moment(created);
    var diff = expiryDate.diff(currentDate, 'days');

    console.log(diff);

    return diff == 0 ? 'Expired' : diff + ' Days Left';
  }

  getInvoice() {
    try {
      this.setState({
        emailModal: true,
      });
    } catch (error) {}
  }

  handelText = (text) => {
    this.setState({
      userEmail: text,
    });
  };

  sendInvoice() {
    try {
      var head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      var url = Url.baseUrl + Url.sendInvoice;

      if (this.state.userEmail != '') {
        if (!this.validateEmail(this.state.userEmail)) {
          constant.toastAlert('Invalid Email! Try again', ToastAndroid.LONG);
        } else {
          var inputs = {
            member_id: this.props.signIn.member_id,
            email: this.state.userEmail,
          };
          this.props
            .sendInvoice(head, url, methods.post, inputs)
            .then((res) => {
              if (res.status == 200) {
                this.setState({
                  emailModal: false,
                });
                constant.toastAlert(
                  'Invoice Sent Successfully',
                  ToastAndroid.LONG,
                );
              }
            });
        }
      } else {
        constant.toastAlert('Email id is empty', ToastAndroid.LONG);
      }
    } catch (error) {}
  }
  validateEmail = (Email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(Email);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <ScrollView>
              <View style={{flex: 0}}>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                  <BackButtonwithTitle
                    title={'Booking Details'}
                    underLine={true}
                    icon={constant.ICONARROWORANGE}
                    rightIconEnable={false}
                    rightTextEnable={false}
                    notificationIcon={false}
                    backButton={() =>
                      this.state.fromPay == false
                        ? this.props.navigation.goBack()
                        : this.props.navigation.replace('BottomTabs')
                    }
                  />

                  <View
                    style={{
                      marginHorizontal: constant.HEIGHT * 2.5,
                      marginTop: constant.HEIGHT * 2,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={constant.ICONUSERIMG}
                        // source={{
                        //   uri:
                        //     Url.baseUrl +
                        //     Url.images +
                        //     this.props.myProfile.profileDetails.image,
                        // }}
                        style={{
                          width: constant.HEIGHT * 15,
                          height: constant.HEIGHT * 15,
                          marginVertical: constant.HEIGHT * 2,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2.2),
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                          marginLeft: constant.HEIGHT * 2,
                          color: '#205859',
                        }}>
                        {this.props.sideView.bookingItemDetails
                          .package_details != undefined
                          ? this.props.sideView.bookingItemDetails
                              .package_details != undefined &&
                            this.props.sideView.bookingItemDetails
                              .package_details.type == 'Free'
                            ? 'Free Trial'
                            : this.props.sideView.bookingItemDetails
                                .package_details.type == 'Standard'
                            ? 'Standard Plan'
                            : 'Your Booking'
                          : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: constant.HEIGHT * 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2.2),
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                          color: '#959191',
                        }}>
                        {'Order ID'}
                      </Text>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2.2),
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                          color: '#205859',
                        }}>
                        {this.props.sideView.bookingItemDetails.order_id}
                      </Text>
                    </View>
                    <View>{this.getDottedLines()}</View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: constant.HEIGHT * 1,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2.2),
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            alignSelf: 'center',
                            color: '#959191',
                          }}>
                          {'Date'}
                        </Text>

                        {this.props.sideView.bookingItemDetails
                          .package_details != undefined ? (
                          <View style={{flexDirection: 'row'}}>
                            <Image
                              source={constant.ICONCLOCKPINK}
                              style={{
                                width: constant.HEIGHT * 2.5,
                                height: constant.HEIGHT * 2.5,
                                marginBottom: constant.HEIGHT * 0.1,
                                marginLeft: constant.HEIGHT * 2,
                                alignSelf: 'center',
                              }}
                            />
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2),
                                fontWeight: '900',
                                fontFamily: constant.SUIFONT,
                                alignSelf: 'center',
                                marginLeft: constant.HEIGHT * 1,
                                color: '#959191',
                              }}>
                              {this.expiryDate(
                                this.props.sideView.bookingItemDetails.ends_on,
                                this.props.sideView.bookingItemDetails
                                  .updated_on,
                              )}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2.2),
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                          color: '#205859',
                        }}>
                        {moment(
                          this.props.sideView.bookingItemDetails.date,
                        ).format('DD MMM YYYY')}
                      </Text>
                    </View>
                    <View>{this.getDottedLines()}</View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: constant.HEIGHT * 1,
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(255,255,255,1)',
                        borderColor: 'rgba(255,0,0,1)',
                        borderWidth: 0,
                        // borderTopWidth: 2,
                        // borderBottomWidth: 2,
                        borderStyle: 'dashed',
                        borderRadius: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2.2),
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                          color: '#959191',
                        }}>
                        {'Status'}
                      </Text>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2.2),
                          fontWeight: 'bold',
                          fontFamily: constant.SUIFONT,
                          alignSelf: 'center',
                          color: '#205859',
                        }}>
                        {this.props.sideView.bookingItemDetails.status}
                      </Text>
                    </View>
                    <View>{this.getDottedLines()}</View>
                    {this.props.sideView.bookingItemDetails.error != undefined &&
                    this.props.sideView.bookingItemDetails.error.length !=
                    '' ? (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: constant.HEIGHT * 1,
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2.2),
                              fontWeight: 'bold',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#959191',
                            }}>
                            {'Error'}
                          </Text>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2.2),
                              fontWeight: 'bold',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#205859',
                            }}>
                            {this.props.sideView.bookingItemDetails.error}
                          </Text>
                        </View>
                        <View>{this.getDottedLines()}</View>
                      </View>
                    ) : null}
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: constant.HEIGHT * 1,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{width: '60%'}}>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2.2),
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            alignSelf: 'flex-start',
                            color: '#959191',
                          }}>
                          {'Invoice'}
                        </Text>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(1.7),
                            fontWeight: '900',
                            fontFamily: constant.SUIFONT,
                            alignSelf: 'center',
                            marginTop: constant.HEIGHT * 2.3,
                            marginLeft: constant.HEIGHT * 20,
                            color: '#959191',
                            width: '100%',
                            marginRight: constant.HEIGHT * 2,
                          }}>
                          {this.props.profile.profileDetails.email == undefined
                            ? ''
                            : this.props.profile.profileDetails.email}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: constant.responsiveFontSize(2.2),
                            fontWeight: 'bold',
                            fontFamily: constant.SUIFONT,
                            alignSelf: 'flex-end',
                            marginLeft: constant.HEIGHT * 2,
                            color: '#205859',
                          }}>
                          E-Mail
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.getInvoice()}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: constant.HEIGHT * 1,
                            marginLeft: constant.HEIGHT * 1,
                            backgroundColor: constant.THEME,
                            padding: constant.HEIGHT * 1,
                            paddingHorizontal: constant.HEIGHT * 1,
                            borderRadius: constant.HEIGHT * 1,
                            borderWidth: constant.HEIGHT * 0.1,
                            borderColor: constant.THEME,
                          }}>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2.1),
                              fontWeight: 'bold',
                              fontFamily: constant.SUIFONT,
                              color: constant.WHITE,
                            }}>
                            GET INVOICE
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View>{this.getDottedLines()}</View>

                    {this.props.sideView.bookingItemDetails.package_details !=
                    undefined ? (
                      <View
                        style={{
                          paddingTop: constant.HEIGHT * 3,
                          paddingBottom: constant.HEIGHT * 10,
                        }}>
                        {this.props.sideView.bookingItemDetails.trans_type ==
                        'booking' ? null : (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: constant.HEIGHT * 1,
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2.2),
                                fontWeight: 'bold',
                                fontFamily: constant.SUIFONT,
                                alignSelf: 'center',
                                color: '#205859',
                              }}>
                              {'Free Trial'}
                            </Text>
                            <Text
                              style={{
                                fontSize: constant.responsiveFontSize(2.2),
                                fontWeight: '900',
                                fontFamily: constant.SUIFONT,
                                alignSelf: 'center',
                                color: constant.THEME,
                              }}>
                              {'Rs. 0'}
                            </Text>
                          </View>
                        )}

                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: constant.HEIGHT * 1,
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#205859',
                            }}>
                            {'MRP'}
                          </Text>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#959191',
                            }}>
                            {'Rs. '}
                            {
                              this.props.sideView.bookingItemDetails
                                .package_details.MRP
                            }
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: constant.HEIGHT * 1,
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#205859',
                            }}>
                            {'Offer'}
                          </Text>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#959191',
                            }}>
                            {'Rs. '}
                            {parseInt(
                              this.props.sideView.bookingItemDetails
                                .package_details.MRP,
                            ) -
                              parseInt(
                                this.props.sideView.bookingItemDetails
                                  .package_details.sale,
                              )}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: constant.HEIGHT * 1,
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#205859',
                            }}>
                            {'GST'}
                          </Text>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#959191',
                            }}>
                            {'Rs. 0'}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: constant.HEIGHT * 1,
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#205859',
                            }}>
                            {'Total'}
                          </Text>
                          <Text
                            style={{
                              fontSize: constant.responsiveFontSize(2),
                              fontWeight: '900',
                              fontFamily: constant.SUIFONT,
                              alignSelf: 'center',
                              color: '#959191',
                            }}>
                            {'Rs. '}
                            {
                              this.props.sideView.bookingItemDetails
                                .package_details.sale
                            }
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </ScrollView>
            <Modal
              animationType="slide"
              transparent={true}
              onRequestClose={() => this.setState({emailModal: false})}
              visible={this.state.emailModal}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({emailModal: false})}
                style={{
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.18)',
                  flex: 1,
                }}>
                <View
                  elevation={5}
                  style={{
                    justifyContent: 'center',
                    backgroundColor: constant.WHITE,
                    borderRadius: constant.HEIGHT * 1,
                    paddingVertical: constant.HEIGHT * 3,
                    marginHorizontal: constant.HEIGHT * 3,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      color: '#656565',
                      fontWeight: 'bold',
                      fontFamily: constant.SUIFONT,

                      alignSelf: 'center',
                    }}>
                    {this.state.modalName}
                  </Text>
                  <TextInput
                    style={[
                      {
                        fontFamily: constant.SUIFONT,
                        fontSize: constant.responsiveFontSize(2.2),
                        color: '#888888',
                        letterSpacing: constant.HEIGHT * 0.1,
                        fontWeight: 'bold',
                        borderBottomWidth: constant.HEIGHT * 0.1,
                        marginHorizontal: constant.HEIGHT * 3,
                        marginTop: constant.HEIGHT * 5,
                        textAlign: 'center',
                        width: constant.HEIGHT * 40,
                        alignSelf: 'center',
                      },
                    ]}
                    placeholder={'Enter Email'}
                    returnKeyType={'done'}
                    numberOfLines={1}
                    renderToHardwareTextureAndroid
                    ref="email"
                    enablesReturnKeyAutomatically={true}
                    // autoFocus={true}
                    keyboardType={'email-address'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    autoCompleteType={'email'}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#888888"
                    onChangeText={(text) => this.handelText(text)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />

                  <TouchableOpacity
                    style={{
                      marginTop: constant.HEIGHT * 5,
                      backgroundColor: constant.THEME,
                      width: constant.HEIGHT * 25,
                      padding: constant.HEIGHT * 1,
                      borderRadius: constant.HEIGHT * 1,
                      borderWidth: constant.HEIGHT * 0.1,
                      borderColor: constant.THEME,
                      alignSelf: 'center',
                    }}
                    onPress={() => this.sendInvoice()}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2.1),
                        fontWeight: 'bold',
                        color: constant.WHITE,
                        alignSelf: 'center',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {'Done'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginTop: constant.HEIGHT * 5,
                      borderTopWidth: constant.HEIGHT * 0.1,
                    }}
                    onPress={() => this.setState({emailModal: false})}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2),
                        color: '#656565',
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: constant.HEIGHT * 3,
                      }}>
                      {'Cancel'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
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
    sideView: state.pricingReducer,
    profile: state.profileReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {updatePrivacyAction, sendInvoice, BookingAction},
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);

function getOrdinalNum(n) {
  n = parseInt(n);
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
}
