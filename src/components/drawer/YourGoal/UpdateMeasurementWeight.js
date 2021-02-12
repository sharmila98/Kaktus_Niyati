import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
} from 'react-native';

import Slider from '@react-native-community/slider';
import * as img from 'react-native-svg';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Url, methods} from '../../../NetworkConfig/ApiUrlConstatnts';
import {onCategoriesAction, getUserDetails} from '../../../action/Login_Action';
import {onCategoriesActionUpdate} from '../../../action/UpdateMeasurement_action';
import {onUpdatedDetails} from '../../../action/SideDrawer_action.js';
import {PieChart} from 'react-native-svg-charts';
import {Circle, G, Svg, Line, Rect} from 'react-native-svg';
import * as d3 from 'd3';

import * as constant from '../../../utils/constants';
import {ThemeColors} from 'react-navigation';
import Header from '../../commons/Header';
import moment from 'moment';
import {onNotificationAction} from '../../../action/Header_Action';
const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 8;
const colors = {
  axis: '#E4E4E4',
  bars: constant.THEME,
};

var head, url, inputs;

class UpdateMeasurementWeight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight_kgs: 0,
      weight_lbs: 0,
      SliderValue: 0,
      currentImage: 0,
      bmi: 0,
      images: [constant.ICONSTART, constant.ICONDOWN, constant.ICONPUSH],
      inputs: {
        type: 'weight',
        member_id: 'string',
        height: 0,
        weight: 0,
      },
      listData: [
        {month: 'June 2019', Kg: '85 Kgs'},
        {month: 'Feb 2019', Kg: '94 Kgs'},
        {month: 'Dec 2018', Kg: '90 Kgs'},
        {month: 'Dec 2018', Kg: '91 Kgs'},
      ],
    };
  }

  componentDidMount() {
    // setInterval(this.switchImage, 1000);
    var pounds =
      this.props.signIn.registration.weight != undefined
        ? this.props.signIn.registration.weight * 2.20462262185
        : 0;
    var height =
      this.props.signIn.registration.height != undefined
        ? this.props.signIn.registration.height * 0.01
        : 0;
    this.setState({
      weight_kgs:
        this.props.signIn.registration.weight != undefined
          ? this.props.signIn.registration.weight
          : 0,
      weight_lbs: pounds.toFixed(2),
      bmi:
        this.props.signIn.registration.bmi != undefined
          ? this.props.signIn.registration.bmi
          : 0,
    });
    this.weightDetails();
  }

  weightDetails() {
    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url =
      Url.baseUrl + Url.measurements + this.props.signIn.member_id + '/weight';

    // console.warn(inputs);
    this.props.onUpdatedDetails(head, url, methods.get).then((response) => {
      // console.warn(response);
    });
  }

  renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', padding: constant.HEIGHT * 2.5}}>
        <Text
          style={{
            width: '50%',
            textAlign: 'left',
            color: 'grey',
            opacity: 0.6,
            fontSize: constant.responsiveFontSize(1.8),
          }}>
          {moment(item.created_on).format('MMM YYYY')}
        </Text>
        <Text
          style={{
            width: '50%',
            textAlign: 'right',
            color: 'grey',
            opacity: 0.6,
            fontSize: constant.responsiveFontSize(1.8),
          }}>
          {item.weight + ' Kgs'}
        </Text>
      </View>
    );
  };
  ItemSeparatorComponent = () => {
    return <View style={{borderBottomColor: 'grey', borderBottomWidth: 0.3}} />;
  };

  monthView(data) {
    // console.error(data);
    const SVGHeight = 150;
    const SVGWidth = 300;
    const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
    const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;
    var data = data;
    // var data = [
    //   {label: '1', value: 500},
    //   {label: '2', value: 312},
    //   {label: '3', value: 424},
    //   {label: '4', value: 745},
    //   {label: '5', value: 89},
    //   {label: '6', value: 434},
    //   {label: '7', value: 650},
    //   {label: '8', value: 980},
    //   {label: '9', value: 123},
    //   {label: '10', value: 186},
    //   {label: '11', value: 689},
    //   {label: '12', value: 643},
    //   {label: '13', value: 500},
    //   {label: '14', value: 312},
    //   {label: '15', value: 424},
    //   {label: '16', value: 745},
    //   {label: '17', value: 89},
    //   {label: '18', value: 434},
    //   {label: '19', value: 650},
    //   {label: '20', value: 980},
    //   {label: '21', value: 123},
    //   {label: '22', value: 186},
    //   {label: '23', value: 689},
    //   {label: '24', value: 643},
    //   {label: '25', value: 650},
    //   {label: '26', value: 980},
    //   {label: '27', value: 123},
    //   {label: '28', value: 186},
    //   {label: '29', value: 689},
    //   {label: '30', value: 643},
    // ];

    // X scale point
    const xDomain = data.map((item) => item.label);
    const xRange = [0, graphWidth];
    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);
    const xValue = d3.scalePoint().domain(xDomain).range(xRange).padding(0.5);

    // Y scale linear
    const maxValue = d3.max(data, (d) => d.value);
    const topValue = Math.ceil(maxValue / 100) * 100;
    const yDomain = [0, topValue];
    const yRange = [0, graphHeight];
    const y = d3.scaleLinear().domain(yDomain).range(yRange);
    // top axis and middle axis
    const middleValue = topValue / 2;
    return (
      <View>
        <View
          style={{
            justifyContent: 'center',
            // alignSelf: 'center',
            backgroundColor: '#f7e6ed',
            borderRadius: constant.HEIGHT * 2,
            marginTop: constant.HEIGHT * 5,
          }}>
          <Svg
            width={SVGWidth}
            height={SVGHeight}
            fill={'red'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              paddingHorizontal: constant.HEIGHT * 5.5,
              marginLeft: constant.HEIGHT * 5.5,
            }}>
            <G y={graphHeight + GRAPH_MARGIN}>
              <img.Text
                x={graphWidth - 3}
                textAnchor="end"
                y={y(middleValue + 20) * -1}
                fontSize={10}
                fill={constant.THEME}
                fillOpacity={1}>
                {'Target'}
              </img.Text>

              {/* middle axis */}
              <Line
                x1="0"
                y1={y(middleValue) * -1}
                x2={graphWidth}
                y2={y(middleValue) * -1}
                stroke={constant.THEME}
                // strokeDasharray={[3, 3]}
                strokeWidth="0.5"
              />

              {/* bars Target is 80cal per day */}
              {data.length > 0
                ? data.map((item, index) => (
                    <Rect
                      key={'bar' + item.label}
                      x={x(item.label) - GRAPH_BAR_WIDTH / 2}
                      y={y(10) * -1}
                      rx={3}
                      width={GRAPH_BAR_WIDTH}
                      height={y(30)}
                      fill={colors.bars}
                    />
                  ))
                : null}
            </G>
          </Svg>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: constant.HEIGHT * 4,
              marginBottom: constant.HEIGHT * 2,
            }}>
            <Text
              style={{
                flex: 0.5,
                fontSize: constant.responsiveFontSize(1.4),
                textAlign: 'left',
                opacity: 0.6,
              }}>
              Jan 1
            </Text>
            <Text
              style={{
                flex: 0.5,
                fontSize: constant.responsiveFontSize(1.4),
                textAlign: 'right',
                opacity: 0.6,
              }}>
              Jan 31
            </Text>
          </View>
        </View>
        <Text
          style={{
            marginTop: constant.HEIGHT * 2,
            opacity: 0.6,
            fontSize: constant.responsiveFontSize(1.8),
            textAlign: 'center',
          }}>
          {moment(new Date()).format('YYYY')}
        </Text>
      </View>
    );
  }
  updateWeight() {
    inputs = {
      type: 'weight',
      member_id: this.props.signIn.member_id,
      weight: this.state.weight_kgs,
      height: this.props.signIn.registration.height,
    };

    head = {
      accept: 'application/json',
      Authorization: this.props.signIn.token,
    };

    url = Url.baseUrl + Url.updateMeasurement;

    // console.warn(inputs);
    this.props
      .onCategoriesActionUpdate(head, url, methods.post, inputs)
      .then((response) => {
        // console.warn(response);

        if (response.status == 200) {
          this.props.navigation.navigate('Home');
        }
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: constant.WHITE}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constant.WHITE}}>
          <Header navigation={this.props.navigation} onPress={false} />
          <ScrollView>
            {/* <TouchableOpacity
                  onPress={(() => this.props.navigation.goBack())}
                  style={{
                    flexDirection: 'row',
                    margin: constant.HEIGHT * 1,
                    marginLeft: constant.HEIGHT * 2.5,
                  }}>
                  <Image
                    source={constant.ICONARROWORANGE}
                    style={{
                      width: constant.HEIGHT * 3,
                      height: constant.HEIGHT * 2.5,
                      alignSelf: 'center',
                      marginTop: constant.HEIGHT * 1.5,
                      marginHorizontal: constant.HEIGHT * 1,
                    }}
                  />
                 
                </TouchableOpacity> */}

            <View
              style={{
                margin: constant.HEIGHT * 1.5,
                backgroundColor: constant.WHITE,
                flex: 1,
                marginTop: constant.HEIGHT * 8,
              }}>
              <Text
                style={{
                  fontSize: constant.responsiveFontSize(2),
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginTop: constant.HEIGHT * 1.5,
                  fontFamily: constant.SUIFONT,
                }}>
                Update Your Current Weight
              </Text>

              <View
                style={{
                  alignSelf: 'center',
                  marginTop: constant.HEIGHT * 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop:
                      this.state.weight_kgs <= 45
                        ? constant.HEIGHT * 5
                        : this.state.weight_kgs <= 65
                        ? constant.HEIGHT * 5
                        : constant.HEIGHT * 4,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      var changedValue = this.state.weight_kgs - 1;
                      if (changedValue > 0) {
                        var pounds = changedValue * 2.20462262185;
                        this.setState({
                          weight_kgs: changedValue,
                          weight_lbs: pounds.toFixed(2),
                        });
                        this.onSeekChange(changedValue);
                      }
                    }}>
                    <Image
                      source={constant.ICONMINUS}
                      style={{
                        width: constant.HEIGHT * 2.5,
                        height: constant.HEIGHT * 2.5,
                        padding: constant.HEIGHT * 1,
                        tintColor: constant.THEME,
                        marginRight: constant.HEIGHT * 3,
                      }}
                    />
                  </TouchableOpacity>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          alignSelf: 'center',
                          color: constant.THEME,
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.state.weight_kgs + ' Kgs'}
                      </Text>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          alignSelf: 'center',
                          fontWeight: 'bold',
                          color: '#000000',
                          fontFamily: constant.SUIFONT,
                        }}>
                        {' / '}
                      </Text>
                      <Text
                        style={{
                          fontSize: constant.responsiveFontSize(2),
                          alignSelf: 'center',
                          color: constant.THEME,
                          fontFamily: constant.SUIFONT,
                        }}>
                        {this.state.weight_lbs + ' Lbs'}
                      </Text>
                    </View>

                    <Slider
                      step={0.5}
                      minimumValue={0}
                      maximumValue={200}
                      value={this.props.signIn.registration.weight}
                      thumbTintColor="#e0e5e8"
                      minimumTrackTintColor="#FF67A4"
                      onValueChange={(ChangedValue) => {
                        this.onSeekChange(ChangedValue);
                      }}
                      style={{
                        width: constant.HEIGHT * 25,
                        marginTop: constant.HEIGHT * 1,
                        alignSelf: 'center',
                        borderRadius: 50,
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      var changedValue = this.state.weight_kgs + 1;
                      if (changedValue <= 150) {
                        var pounds = changedValue * 2.20462262185;
                        this.setState({
                          weight_kgs: changedValue,
                          weight_lbs: pounds.toFixed(2),
                        });
                        this.onSeekChange(changedValue);
                      }
                    }}>
                    <Image
                      source={constant.ICONPLUS}
                      style={{
                        width: constant.HEIGHT * 2,
                        height: constant.HEIGHT * 2,
                        marginLeft: constant.HEIGHT * 3,
                        padding: constant.HEIGHT * 1,
                        tintColor: constant.THEME,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: constant.HEIGHT * 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.updateWeight();
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: constant.HEIGHT * 3,
                    backgroundColor: constant.THEME,
                    padding: constant.HEIGHT * 1,
                    borderRadius: constant.HEIGHT * 1,
                    borderWidth: constant.HEIGHT * 0.2,
                    borderColor: constant.THEME,
                  }}>
                  <Text
                    style={{
                      fontSize: constant.responsiveFontSize(2),
                      fontWeight: '600',
                      fontFamily: constant.SUIFONT,
                      color: constant.WHITE,
                    }}>
                    UPDATE
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginHorizontal: constant.HEIGHT * 2,
                  alignContent: 'center',
                }}>
                {this.props.sideView.graphData != undefined
                  ? this.monthView(this.props.sideView.graphData)
                  : null}
                <View style={{marginTop: constant.HEIGHT * 3}}>
                  <FlatList
                    data={this.props.sideView.updatedWeightDetails}
                    extraData={this.state}
                    renderItem={({item, index}) =>
                      this.renderItem({item, index})
                    }
                    keyExtractor={(item, index) => index.toString}
                    ItemSeparatorComponent={() => this.ItemSeparatorComponent()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  onSeekChange(value) {
    var pounds = value * 2.20462262185;
    var height = this.props.signIn.registration.height * 0.01;
    var bmi = value / height / height;
    // console.error(bmi);
    this.setState({
      weight_kgs: value,
      weight_lbs: pounds.toFixed(2),
      bmi: bmi,
    });

    var inputs = {
      ...this.props.signIn.registration,
      weight: value,
      bmi: bmi.toFixed(2),
    };
    this.props.getUserDetails(inputs);
  }
}

function mapStateToProps(state, props) {
  return {
    signIn: state.signupReducer,
    sideView: state.sideDrawerReducer,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onCategoriesAction,
      getUserDetails,
      onCategoriesActionUpdate,
      onUpdatedDetails,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateMeasurementWeight);
