import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';
import { setWidth } from '../../utils/variable';
import { styles } from './style';

export default class EmptyCartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.title}>{this.props.title}</Text>
            <View style={[styles.row, {justifyContent:'space-evenly', marginTop: setWidth(8)}]}>
            <TouchableOpacity style={styles.btn} onPress={this.props.onPressClose}>
                <Text style={styles.btnText}>
                  {
                    (this.props.leftBtnTitle)?
                    this.props.leftBtnTitle.toUpperCase()
                    :
                    "Close".toUpperCase()
                  }
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, {backgroundColor: colors.red}]} onPress={this.props.onPressContinueShopping}>
                <Text  style={[styles.btnText,{color: colors.white}]}>
                  {
                    this.props.rightBtnTitle ?
                    (this.props.rightBtnTitle).toUpperCase()
                    :
                    "Shop More".toUpperCase()
                  }
                  </Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  }
}
