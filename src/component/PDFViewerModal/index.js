import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './style';
import Pdf from 'react-native-pdf';
import CustomHeader from '../CustomHeader';
import colors from '../../utils/colors';
import { setWidth } from '../../utils/variable';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

export default class PDFViewerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {        
        return (
            <View style={styles.container}>
                <CustomHeader
                    heading={this.props.heading}
                    headingStyle={{
                        textAlign: "center"
                    }}
                    onPressBack={() => this.props.onPressBack()}
                    containerStyle={{
                        borderBottomColor: colors.grey1,
                        borderBottomWidth: setWidth(0.3),
                    }}
                />
                <Pdf
                    trustAllCerts={false}
                    source={{ uri: this.props.url }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        //console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        //console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        //console.log(error);
                    }}
                    onPressLink={(uri) => {
                        //console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf} />

                <View style={styles.footerBtnView}>
                    <TouchableOpacity style={styles.footerBtn} onPress={() => this.props.onShare()}>
                        <EvilIcons name='share-google' size={setWidth(10)} color={colors.white} />                       
                            <Text style={styles.btnText}>SHARE</Text>                      
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}
