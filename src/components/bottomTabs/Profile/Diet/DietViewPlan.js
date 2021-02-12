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
import moment from 'moment';
// import Slider from '@react-native-community/slider';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';


import * as constant from '../../../utils/constants';
import Header from '../../commons/Header';
import StatusBar from '../../commons/StatusBar';
import * as Progress from 'react-native-progress';

import {
  onDietDashboard,
  DietPlanDayWise,
  EditDietInput,
  onDietDay,
  assignWaterItem,
} from '../../../action/DashBoard_Action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import Loader from './../../commons/Loader';
var head, url;

class DietViewPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: moment(new Date()).format('MMM DD, YYYY'),
      program_day: '',
      program_name: '',
      Early_morning_edit: false,
      Breakfast_edit: false,
      Mid_morning_edit: false,
      Lunch_edit: false,
      Snacks_edit: false,
      Dinner_edit: false,
      Late_night_edit: false,
      Water_edit: false,
      diet_info: [],
      loader: false,
    };
  }

  getDate(previous, isPrevious) {
    // var today = currentDate;
    var date = new Date();
    if (isPrevious == true) {
      date.setDate(date.getDate() - previous);
    } else {
      date.setDate(date.getDate() + previous);
    }

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayName = days[date.getDay()];

    return dayName;
  }

  dateView() {
    let tomorrow = new Date();
    tomorrow = moment(tomorrow).subtract(3, 'day').format('YYYY-MM-DD');
    return (
      <TouchableOpacity
        style={{
          padding: constant.HEIGHT * 0.7,
          flex: 0.14,
          borderRadius: constant.HEIGHT * 1,
          backgroundColor:
            this.state.selectedDate == tomorrow ? '#FFB6C1' : constant.WHITE,
          borderColor: constant.WHITECOLOR,
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
        }}
        // onPress={() => {
        //   if ((this.props.route.params.program_day - 3) > 0) {
        //     this.setState({ program_day: this.props.route.params.program_day - 3 }, () => {
        //       this.refreshPage();
        //     });
        //   } 
        //   this.setState({selectedDate: tomorrow}, () => {
        //   });
        // }}
        >
        <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
          {this.getDate(3, true)}
        </Text>
        <Text
          style={{
            alignSelf: 'flex-end',
            marginTop: constant.HEIGHT * 0.5,
            fontFamily: constant.SUIFONT,
          }}>
          {moment(new Date()).subtract(3, 'day').format('DD')}
        </Text>
      </TouchableOpacity>
    );
  }

  showDate() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: constant.HEIGHT * 2,
          height: constant.HEIGHT * 7,
        }}>
        {this.dateView()}

        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).subtract(2, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
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
          }}
          // onPress={() => {
          //   let tomorrow = new Date();
          //   tomorrow = moment(tomorrow).subtract(2, 'day').format('YYYY-MM-DD');
          //   this.setState({selectedDate: tomorrow}, () => {
          //   });
          //   if ((this.props.route.params.program_day - 2)> 0) {
          //     this.setState({ program_day: this.props.route.params.program_day - 2 }, () => {
          //       this.refreshPage();
          //     });
          //   }
          // }}
          >
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(2, true)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(2, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
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
          }}
          // onPress={() => {
          //   let tomorrow = new Date();
          //   tomorrow = moment(tomorrow).subtract(1, 'day').format('YYYY-MM-DD');
          //   this.setState({selectedDate: tomorrow}, () => {
          //   });
          //   if ((this.props.route.params.program_day - 1)> 0) {
          //     this.setState({ program_day: this.props.route.params.program_day - 1 }, () => {
          //       this.refreshPage();
          //     });
          //   }
          // }}
          >
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(1, true)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).subtract(1, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor: constant.THEME,
            borderColor: constant.WHITECOLOR,
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
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).format('YYYY-MM-DD');
            this.setState({selectedDate: tomorrow}, () => {
            });
              this.setState({ program_day: this.props.route.params.program_day}, () => {
                this.refreshPage();
              });
          }}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {this.getDate(0)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
              color: constant.WHITE,
            }}>
            {moment(new Date()).format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
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
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).add(1, 'day').format('YYYY-MM-DD');
            this.setState({selectedDate: tomorrow}, () => {
            });
              this.setState({ program_day: Number(this.props.route.params.program_day) + 1}, () => {
                this.refreshPage();
              });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(1, false)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(1, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).add(2, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
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
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).add(2, 'day').format('YYYY-MM-DD');
            this.setState({selectedDate: tomorrow}, () => {
            });
              this.setState({ program_day: Number(this.props.route.params.program_day) + 2}, () => {
                this.refreshPage();
              });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(2, false)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(2, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: constant.HEIGHT * 0.7,
            flex: 0.14,
            marginLeft: constant.HEIGHT * 0.7,
            borderRadius: constant.HEIGHT * 1,
            backgroundColor:
              this.state.selectedDate ==
              moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
                ? '#FFB6C1'
                : constant.WHITE,
            borderColor: constant.WHITECOLOR,
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
          }}
          onPress={() => {
            let tomorrow = new Date();
            tomorrow = moment(tomorrow).add(3, 'day').format('YYYY-MM-DD');
            this.setState({selectedDate: tomorrow}, () => {
            });
              this.setState({ program_day: Number(this.props.route.params.program_day) + 3}, () => {
                this.refreshPage();
              });
          }}>
          <Text style={{alignSelf: 'flex-start', fontFamily: constant.SUIFONT}}>
            {this.getDate(3, false)}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: constant.HEIGHT * 0.5,
              fontFamily: constant.SUIFONT,
            }}>
            {moment(new Date()).add(3, 'day').format('DD')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  goTODietDashboard(){
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    var current_date = moment(new Date()).format('YYYY-MM-DD');

    url = Url.baseUrl + Url.dietDashboard + '/dashboard';

    var inputs = {
      data: {
        program_type: 'diet',
        date: current_date,
        // "weekstart": "string",
        // "weekend": "string",
        // "month": "string"
      },
      member_id: this.props.signIn.member_id,
      type: 'day',
    };

    this.props.onDietDashboard(head, url, methods.post, inputs).then((res) => {
      if (res.status == 200) {
        
        head = {
          accept: 'application/json',
          Authorization: this.props.signIn.token,
        };
    
        url =
          Url.baseUrl +
          Url.dayDetails +
          '/' +
          this.props.signIn.member_id +
          '/' +
          this.props.route.params.program_id +
          '/' +
          this.state.program_day;
    
        var inputs = {
          program_id: this.props.route.params.program_id,
          member_id: this.props.signIn.member_id,
          plan_type: 'diet',
        };
        this.props
          .DietPlanDayWise(head, url, methods.get, inputs, 1)
          .then((resp) => {
            if (resp.status == 200) {
              this.setState({loader: false});
            }
          });
      }
    });
  }

  changeWaterEdit(item, session) {
    
    if (this.state.Water_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({Water_edit: false});
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });

      this.setState({Water_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Breakfast_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Late_night_edit: false});
    }
  }

  changeMorningEdit(item, session) {
    
    if (this.state.Early_morning_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Early_morning_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });

      this.setState({Early_morning_edit: true});

      this.setState({Breakfast_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Late_night_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeBreakFastEdit(item, session) {
 
    if (this.state.Breakfast_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Breakfast_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });
      this.setState({Breakfast_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Late_night_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeMidMorEdit(item, session) {
    
    if (this.state.Mid_morning_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Mid_morning_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });
      this.setState({Mid_morning_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Breakfast_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Late_night_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeLunchEdit(item, session) {

    if (this.state.Lunch_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Lunch_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });
      this.setState({Lunch_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Breakfast_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Late_night_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeSnacksEdit(item, session) {
 
    if (this.state.Snacks_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Snacks_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });
      this.setState({Snacks_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Breakfast_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Late_night_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeDinnerEdit(item, session) {
 
    if (this.state.Dinner_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'progress',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Dinner_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });
      this.setState({Dinner_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Breakfast_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Late_night_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeLateNightEdit(item, session) {

    if (this.state.Late_night_edit) {
      this.setState({loader: true});
      head = {
        accept: 'application/json',
        Authorization: this.props.signIn.token,
      };

      url = Url.baseUrl + Url.dietDayStatus;

      var inputs = {
        member_id: this.props.signIn.member_id,
        program_id: this.props.route.params.program_id,
        program_type: 'diet',
        diet_info: this.state.diet_info,
        status: 'completed',
        day: this.state.program_day,
        completed_exercise: 0,
      };
      this.props.onDietDay(head, url, methods.post, inputs).then((res) => {
        if (res.status == 200) {
          this.goTODietDashboard();
          this.setState({ Late_night_edit: false })
        }else{
          this.setState({loader: false});
        }
      });
    } else {
      this.setState({diet_info: []}, () => {
        var dummyArray = [];
        item.map((i, j) => {
          const obj = {library_id: i._id, count: i.taken, session: session};
          dummyArray.push(obj);
        })
        this.setState({diet_info:  dummyArray}, () => {
        });
      });
      this.setState({Late_night_edit: true});

      this.setState({Early_morning_edit: false});
      this.setState({Breakfast_edit: false});
      this.setState({Mid_morning_edit: false});
      this.setState({Lunch_edit: false});
      this.setState({Snacks_edit: false});
      this.setState({Dinner_edit: false});
      this.setState({Water_edit: false});
    }
  }

  changeInput(symbol, i, index, count, session) {
    var newcount = 0;
    if (symbol == 'plus') {
      this.state.diet_info.map((item, index) => {
        if (i._id == item.library_id) {
          newcount = item.count + 1;
          const obj = { library_id: item.library_id, count: newcount, session: item.session };
          var array = [...this.state.diet_info]; // make a separate copy of the array
          array.splice(index, 1);
          this.setState({ diet_info: array }, () => {

            this.setState({
              diet_info: [...this.state.diet_info, obj]
            }, () => {
            });
          });
        } else {
          // const obj = {library_id: item.library_id, count: item.count, session: item.session};

          // this.setState({
          //   diet_info: [...this.state.diet_info, obj]}, () => {
          //     console.error('diet '+JSON.stringify(this.state.diet_info))
          // });
        }
      });
      // this.props.EditDietInput(item, index, newcount, session);
    } else {

      this.state.diet_info.map((item, index) => {
        if (i._id == item.library_id) {
          if (item.count != 0) {
            newcount = item.count - 1;
            const obj = { library_id: item.library_id, count: newcount, session: item.session };
            var array = [...this.state.diet_info]; // make a separate copy of the array
            array.splice(index, 1);
            this.setState({ diet_info: array }, () => {

              this.setState({
                diet_info: [...this.state.diet_info, obj]
              }, () => {
              });
            });
          }
        } else {

        }
      });
    }
  }

  componentDidMount() {
    this.setState({selectedDate: this.props.route.params.program_date});
    this.setState({program_name: this.props.route.params.program_name});

    this.setState({program_day: this.props.route.params.program_day}, () => {
      this.refreshPage();
    });
  }

  refreshPage(){
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl +
      Url.dayDetails +
      '/' +
      this.props.signIn.member_id +
      '/' +
      this.props.route.params.program_id +
      '/' +
      this.state.program_day;

    var inputs = {
      program_id: this.props.route.params.program_id,
      member_id: this.props.signIn.member_id,
      plan_type: 'diet',
    };
    this.props
      .DietPlanDayWise(head, url, methods.get, inputs, 1)
      .then((resp) => {
        if (resp.status == 200) {
        }
      });
  }

  renderObj(list, value, type) {
    // console.error(JSON.stringify(list))
    var count = 0;
    return list.map((i, j) => {
      this.state.diet_info.map((item,index)=> {
        if(i._id == item.library_id){
          count = item.count
        }
      })
      var image = Url.baseUrl + Url.images + i.ref_image.filename;
      return (
        <View style={{flexDirection: 'row', flex: 1}}>
          <TouchableOpacity 
          onPress={() => 
            this.props.navigation.navigate('DietItemView', {
               item: i,
               image: image,
            })}
          style={{flex: 0.2, justifyContent: 'center'}}>
            <Image
              style={{
                width: constant.HEIGHT * 7,
                height: constant.HEIGHT * 7,
                alignSelf: 'center',
                borderRadius:10,
                borderWidth: 1,
                borderColor: '#fff'
              }}
              // resizeMode="contain"
              source={{uri: image}}
            />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => 
            this.props.navigation.navigate('DietItemView', {
               item: i,
               image: image,
            })}
            style={{
              marginVertical: constant.HEIGHT * 2,
              flex: 0.5,
              alignSelf: 'center',
              marginHorizontal: constant.HEIGHT * 1,
            }}>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(2),
                marginTop: constant.HEIGHT * 0.5,
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
              }}>
              {i.library_name}
            </Text>
            {value ?
              <Text
                style={{
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.5),
                  fontFamily: constant.SUIFONT,
                }}>
                {i.quantity + '' + i.quantity_type + ' \u00D7 ' + i.count}
              </Text>
              :
              i.taken == 0 ?
                <Text
                  style={{
                    color: '#5D5C5C',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontFamily: constant.SUIFONT,
                  }}>
                  {i.quantity + '' + i.quantity_type + ' \u00D7 ' + i.count}
                </Text>
                :
                <Text
                  style={{
                    color: '#5D5C5C',
                    fontSize: constant.responsiveFontSize(1.5),
                    fontFamily: constant.SUIFONT,
                  }}>
                  {i.quantity + '' + i.quantity_type + ' \u00D7 ' + i.taken}
                </Text>
            }
            
          </TouchableOpacity>

          <View
            style={{
              marginVertical: constant.HEIGHT * 1,
              flex: 0.3,
              justifyContent: 'center',
              marginHorizontal: constant.HEIGHT * 1,
            }}>
            {value ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: constant.HEIGHT * 2,
                  // marginTop:
                  //   this.state.weight_kgs <= 45
                  //     ? constant.HEIGHT * 5
                  //     : this.state.weight_kgs <= 65
                  //     ? constant.HEIGHT * 5
                  //     : constant.HEIGHT * 4,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingVertical: constant.HEIGHT * 2,
                    paddingHorizontal: constant.HEIGHT * 1.5,
                  }}
                  onPress={() => {
                    this.changeInput('minus', i, j, i.count, type);
                  }}>
                  <Image
                    source={constant.ICONMINUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      paddingVertical: constant.HEIGHT * 1.5,
                      paddingHorizontal: constant.HEIGHT * 1,
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        color: '#000000',
                        fontFamily: constant.SUIFONT,
                      }}>
                      { count }
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingVertical: constant.HEIGHT * 2,
                    paddingHorizontal: constant.HEIGHT * 1.5,
                  }}
                  onPress={() => {
                    this.changeInput('plus', i, j, i.count, type);
                  }}>
                  <Image
                    source={constant.ICONPLUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: constant.HEIGHT * 2,
                  }}>
                  {i.taken == 0 ?
                  <Text
                    style={{
                      color: '#5D5C5C',
                      textAlign: 'right',
                      fontSize: constant.responsiveFontSize(1.6),
                      // marginRight: constant.HEIGHT * 1.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {i.cal_per_rep * i.count + ' Cals'}
                  </Text>
                  :
                  <Text
                    style={{
                      color: '#5D5C5C',
                      textAlign: 'right',
                      fontSize: constant.responsiveFontSize(1.6),
                      // marginRight: constant.HEIGHT * 1.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {i.cal_per_rep * i.taken + ' Cals'}
                  </Text>
                }
                  {i.taken != 0 ? (
                    <Image
                      resizeMode={'contain'}
                      source={constant.ICONCHECKEDDIET}
                      style={{
                        marginRight: constant.HEIGHT * 1.0,
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        tintColor: '#0CC08F',
                      }}></Image>
                  ) : 
                  <Image
                      resizeMode={'contain'}
                      source={constant.ICONCLOCKPINK}
                      style={{
                        marginRight: constant.HEIGHT * 1.0,
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                      }}></Image>}
                </View>
              )}
          </View>
        </View>
      );
    });
  }

  renderWater(count) {
    if (count <= 7) {
      var imgCount = [];

      for (let i = 0; i < count; i++) {

        imgCount.push(
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
        )
      }

      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

          {imgCount}

        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />
          <Image
            style={{
              width: constant.HEIGHT * 5,
              height: constant.HEIGHT * 5,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={constant.ICONWATER}
          />

          <Text
            style={{
              fontSize: constant.responsiveFontSize(1.6),
              alignSelf: 'flex-end',
              // fontWeight: 'bold',
              color: '#000000',
              fontFamily: constant.SUIFONT,
            }}>
            {' +'+ (count-5) + ' glass'}
                    </Text>

        </View>
      )
    }


  }

  renderWaterObj(list, value, type) {
    this.props.assignWaterItem(list);
    var count = 0;
    return list.map((i, j) => {
      this.state.diet_info.map((item, index) => {
        if (i._id == item.library_id) {
          count = item.count
        }
      })
      var image = Url.baseUrl + Url.images + i.ref_image.filename;
      return (
        <View style={{ flexDirection: 'row', flex: 1 }}>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('DietItemView', {
                item: i,
                image: image,
              })}
            style={{ flex: 0.7, justifyContent: 'center' }}>

            {i.taken == 0 ?
            this.renderWater(i.count)
            :  this.renderWater(i.taken)
          }

          </TouchableOpacity>


          <View
            style={{
              marginVertical: constant.HEIGHT * 1,
              flex: 0.3,
              alignContent: 'flex-end',
              justifyContent: 'flex-end',
              marginHorizontal: constant.HEIGHT * 1,
            }}>
            {value ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: constant.HEIGHT * 2,
                  // marginTop:
                  //   this.state.weight_kgs <= 45
                  //     ? constant.HEIGHT * 5
                  //     : this.state.weight_kgs <= 65
                  //     ? constant.HEIGHT * 5
                  //     : constant.HEIGHT * 4,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingVertical: constant.HEIGHT * 2,
                    paddingHorizontal: constant.HEIGHT * 1,
                  }}
                  onPress={() => {
                    this.changeInput('minus', i, j, i.count, type);
                  }}>
                  <Image
                    source={constant.ICONMINUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      paddingVertical: constant.HEIGHT * 1.5,
                      paddingHorizontal: constant.HEIGHT * 1,
                    }}>
                    <Text
                      style={{
                        fontSize: constant.responsiveFontSize(1.6),
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        color: '#000000',
                        fontFamily: constant.SUIFONT,
                      }}>
                      {count}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    paddingVertical: constant.HEIGHT * 2,
                    paddingHorizontal: constant.HEIGHT * 1,
                  }}
                  onPress={() => {
                    this.changeInput('plus', i, j, i.count, type);
                  }}>
                  <Image
                    source={constant.ICONPLUS}
                    resizeMode={'contain'}
                    style={{
                      width: constant.HEIGHT * 1.5,
                      height: constant.HEIGHT * 1.5,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingVertical: constant.HEIGHT * 2,
                  }}>
                  <Text
                    style={{
                      color: '#5D5C5C',
                      textAlign: 'right',
                      fontSize: constant.responsiveFontSize(1.6),
                      // marginRight: constant.HEIGHT * 1.5,
                      fontFamily: constant.SUIFONT,
                    }}>
                    {i.taken + ' glass'}
                  </Text>

                </View>
              )}
          </View>
        </View>
      );
    });
  }


  renderouterView(item, type, value) {
    return (
      <TouchableOpacity
        style={{
          elevation: Platform.OS === 'ios' ? null : constant.HEIGHT * 0.5,
          marginVertical: constant.HEIGHT * 1,
          marginHorizontal: constant.HEIGHT * 1,
          paddingLeft: constant.HEIGHT * 0.6,
          backgroundColor: constant.WHITE,
          borderRadius: constant.HEIGHT * 1.5,
          borderWidth: constant.HEIGHT * 0.1,
          borderColor: constant.GREY,
          shadowOffset:
            Platform.OS === 'ios'
              ? {
                  width: 0,
                  height: constant.HEIGHT * 2,
                }
              : null,
          shadowRadius: Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
          shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: constant.HEIGHT * 0.1,
            borderColor: constant.GREY,
            paddingVertical: constant.HEIGHT * 1,
          }}>
          <View style={{flex: 0.4, justifyContent: 'center'}}>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.8),
                marginTop: constant.HEIGHT * 0.5,
                fontWeight: 'bold',
                fontFamily: constant.SUIFONT,
                paddingLeft: constant.HEIGHT * 2.5,
              }}>
              {type}
            </Text>
          </View>
          <View style={{flex: 0.4, justifyContent: 'center'}}>
            <Text
              style={{
                color: '#5D5C5C',
                fontSize: constant.responsiveFontSize(1.45),
                marginTop: constant.HEIGHT * 0.5,
                fontWeight: 'bold',
                // marginLeft: constant.HEIGHT * 1,
                fontFamily: constant.SUIFONT,
                // alignSelf: 'center',
              }}>
              {item[type].timing}
            </Text>
          </View>
          {this.state.selectedDate == moment(new Date()).format('YYYY-MM-DD') ?
          <TouchableOpacity
            onPress={() =>
              type == 'Early morning'
                ? this.changeMorningEdit(item[type].library, type)
                : type == 'Breakfast'
                ? this.changeBreakFastEdit(item[type].library, type)
                : type == 'Mid morning'
                ? this.changeMidMorEdit(item[type].library, type)
                : type == 'Lunch'
                ? this.changeLunchEdit(item[type].library, type)
                : type == 'Snacks'
                ? this.changeSnacksEdit(item[type].library, type)
                : type == 'Dinner'
                ? this.changeDinnerEdit(item[type].library, type)
                : type == 'Late night'
                ? this.changeLateNightEdit(item[type].library, type)
                : type == 'Water'
                ? this.changeWaterEdit(item[type].library, type)
                : null
            }
            style={{
              flex: 0.2,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: constant.HEIGHT * 2.5,
            }}>
            {value ? (
              <Text
                style={{
                  color: '#5D5C5C',
                  fontSize: constant.responsiveFontSize(1.6),
                  fontWeight: 'bold',
                  fontFamily: constant.SUIFONT,
                }}>
                Done
              </Text>
            ) : (
              <Image
                style={{
                  width: constant.HEIGHT * 2,
                  height: constant.HEIGHT * 2,
                  opacity: 0.6,
                }}
                source={constant.ICONEDIT}
              />
            )}
          </TouchableOpacity> 
          : null}
        </View>
        {type != 'Water' ?
        this.renderObj(item[type].library, value, type)
        : this.renderWaterObj(item[type].library, value, type)}
      </TouchableOpacity>
    );
  }

  _renderItem = ({item, index}) => {
    // console.error(this.state.Early_morning_edit)
    return (
      <View
        style={{
          marginTop: constant.HEIGHT * 1,
          marginLeft: constant.HEIGHT * 1.5,
          marginRight: constant.HEIGHT * 1.5,
          marginBottom: constant.HEIGHT * 1,
        }}>
        <View style={{flexDirection: 'column'}}>
        {this.renderouterView(item, 'Water', this.state.Water_edit)}
          {this.renderouterView(
            item,
            'Early morning',
            this.state.Early_morning_edit,
          )}
          {this.renderouterView(item, 'Breakfast', this.state.Breakfast_edit)}
          {this.renderouterView(
            item,
            'Mid morning',
            this.state.Mid_morning_edit,
          )}
          {this.renderouterView(item, 'Lunch', this.state.Lunch_edit)}
          {this.renderouterView(item, 'Snacks', this.state.Snacks_edit)}
          {this.renderouterView(item, 'Dinner', this.state.Dinner_edit)}
          {this.renderouterView(item, 'Late night', this.state.Late_night_edit)}
        </View>
      </View>
    );
  };

  render() {
    // console.log(
    //   'diet ' +
    //     JSON.stringify(
    //       this.props.diet.dietSingleDayDetails[0].diet_data[0].Breakfast,
    //     ),
    // );
    if (
      this.props.diet.dietSingleDayDetails[0] != undefined &&
      this.props.diet.dietSingleDayDetails[0] != null &&
      this.props.diet.dietSingleDayDetails[0] != ''
    ) {
      var list = this.props.diet.dietSingleDayDetails[0].diet_data;
    }

    // var list1 = list[0];}
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
        {this.state.loader == false ? (
          <View style={{flex: 1}}>
            <Header navigation={this.props.navigation} />
            <View style={{flex: 0.94}}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: constant.WHITE,
                    marginVertical: constant.HEIGHT * 1.5,
                  }}>
                    <BackButtonwithTitle
                  title={moment(new Date(this.state.selectedDate)).format('MMM DD, YYYY')}
                  underLine={true}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.navigate('Diet')}
                  />
                  {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Diet')}
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
                      {moment(new Date()).format('MMM DD, YYYY')}
                    </Text>
                  </TouchableOpacity> */}
                    <View
                      style={{
                        marginHorizontal: constant.HEIGHT * 1.5,
                      }}>
                      {this.showDate()}
                    </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'ios'
                          ? constant.REBOTOREGULAR
                          : constant.REBOTOREGULAR,
                      fontSize: constant.responsiveFontSize(2),
                      opacity: 0.6,
                      flex: 1,
                      marginTop: constant.HEIGHT * 2,
                      marginLeft: constant.HEIGHT * 3,
                      fontWeight: 'bold',
                      borderBottomWidth: constant.HEIGHT * 0.1,
                      borderColor: '#707070',
                      fontFamily: constant.SUIFONT,
                    }}>
                    {this.state.program_name}
                  </Text>

                  <View
                    style={{
                      width: '88%',
                      height: constant.HEIGHT * 0.3,
                      marginTop: constant.HEIGHT * 1,
                      marginLeft: constant.HEIGHT * 3,
                      backgroundColor: '#A9A9A9',
                    }}></View>

                  <View
                    style={{
                      // elevation:
                      //   Platform.OS === 'ios' ? null : constant.HEIGHT * 3,
                      marginTop: constant.HEIGHT * 1,

                      // borderRadius: constant.HEIGHT * 1.5,
                      // shadowOffset:
                      //   Platform.OS === 'ios'
                      //     ? {
                      //         width: 0,
                      //         height: constant.HEIGHT * 2,
                      //       }
                      //     : null,
                      // shadowRadius:
                      //   Platform.OS === 'ios' ? constant.HEIGHT * 2 : 0,
                      // shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
                    }}>
                    {list != undefined && list != null && list != '' ? (
                      <FlatList
                        data={list}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        ListEmptyComponent={this.showEmptyListView}
                      />
                    ) : null}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : (
            <Loader />
          )}
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    diet: state.dashBoardReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onDietDashboard,
      DietPlanDayWise,
      EditDietInput,
      onDietDay,
      assignWaterItem,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DietViewPlan);
