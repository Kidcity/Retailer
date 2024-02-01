import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { styles } from './style';
import Lottie from 'lottie-react-native';
import { setWidth } from '../../utils/variable';
import colors from '../../utils/colors';

const {width, height} = Dimensions.get("screen")

export default class ThankYouModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.animHeight =  new Animated.Value(height)
    }

    animUp(){
        Animated.timing(this.animHeight,{
            useNativeDriver: false,
            toValue: 0,
            duration: 1000
        }).start()
    }
    

    componentDidMount() {
        this.animUp()
    }

    render() {
        
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.content,{ transform: [{translateY: this.animHeight}] }]}>
                    <View style={styles.headingView}>
                        <Text style={styles.heading} >Your
                            <Text style={[styles.heading, styles.redText]} > Order No. {this.props.order_no} </Text>
                            <Text style={styles.heading} >FOR </Text>
                            <Text style={[styles.heading, styles.redText]}>{this.props.city_name} </Text>
                            Was Placed Successfully. For More
                            Details Please Check My Orders Page.
                        </Text>
                    </View>
                    <View style={styles.rocketView}>
                        <Lottie
                            autoPlay
                            loop
                            style={styles.lottiView}
                            source={require("../../utils/rocket.json")}
                        />
                    </View>

                    <View style={styles.btnGroupView}>
                        <View style={[styles.padding_h_4, styles.padding_v_3, styles.borderBottom]}>
                            <TouchableOpacity style={styles.btn} onPress={this.props.onPressForOther}>
                                <Text style={styles.btnText}>PAY FOR OTHER CITY ORDERS</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row, styles.padding_v_3, styles.padding_h_4,]}>
                            <TouchableOpacity style={[styles.btn, styles.whiteBtn, { flex: 1 }]} onPress={this.props.onBackToHome}>
                                <Text style={[styles.btnText, { color: colors.red }]}>GO BACK HOME</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { flex: 1, marginLeft: setWidth(2) }]} onPress={this.props.onGoToOrders}>
                                <Text style={styles.btnText}>GO TO MY ORDERS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }
}
