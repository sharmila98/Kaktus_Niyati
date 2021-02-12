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
import * as Progress from 'react-native-progress';

// import Slider from '@react-native-community/slider';
import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';
import {onProfileAction} from '../../../action/Profile_Action';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';

import {
  onCategoriesAction,
  onRegisterAction,
} from '../../../action/Login_Action';
import moment from 'moment';

var head,
  url = '';

class MyGoal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constant: [
        {name: 'Shobana', area: 'ANNA NAGAR', rank: 120},
        {name: 'Sheeba', area: 'SALIGRAMAM', rank: 1152},
      ],
      image: '',
      loss:'',
      weightLoss:''

    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.myProfile + this.props.signIn.member_id;

    this.props
      .onProfileAction(head, url, methods.get, false)
      .then((response) => {
        if (response.status == 200) {
          // var image =
          //   Url.baseUrl + Url.images + response.data.data.image.filename;
          // this.setState({image: image}, () => {});
        }
      });
      if((this.props.myProfile.profileDetails.target_weight >this.props.myProfile.profileDetails.current_weight)&&(this.props.myProfile.profileDetails.current_bmi<15)){
         let weightgain=this.props.myProfile.profileDetails.target_weight -this.props.myProfile.profileDetails.current_weight
         this.setState({weightGain:weightgain});
         if(this.props.myProfile.goalDetails.level=='Level 1')
         {
            let lose = 'Gain 2-3 Kgs'
            this.setState({lose:lose});
         }
         else if(this.props.myProfile.goalDetails.level=='Level 2'){
           let lose = 'Gain 3-5 Kgs'
           this.setState({lose:lose});
 
         }
         else if(this.props.myProfile.goalDetails.level=='Level 3'){
           let lose = 'Gain 5-7 Kgs'
           this.setState({lose:lose});
         }
        }
        else if((this.props.myProfile.profileDetails.target_weight >this.props.myProfile.profileDetails.current_weight )&&(this.props.myProfile.profileDetails.current_bmi>=15 && this.props.myProfile.profileDetails.current_bmi<20)){
          let weightgain=this.props.myProfile.profileDetails.target_weight -this.props.myProfile.profileDetails.current_weight
          this.setState({weightGain:weightgain});
          if(this.props.myProfile.goalDetails.level=='Level 1')
          {
             let lose = 'Gain 2-4 Kgs'
             this.setState({lose:lose});
          }
          else if(this.props.myProfile.goalDetails.level=='Level 2'){
            let lose = 'Gain 4-7 Kgs'
            this.setState({lose:lose});
  
          }
          else if(this.props.myProfile.goalDetails.level=='Level 3'){
            let lose = 'Gain 7-9 Kgs'
            this.setState({lose:lose});
          }

        }
        else if((this.props.myProfile.profileDetails.target_weight >this.props.myProfile.profileDetails.current_weight )&&(this.props.myProfile.profileDetails.current_bmi>=20 && this.props.myProfile.profileDetails.current_bmi<25)){
          let weightgain=this.props.myProfile.profileDetails.target_weight -this.props.myProfile.profileDetails.current_weight
          this.setState({weightGain:weightgain});
          if(this.props.myProfile.goalDetails.level=='Level 1')
          {
             let lose = 'Gain 2-5 Kgs'
             this.setState({lose:lose});
          }
          else if(this.props.myProfile.goalDetails.level=='Level 2'){
            let lose = 'Gain 5-7 Kgs'
            this.setState({lose:lose});
  
          }
          else if(this.props.myProfile.goalDetails.level=='Level 3'){
            let lose = 'Gain 7-9 Kgs'
            this.setState({lose:lose});
          }

        }
        else if((this.props.myProfile.profileDetails.target_weight <this.props.myProfile.profileDetails.current_weight )&&(this.props.myProfile.profileDetails.current_bmi>=25 && this.props.myProfile.profileDetails.current_bmi<30)){
          let weightloss=this.props.myProfile.profileDetails.target_weight-this.props.myProfile.profileDetails.current_weight
          this.setState({weightLoss:weightloss})
          if(this.props.myProfile.goalDetails.level=='Level 1')
          {
             let lose = ' Lose 2-3 Kgs'
             this.setState({lose:lose})
          }
          else if(this.props.myProfile.goalDetails.level=='Level 2'){
            let lose = 'Lose 4-6 Kgs'
            this.setState({lose:lose})
  
          }
          else if(this.props.myProfile.goalDetails.level=='Level 3'){
            let lose = 'Lose 7-9 Kgs'
            this.setState({lose:lose})
          }
          // console.warn(weightloss,"Loss")
  


        }
      else if((this.props.myProfile.profileDetails.target_weight <this.props.myProfile.profileDetails.current_weight )&&this.props.myProfile.profileDetails.current_bmi>=30){
        let weightloss=this.props.myProfile.profileDetails.target_weight-this.props.myProfile.profileDetails.current_weight
        this.setState({weightLoss:weightloss})
        if(this.props.myProfile.goalDetails.level=='Level 1')
        {
           let lose = ' Lose 3-4 Kgs'
           this.setState({lose:lose})
        }
        else if(this.props.myProfile.goalDetails.level=='Level 2'){
          let lose = 'Lose 6-7 Kgs'
          this.setState({lose:lose})

        }
        else if(this.props.myProfile.goalDetails.level=='Level 3'){
          let lose = 'Lose 6-7 Kgs'
          this.setState({lose:lose})
        }
        // console.warn(weightloss,"Loss")

      }
      else if((this.props.myProfile.profileDetails.target_weight <this.props.myProfile.profileDetails.current_weight )&&(this.props.myProfile.profileDetails.current_bmi>=23 && this.props.myProfile.profileDetails.current_bmi<25)){
        let weightloss=this.props.myProfile.profileDetails.target_weight-this.props.myProfile.profileDetails.current_weight
        this.setState({weightLoss:weightloss})
        if(this.props.myProfile.goalDetails.level=='Level 1')
        {
           let lose = ' Lose 2-3 Kgs'
           this.setState({lose:lose})
        }
        else if(this.props.myProfile.goalDetails.level=='Level 2'){
          let lose = 'Lose 3-4 Kgs'
          this.setState({lose:lose})

        }
        else if(this.props.myProfile.goalDetails.level=='Level 3'){
          let lose = 'Lose 4-5 Kgs'
          this.setState({lose:lose})
        }
        // console.warn(weightloss,"Loss")

      }
      else if(this.props.myProfile.profileDetails.target_weight == this.props.myProfile.profileDetails.current_weight){
        let maintainWeight=this.props.myProfile.profileDetails.target_weight==this.props.myProfile.profileDetails.current_weight
        console.warn(maintainWeight,"Maintain")

      }

  }

  switchImage() {
    if (this.state.currentImage < this.state.images.length - 1) {
      this.setState({
        currentImage: this.state.currentImage + 1,
      });
    } else {
      this.setState({
        currentImage: 0,
      });
    }
    return this.currentImage;
  }

  render() {
    let date= moment(new Date(this.props.myProfile.profileDetails.package_started_on)).format('MMM DD, YYYY')

    console.warn(this.props.myProfile.goalDetails,'profile')
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} onPress={false} />
            <View style={{flex: 0}}>
              <View
                style={{
                  backgroundColor: constant.WHITE,
                  marginVertical: constant.HEIGHT * 1.5,
                }}>
                {/* <TouchableOpacity
                  onPress={(() => this.props.navigation.goBack())}
                  style={{
                    flexDirection: 'row',
                    margin: constant.HEIGHT * 1,
                    marginRight: constant.HEIGHT * 2.5,
                  }}>0
                  <Image
                    source={constant.ICONARROWORANGE}
                    style={{
                      width: constant.HEIGHT * 3,
                      height: constant.HEIGHT * 2.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 1.5,
                      tintColor: constant.THEME,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      flex: 1,
                      marginLeft: constant.HEIGHT * 2.5,
                      fontSize: constant.responsiveFontSize(2.5),
                      000000000000alignSelf: 'center',
                      fontWeight: 0000000000000'bold',
                      marginTop: constant.HEIGH0T * 1.5,
                      borderBottomWidth: constant.HEIGHT * 0.1,
                      borderColor: '#707070',0
                      fontFamily: constant.SUI0FONT
                    }}>0
                    My Goal
                  </Text>
                </TouchableOpacity> */}
                 <BackButtonwithTitle
                  title={'My Goal'}
                  underLine={true}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.goBack()}
                  
                  />
                <View
                  style={{
                    backgroundColor: '#ffeef8',
                    marginTop: constant.HEIGHT * 2.5,
                    marginLeft: constant.HEIGHT * 5,
                    marginRight: constant.HEIGHT * 2.5,
                    borderRadius: constant.HEIGHT * 1,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 3,
                      fontFamily: constant.SUIFONT
                    }}>
                  {this.state.lose}
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginBottom: constant.HEIGHT * 3,
                      fontFamily: constant.SUIFONT
                    }}>
                    by {date}
                  </Text>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: constant.HEIGHT * 3,
                    marginLeft: constant.HEIGHT * 1.5,
                    fontFamily: constant.SUIFONT
                  }}>
                  You are just a few steps away from you goal
                </Text>

                <View
                  style={{
                    marginTop: constant.HEIGHT * 3,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: constant.HEIGHT * 5,
                    marginRight: constant.HEIGHT * 6,
                  }}>
                  <Image
                    source={constant.ICONSTART}
                    style={{
                      flex: 0.1,
                      width: constant.HEIGHT * 2.5,
                      height: constant.HEIGHT * 6,
                      marginTop: constant.HEIGHT * 1.5,
                    }}
                  />
                  <Image
                    source={constant.ICONFINISHGOAL}
                    style={{
                      flex: 0.1,
                      width: constant.HEIGHT * 2.5,
                      height: constant.HEIGHT * 6,
                      marginTop: constant.HEIGHT * 1.5,
                    }}
                  />
                </View>

                <Progress.Bar
                  progress={0.1}
                  height={constant.HEIGHT * 0.8}
                  width={constant.HEIGHT * 43}
                  style={{
                    alignSelf: 'center',
                  }}
                  borderColor="#ECECEC"
                  unfilledColor="#ECECEC"
                  color="#FF67A4"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: constant.HEIGHT * 6,
                    marginRight: constant.HEIGHT * 6,
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      fontFamily: constant.SUIFONT
                    }}>
                    {this.props.myProfile.profileDetails.org_weight + 'kg'}
                  </Text>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      fontFamily: constant.SUIFONT
                    }}>
                    {this.props.myProfile.profileDetails.expected_weight + 'kg'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#959191',
                    borderRadius: constant.HEIGHT * 1.5,
                    marginTop: constant.HEIGHT * 5,
                  }}
                  onPress={() => {
                    this.onSetNewGoal();
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(1.4),
                      paddingHorizontal: constant.HEIGHT * 2,
                      paddingVertical: constant.HEIGHT * 1,
                      color: constant.WHITE,
                      fontFamily: constant.SUIFONT
                    }}>
                    Set a new Goal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  onSetNewGoal() {
    this.props.navigation.navigate('CurrentGoal');
  }
}
function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    myProfile: state.profileReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onProfileAction,
      onCategoriesAction,
    },
    dispatch,
  );

  export default connect(mapStateToProps, mapDispatchToProps)(MyGoal);
