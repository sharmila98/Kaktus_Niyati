import React, { Component, useState, useEffect } from 'react';
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
import * as Progress from 'react-native-progress';

import { onDietDashboard, onChangePlanDiet, onChangePlanAction } from '../../../action/DashBoard_Action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Url, methods } from '../../../NetworkConfig/ApiUrlConstatnts';
import BackButtonwithTitle from '../../commons/BackButtonwithTitle';

import moment from 'moment';
var head, url;


class DietItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: {},
            imageurl: '',
        };
    }

    componentDidMount() {
        this.setState({ item: this.props.route.params.item });
        this.setState({ imageurl: this.props.route.params.image });
    }


    render() {
        // var image = this.props.route.params.item;
        // console.error('image'+image)
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: constant.WHITE }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: constant.WHITE }}>
                    <View style={{ flex: 1 }}>
                        <Header navigation={this.props.navigation} />
                        <View style={{ flex: 0.94 }}>
                            <ScrollView>
                                <View
                                    style={{
                                        backgroundColor: constant.WHITE,
                                        marginVertical: constant.HEIGHT * 1.5,
                                    }}>
                                    {/* <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('DietViewPlan')}
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
                                            {this.state.item.library_name}
                                        </Text>
                                    </TouchableOpacity> */}
                                     <BackButtonwithTitle
                  title={this.state.item.library_name}
                  underLine={true}
                  icon={constant.ICONARROWORANGE}
                  rightIconEnable={false}
                  rightTextEnable={false}
                  notificationIcon={false}
                  backButton={() => this.props.navigation.navigate('DietViewPlan')}
                  />

                                    <View
                                        style={{
                                            width: constant.HEIGHT * 45,
                                            height: constant.HEIGHT * 30,
                                            alignSelf: 'center',
                                            marginTop: constant.HEIGHT * 2,
                                            backgroundColor: constant.WHITE,
                                            borderRadius: constant.HEIGHT * 1.5,
                                            elevation:
                                                Platform.OS === 'ios'
                                                    ? null
                                                    : constant.HEIGHT * 0.5,
                                            shadowOffset:
                                                Platform.OS === 'ios'
                                                    ? {
                                                        width: 0,
                                                        height: constant.HEIGHT * 2,
                                                    }
                                                    : null,
                                            shadowRadius:
                                                Platform.OS === 'ios'
                                                    ? constant.HEIGHT * 2
                                                    : 0,
                                            shadowOpacity:
                                                Platform.OS === 'ios' ? 0.24 : 0,
                                        }}>
                                        <Image
                                            style={{
                                                width: constant.HEIGHT * 45,
                                                height: constant.HEIGHT * 30,
                                                alignSelf: 'center',
                                            }}
                                            resizeMode="contain"
                                            source={{ uri: this.state.imageurl }}
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            marginTop: constant.HEIGHT * 4,
                                            marginLeft: constant.HEIGHT * 4,
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
                                        Benefit
                                        </Text>

                                    <Text
                                        style={{
                                            marginLeft: constant.HEIGHT * 4,
                                            marginRight: constant.HEIGHT * 4,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? constant.REBOTOREGULAR
                                                    : constant.REBOTOREGULAR,
                                            fontSize: constant.responsiveFontSize(2),
                                            opacity: 0.6,
                                            flex: 1,
                                            borderBottomWidth: constant.HEIGHT * 0.1,
                                            borderColor: '#707070',
                                            fontFamily: constant.SUIFONT,
                                        }}>
                                        {this.state.item.desc}
                                    </Text>

                                    <Text
                                        style={{
                                            marginLeft: constant.HEIGHT * 4,
                                            marginTop: constant.HEIGHT * 2,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? constant.REBOTOREGULAR
                                                    : constant.REBOTOREGULAR,
                                            fontSize: constant.responsiveFontSize(2),
                                            opacity: 0.6,
                                            flex: 1,
                                            borderBottomWidth: constant.HEIGHT * 0.1,
                                            borderColor: '#707070',
                                            fontWeight: 'bold',
                                            fontFamily: constant.SUIFONT,
                                            alignSelf: 'center'
                                        }}>
                                        calorie break down
                                    </Text>


                                    <View
                                        style={{
                                            alignSelf: 'center',

                                            elevation:
                                                Platform.OS === 'ios'
                                                    ? null
                                                    : constant.HEIGHT * 1,
                                            marginTop: constant.HEIGHT * 2,

                                            backgroundColor: '#ffeef8',
                                            borderRadius: constant.HEIGHT * 1.5,
                                            shadowOffset:
                                                Platform.OS === 'ios'
                                                    ? {
                                                        width: 0,
                                                        height: constant.HEIGHT * 2,
                                                    }
                                                    : null,
                                            shadowRadius:
                                                Platform.OS === 'ios'
                                                    ? constant.HEIGHT * 2
                                                    : 0,
                                            shadowOpacity: Platform.OS === 'ios' ? 0.24 : 0,
                                        }}>
                                        <View style={{ flexDirection: 'row' }}>

                                            <TouchableOpacity
                                                style={{
                                                    alignContent: 'center',
                                                    marginVertical: constant.HEIGHT * 2,
                                                    marginHorizontal: constant.HEIGHT * 6,
                                                }}>

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}>
                                                    <Progress.Bar
                                                        progress={
                                                            this.state.item.cal_per_rep
                                                        }
                                                        height={constant.HEIGHT * 0.9}
                                                        width={constant.HEIGHT * 15}
                                                        style={{
                                                            alignSelf: 'center',
                                                            marginTop: constant.HEIGHT * 0.5,
                                                        }}
                                                        borderColor="#D5C5B1"
                                                        unfilledColor="#D5C5B1"
                                                        color="#6D6A6A"
                                                    />
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            fontWeight: 'bold',
                                                            marginLeft: constant.HEIGHT * 1,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        {
                                                            this.state.item.cal_per_rep
                                                        }
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            marginLeft: constant.HEIGHT * 0.5,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        cal
                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}>
                                                    <Progress.Bar
                                                        progress={
                                                            this.state.item.carb
                                                        }
                                                        height={constant.HEIGHT * 0.9}
                                                        width={constant.HEIGHT * 15}
                                                        style={{
                                                            alignSelf: 'center',
                                                            marginTop: constant.HEIGHT * 0.5,
                                                        }}
                                                        borderColor="#D5C5B1"
                                                        unfilledColor="#D5C5B1"
                                                        color="#F6AE4E"
                                                    />
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            fontWeight: 'bold',
                                                            marginLeft: constant.HEIGHT * 1,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        {this.state.item.carb}%
                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            marginLeft: constant.HEIGHT * 0.5,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        carbs
                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        marginTop: constant.HEIGHT * 0.5,
                                                    }}>
                                                    <Progress.Bar
                                                        progress={
                                                            this.state.item.protein
                                                        }
                                                        height={constant.HEIGHT * 0.9}
                                                        width={constant.HEIGHT * 15}
                                                        style={{
                                                            alignSelf: 'center',
                                                            marginTop: constant.HEIGHT * 0.5,
                                                        }}
                                                        borderColor="#D5C5B1"
                                                        unfilledColor="#D5C5B1"
                                                        color="#9BC449"
                                                    />
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            fontWeight: 'bold',
                                                            marginLeft: constant.HEIGHT * 1,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        {this.state.item.protein}
                                                        %
                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            marginLeft: constant.HEIGHT * 0.5,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        protien
                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        marginTop: constant.HEIGHT * 0.5,
                                                    }}>
                                                    <Progress.Bar
                                                        progress={
                                                            this.state.item.fat
                                                        }
                                                        height={constant.HEIGHT * 0.9}
                                                        width={constant.HEIGHT * 15}
                                                        style={{
                                                            alignSelf: 'center',
                                                            marginTop: constant.HEIGHT * 0.5,
                                                        }}
                                                        borderColor="#D5C5B1"
                                                        unfilledColor="#D5C5B1"
                                                        color="#F18282"
                                                    />
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            fontWeight: 'bold',
                                                            marginLeft: constant.HEIGHT * 1,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        {this.state.item.fat}%
                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#5D5C5C',
                                                            fontSize: constant.responsiveFontSize(
                                                                1.8,
                                                            ),
                                                            marginLeft: constant.HEIGHT * 0.5,
                                                            fontFamily: constant.SUIFONT,
                                                        }}>
                                                        fat
                                    </Text>
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <Text
                                        style={{
                                            marginLeft: constant.HEIGHT * 4,
                                            marginTop: constant.HEIGHT * 2,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? constant.REBOTOREGULAR
                                                    : constant.REBOTOREGULAR,
                                            fontSize: constant.responsiveFontSize(1.5),
                                            opacity: 0.6,
                                            flex: 1,
                                            borderBottomWidth: constant.HEIGHT * 0.1,
                                            borderColor: '#707070',
                                            fontWeight: 'bold',
                                            fontFamily: constant.SUIFONT,
                                            alignSelf: 'center'
                                        }}>
                                        {this.state.item.library_name}  - {this.state.item.quantity} {this.state.item.quantity_type}
                                    </Text>

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
        diet: state.dashBoardReducer,
    };
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            onDietDashboard,
            onChangePlanDiet,
            onChangePlanAction,
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(DietItemView);
