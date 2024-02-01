import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './style';
import Entypo from 'react-native-vector-icons/Entypo'
import { setWidth } from '../../utils/variable';
import colors from '../../utils/colors';
import ImageView from "react-native-image-viewing";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export default class ProductImageViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.hasOwnProperty("images")? this.props.images :  [],
            currentIndex: this.props.hasOwnProperty("imageIndex")? this.props.imageIndex : 0
        };
    }

    // static getDerivedStateFromProps(nextProps, nextState) {
    //     console.log(nextState, nextProps);
    //     if (nextProps.imageIndex !== nextState.currentIndex) {
    //         return {
    //             currentIndex: (nextProps.hasOwnProperty("currentIndex")) ? nextProps.currentIndex: []
    //         }
    //     }
    //     if (nextProps.images !== nextState.images) {
    //         return {
    //             images: nextProps.hasOwnProperty("images") ? nextProps.images : [],
    //         }
    //     }
    // }


    render() {
        
        return (
            <View style={styles.contianer}>               
                <View style={styles.content}>
                    <ImageView
                        images={this.state.images}
                        imageIndex={this.state.currentIndex}
                        visible={true}
                        onRequestClose={this.props.onClose}
                        backgroundColor={colors.white}
                        FooterComponent={({ imageIndex }) => (
                            <>
                                {
                                    this.state.currentIndex != 0 &&
                                    <TouchableOpacity style={styles.leftArrow} onPress={() => this.setState({ currentIndex: imageIndex - 1 })}>
                                        <SimpleLineIcons name='arrow-left' size={setWidth(8)} color={colors.grey2} />
                                    </TouchableOpacity>
                                }

                                {
                                    (this.state.images.length != this.state.currentIndex + 1) &&
                                    <TouchableOpacity style={styles.rightArrow} onPress={() => this.setState({ currentIndex: this.state.currentIndex + 1 })}>
                                        <SimpleLineIcons name='arrow-right' size={setWidth(8)} color={colors.grey2} />
                                    </TouchableOpacity>
                                }

                            </>
                        )}
                    />

                </View>
            </View>
        );
    }
}
