import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import { setScreenActivity } from '../../helper/AppActivityTrackingHelper';
import colors from '../../utils/colors';
import { icons, setWidth } from '../../utils/variable';
import { styles } from './style';

export default class ContactUsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    linkToWhatsapp(){
        Linking.openURL('https://wa.me/918240773294?text=Hello Kidcity')
    }
    //9903552913
    render() {
        return (
            <View style={styles.container}>
                <CustomHeader
                    heading="CONTACT US"
                    headingContainerStyle={{
                        flex: 0.8
                    }}
                    headingStyle={{
                        textAlign: 'center',
                    }}
                    showBackButton={true}
                    onPressBack={() => {
                        setScreenActivity({ action_type: "going_back", action_id: '' })
                        this.props.navigation.goBack()}}
                    showIcons={false}
                />
                <View style={styles.content}>
                    <CustomButton
                        container={{
                            backgroundColor: colors.green,
                            justifyContent: 'flex-start',
                            marginTop: setWidth(5)
                        }}
                        label="WHATSAPP US"
                        labelStyle={{ color: colors.white }}
                        rightIcon={
                            <Image source={icons.whatsapp} resizeMode="contain" style={{
                                width: setWidth(10),
                                height: setWidth(10),
                                marginRight: setWidth(3)
                            }} />
                        }
                        leftIcon={false}
                        onPress={() => this.linkToWhatsapp()}
                    />
                    <CustomButton
                        container={{
                            backgroundColor: colors.red,
                            justifyContent: 'flex-start',
                            marginTop: setWidth(5)
                        }}
                        label="CALL US"
                        labelStyle={{ color: colors.white }}
                        rightIcon={
                            <Image source={icons.phone} resizeMode="contain" style={styles.btnImage} />
                        }
                        leftIcon={false}
                        onPress={() => Linking.openURL(`tel:+91 8240773294`)}
                    />

                    <View style={[styles.footer,styles.row]}>
                        <TouchableOpacity style={styles.footerBlock} onPress={() => Linking.openURL("https://www.facebook.com/thekidcityindia/") }>
                            <Text style={styles.blockTitle}>Facebook</Text>
                            <Image source={icons.facebook} resizeMode="contain" style={styles.footerImage} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerBlock} onPress={() => Linking.openURL("https://instagram.com/thekidcityindia?igshid=YmMyMTA2M2Y=") }>
                            <Text style={styles.blockTitle}>Instagram</Text>
                            <Image source={icons.instagram} resizeMode="contain" style={styles.footerImage} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerBlock} onPress={() => Linking.openURL("https://thekidcity.com/") }>
                            <Text style={styles.blockTitle}>Website</Text>
                            <Image source={icons.web} resizeMode="contain" style={styles.footerImage} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
