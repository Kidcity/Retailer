import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import colors from '../../utils/colors';
import { setHeight, setWidth } from '../../utils/variable';
import CustomButton from '../CustomButton';
import { styles } from './style';
import { images } from '../../utils/variable';
import FastImage from 'react-native-fast-image'
import HorizontalBrandView from '../HorizontalBrandView';
import TextAnimator from '../TextAnimator';
import LinearGradient from 'react-native-linear-gradient';

export default class AvailableBrands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: null,
            onPressBrand: undefined,
            onPressAllBrand: undefined,
            selectedGender: null
        };
       
    }

    static getDerivedStateFromProps(props, state) {
        return {
            brands: props.hasOwnProperty("brands") ? props.brands : null,
            onPressBrand: props.hasOwnProperty("onPressBrand") ? props.onPressBrand : undefined,
            onPressAllBrand: props.hasOwnProperty("onPressAllBrand") ? props.onPressAllBrand : undefined,
            selectedGender: props.hasOwnProperty("selectedGender") ? props.selectedGender : null
        }
    }

    onPressBrand = (brand) => {
        if (this.state.onPressBrand) {
            this.state.onPressBrand(brand)
        }
    }

    renderBrandCity = ({ item, index }) => {

        if (item.brands.length == 0) {
            return null
        }

        return (
            <View style={styles.brandView}>
                <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: setHeight(2) }}>
                    <View style={styles.headingView}>
                        <Text style={styles.animatedTextStyle}>
                            Brands Of {item.location}
                        </Text>
                    </View>
                    <HorizontalBrandView
                        selectedGender={this.state.selectedGender}
                        list={item.brands}
                        onPressBrand={this.onPressBrand}
                        containerStyle={{ marginTop: setHeight(1.5) }}
                    />
                </View>
            </View>
        )
    }


    render() {
        return (
            <View style={[styles.container, this.props.containerStyle && this.props.containerStyle]}>

                <FlatList                    
                    data={this.state.brands}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderBrandCity}
                    ItemSeparatorComponent={() => <View style={{ marginTop: setHeight(1) }} />}
                />

                <CustomButton
                    container={{
                        backgroundColor: colors.primaryyellow,
                        marginTop: setWidth(3),
                        paddingHorizontal: setWidth(7),
                        paddingRight: setWidth(9),
                        marginHorizontal: setWidth(2)
                    }}
                    label="VIEW ALL BRANDS"
                    labelStyle={{ color: colors.black }}
                    iconColor={colors.black}
                    onPress={this.state.onPressAllBrand}
                    leftIcon={true}
                />

            </View>
        );
    }
}
