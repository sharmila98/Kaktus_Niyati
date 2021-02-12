import React, {Component} from 'react';
import {
  View,
 Easing,
  Platform,
  Image,
  Text,
  SafeAreaView,
  Animated
} from 'react-native';

import * as constant from '../../utils/constants';
import StatusBars from '../commons/StatusBar';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onBannerImageAction} from '../../action/Login_Action';
import Ripple from '../../libs/Ripple/Ripple';

class Splash extends Component {
  static navigationOptions = {
    title: 'Dashboard',
  };
  constructor(props) {
    super(props);
    this.spinValue1 = new Animated.Value(0);
    this.state = {
      verticalVal: new Animated.Value(0),
      verticalVal1: new Animated.Value(0),
      verticalVal2: new Animated.Value(0),
      verticalVal3: new Animated.Value(0),
      verticalVal4: new Animated.Value(0),
      verticalVal5: new Animated.Value(0),

      fadeAnimation1: new Animated.Value(0),
      fadeAnimation2: new Animated.Value(0),
      fadeAnimation3: new Animated.Value(0),
     fadeAnimation4: new Animated.Value(0),
     fadeAnimation5: new Animated.Value(0),





    };
  }
  spin=()=>{
    Animated.timing(
      this.spinValue1,
      {
        toValue: 1,
        duration:7000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    ).start(({ finished })=>{this.spin();}); 
  }


  componentDidMount=()=> {
  //  this.spin()
  //  Animated.loop(
  //   Animated.sequence([
  //     Animated.timing(this.spinValue1, {
  //       toValue: 1,
  //       duration: 6000,
  //       delay:0,
  //       useNativeDriver: false
  //     }),
  //     // Animated.timing(this.spinValue1, {
  //     //   toValue: 1,
  //     //   duration: 7000,
  //     //   // useNativeDriver: true
  //     // })
  //   ]),
  //   {
  //     iterations: 100
  //   }
  // ).start()
  Animated.timing(this.state.fadeAnimation1, {
    toValue: 1,
    duration: 1000,
    useNativeDriver:true
  }).start(()=> Animated.timing(this.state.fadeAnimation2, {
    toValue: 3,
    duration: 900,
    useNativeDriver:true
  }).start(()=> Animated.timing(this.state.fadeAnimation3, {
    toValue: 3,
    duration: 900,
    useNativeDriver:true
  }).start(()=>Animated.timing(this.state.fadeAnimation4, {
    toValue: 3,
    duration: 900,
    useNativeDriver:true
  }).start()))
   );
   
  // Animated.timing(this.state.fadeAnimation2, {
  //   toValue: 3,
  //   duration: 4000,
  //   useNativeDriver:true
  // }).start();
   
  // Animated.timing(this.state.fadeAnimation3, {
  //   toValue: 4,
  //   duration: 6000,
  //   useNativeDriver:true
  // }).start();
   
  // Animated.timing(this.state.fadeAnimation4, {
  //   toValue: 5,
  //   duration: 8000,
  //   useNativeDriver:true
  // }).start();
  Animated.timing(this.state.fadeAnimation5, {
    toValue: 1,
    duration: 1000,
    useNativeDriver:true
  }).start();
   
   
    Animated.timing(this.state.verticalVal, {toValue: 35, duration: 100, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
    }).start();
    this.state.verticalVal.addListener(({value}) => {
        if (value == 35) {
            Animated.timing(this.state.verticalVal, {toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
            }).start();
        }
        else if (value == 0) {
            Animated.timing(this.state.verticalVal, {toValue: 50, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
}).start();
        };
    })
    Animated.timing(this.state.verticalVal1, {toValue:35, duration: 100, easing: Easing.linear,useNativeDriver: true,
    }).start(()=> Animated.timing(this.state.verticalVal2, {toValue: 40, duration: 100, easing: Easing.linear,useNativeDriver: true,
    }).start(()=> Animated.timing(this.state.verticalVal3, {toValue: 50, duration: 100, easing: Easing.linear,useNativeDriver: true,
    }).start(()=> Animated.timing(this.state.verticalVal4, {toValue: 35, duration: 100, easing: Easing.linear,useNativeDriver: true,
    }).start())));
//     this.state.verticalVal1.addListener(({value}) => {
//         if (value == 35) {
//             Animated.timing(this.state.verticalVal1, {toValue: 0, duration: 50000, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
//             }).start();
//         }
//         else if (value == 0) {
//             Animated.timing(this.state.verticalVal1, {toValue: 50, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
// }).start();
//         };
//     })
    // Animated.timing(this.state.verticalVal2, {toValue: 40, duration: 6000, easing: Easing.linear,useNativeDriver: true,
    // }).start();
//     this.state.verticalVal2.addListener(({value}) => {
//         if (value == 35) {
//             Animated.timing(this.state.verticalVal2, {toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
//             }).start();
//         }
//         else if (value == 0) {
//             Animated.timing(this.state.verticalVal2, {toValue: 50, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
// }).start();
//         };
//     })
    // Animated.timing(this.state.verticalVal3, {toValue: 50, duration: 9000, easing: Easing.linear,useNativeDriver: true,
    // }).start();
//     this.state.verticalVal3.addListener(({value}) => {
//         if (value == 35) {
//             Animated.timing(this.state.verticalVal3, {toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
//             }).start();
//         }
//         else if (value == 0) {
//             Animated.timing(this.state.verticalVal3, {toValue: 50, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
// }).start();
//         };
//     })
    // Animated.timing(this.state.verticalVal4, {toValue: 35, duration: 80000, easing: Easing.linear,useNativeDriver: true,
    // }).start();
//     this.state.verticalVal4.addListener(({value}) => {
//         if (value == 35) {
//             Animated.timing(this.state.verticalVal4, {toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
//             }).start();
//         }
//         else if (value == 0) {
//             Animated.timing(this.state.verticalVal4, {toValue: 50, duration: 500, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
// }).start();
//         };
//     })
//     Animated.timing(this.state.verticalVal5, {toValue: 3, duration: 1000, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
//     }).start();
//     this.state.verticalVal5.addListener(({value}) => {
//         if (value == 3) {
//             Animated.timing(this.state.verticalVal5, {toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
//             }).start();
//         }
//         else if (value == 0) {
//             Animated.timing(this.state.verticalVal5, {toValue: 3, duration: 1000, easing: Easing.inOut(Easing.quad),useNativeDriver: true,
// }).start();
//         };
//     })
   
  }

  render() {
    const spin1 = this.spinValue1.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
  
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />

        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <StatusBars
            backgroundColor={constant.WHITE}
            overRelay={true}
            hidden={false}
          />
          <View
            style={{flex: 1,alignSelf: 'center',

          }}>
            <View
              style={{
                alignSelf: 'center',
              }}>
              <Animated.Image
                resizeMode={'contain'}
                style={{
                  height: constant.HEIGHT * 10,
                  width: constant.HEIGHT * 30,
                  transform:[{translateY: this.state.verticalVal}],
                  zIndex:1,
                }}
                source={constant.ICONKAKTUS}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginTop: constant.HEIGHT * 6

              }}>
                <Animated.Image
                resizeMode={'contain'}
                style={[{
                  height: constant.HEIGHT * 6,
                  width: constant.HEIGHT * 6,
                  alignSelf:'auto',
                  transform: [{translateX:this.state.verticalVal1}],
                  marginTop:constant.HEIGHT*17,
                  marginLeft:constant.HEIGHT*6.2,
                  zIndex:1,
                  position:'absolute',
                },{
                  opacity: this.state.fadeAnimation1
                }]}
                source={constant.ICONBLUE}
              />
               <Animated.Image
                resizeMode={'contain'}
                style={[{
                  height: constant.HEIGHT * 6.5,
                  width: constant.HEIGHT * 6.5,
                  alignSelf:'auto',
                  transform: [{translateX:this.state.verticalVal2}],
                  marginTop:constant.HEIGHT*6.5,
                  marginLeft:constant.HEIGHT*10,
                  zIndex:1,
                  position:'absolute'
                },{
                  opacity: this.state.fadeAnimation2
                }]}
                source={constant.ICONGREEN}
              />
               <Animated.Image
                resizeMode={'contain'}
                style={[{
                  height: constant.HEIGHT * 6.5,
                  width: constant.HEIGHT * 6.5,
                  alignSelf:'auto',
                  transform: [{translateX:this.state.verticalVal3}],
                  marginTop:constant.HEIGHT*7.1,
                  marginLeft:constant.HEIGHT*20,
                  zIndex:1,
                  position:'absolute'
                },{
                  opacity: this.state.fadeAnimation3
                }]}
                source={constant.ICONHEART}
              />
               <Animated.Image
                resizeMode={'contain'}
                style={[{
                  height: constant.HEIGHT * 6,
                  width: constant.HEIGHT * 6,
                  alignSelf:'auto',
                  transform: [{translateX:this.state.verticalVal4}],
                  marginTop:constant.HEIGHT*16,
                  marginLeft:constant.HEIGHT*27.3,
                  zIndex:1,
                  position:'absolute',
                },{
              opacity: this.state.fadeAnimation4
            }]}
                source={constant.ICONORANGE}
              />
              <Animated.Image
                resizeMode={'contain'}
                style={[{
                  height: constant.HEIGHT * 45,
                  width: constant.HEIGHT * 50,
                  transform: [{translateY: this.state.verticalVal5}],
                },{
                  opacity: this.state.fadeAnimation5
                }]}
                source={constant.ICONKAKTUSLOGO}
              />
               <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2.1),
                        fontWeight: '600',
                        fontFamily: constant.SUIITALICFONT,
                        color: constant.SPLASHTEXT,
                        textAlign:'center',
                      }}>
                      {'One-Stop'}
                    </Text>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2.1),
                        fontWeight: '600',
                        fontFamily: constant.SUIITALICFONT,
                        color: constant.SPLASHTEXT,
                        textAlign:'center',


                      }}>
                      {'Healthcare Solution'}
                    </Text>
            </View>

            <Ripple
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: constant.HEIGHT * 5,
                      marginHorizontal: constant.HEIGHT * 10,
                      backgroundColor: constant.THEME,
                      padding: constant.HEIGHT * 1.5,
                      paddingHorizontal: constant.HEIGHT * 5,
                      borderRadius: constant.HEIGHT * .5,
                      borderWidth: constant.HEIGHT * 0.1,
                      borderColor: constant.THEME,
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
                    }}
                    onPress={() => this.props.navigation.navigate('Login')}
                    >
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2.1),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                        color: constant.WHITE,
                      }}>
                      {'Login'}
                    </Text>
                  </Ripple>
                  <Ripple
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: constant.HEIGHT * 3,
                      marginHorizontal: constant.HEIGHT * 10,
                      backgroundColor: constant.WHITE,
                      padding: constant.HEIGHT * 1.5,
                      paddingHorizontal: constant.HEIGHT * 5,
                      borderRadius: constant.HEIGHT * .5,
                      borderWidth: constant.HEIGHT * 0.1,
                      borderColor: constant.GREYLIGHT,
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
                    }}
                    onPress={() => this.props.navigation.navigate('SignIn')}
                    >
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(2.1),
                        fontWeight: 'bold',
                        fontFamily: constant.SUIFONT,
                        color: constant.THEME,
                      }}>
                      {'Join Now!'}
                    </Text>
                  </Ripple>
                  <View
              style={{
                alignSelf: 'center',
                marginVertical:constant.HEIGHT *5,
                flexDirection:'row'
              }}>
                  <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.3),
                        fontWeight: '600',
                        fontFamily: constant.SUIIFONT,
                        color: constant.SPLASHTEXT,
                        textAlign:'center',
                        textDecorationLine:'underline'
                      }}>
                      {'About Kaktus'}
                    </Text>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.3),
                        fontWeight: '600',
                        fontFamily: constant.SUIIFONT,
                        color: constant.SPLASHTEXT,
                        textAlign:'center',
                      }}>
                      {'  | © 2021 iLocalBox'}
                    </Text>
                    </View>

            <View style={{marginHorizontal: constant.HEIGHT * 5}}></View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({onBannerImageAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
