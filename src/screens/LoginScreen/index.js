import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StatusBar, Linking, Alert, NativeModules, Platform } from 'react-native';
import { styles } from './style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from '../../component/CustomTextInput';
import CustomButton from '../../component/CustomButton';
import Feather from 'react-native-vector-icons/Feather'
import { fonts, images, setWidth } from '../../utils/variable';
import colors from '../../utils/colors';
import LoginService from '../../services/LoginService';
import { errorAlert, retryAlert } from '../../helper/ToastHelper';
import Lottie from 'lottie-react-native';
import FullScreenLoader from '../../component/FullScreenLoader';
import { Strings } from '../../utils/strings';
import { _crashApp, _setCrashLog, _setCrashUserID } from '../../helper/CrashlyticsHelper';

const { StatusBarManager } = NativeModules

export default class LoginScreen extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      phone: '', // 9874935035, 8240773294 9131574648
      password: '', // 123456
      showLoader: false,
      showPassword: false,
      statusbarheight: 0
    };   
  }



  async componentDidMount() {

    this._isMounted = true
    //this.animation.play();
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(response => {
        if (this._isMounted) {
          this.setState({
            statusbarheight: response.height
          })
        }
      }
      )
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  
  async _login() {    
    _setCrashUserID("User "+this.state.phone)
    _setCrashLog("Attempt Login - "+this.state.phone)

    const param = {
      mobile: this.state.phone,
      password: this.state.password,
      app_type: 3
    }
    // console.log(param);
    this.setState({ showLoader: true })
    await LoginService._loginService(param).then(response => {
    
      if (this._isMounted) {
        this.setState({ showLoader: false })
      }

    }, error => {
      if (this._isMounted) {
        this.setState({ showLoader: false })
        if (error.message == "server_error") {
          retryAlert(() => this._login())
        } else {
          if (error.otp_verification === false) {
            errorAlert("Error", error.message)
            this.props.navigation.navigate("OTPVerificationScreen", { phone: this.state.phone, new_register: 1 })
          }
          errorAlert("Error", error.message)
        }
      }
    })
  }

  render() {

    return (
      <KeyboardAwareScrollView contentContainerStyle={[styles.container]}>
        {
          (Platform.OS === 'ios') ?
            <View style={{ height: this.state.statusbarheight, backgroundColor: colors.primaryyellow }}>

            </View>
            :
            <StatusBar backgroundColor={colors.primaryyellow} />
        }

        <ImageBackground style={[styles.header]} source={images.ellipse} resizeMode="cover">
          <Image source={images.heading_logo} resizeMode="contain" style={styles.logo} />
          {/* <Text style={styles.title}>KIDCITY</Text> */}
        </ImageBackground>

        <View style={styles.content}>

          
          <CustomTextInput
            container={[styles.inputContainer]}
            leftIcon={<Feather name='phone-call' size={setWidth(4)} color={colors.grey3} />}
            placeholder="Mobile Number"
            keyboardType="number-pad"
            value={this.state.phone}
            onChangeText={(e) => this.setState({ phone: e })}
          />
          <CustomTextInput
            container={[styles.inputContainer]}
            secureTextEntry={this.state.showPassword ? false : true}
            leftIcon={<Feather name='lock' size={setWidth(4)} color={colors.grey3} />}
            placeholder="Password"
            rightIcon={<Feather name={this.state.showPassword ? 'eye-off' : 'eye'} size={setWidth(5)} color={colors.grey3} />}
            onPressRightIcon={() => this.setState({ showPassword: !this.state.showPassword })}
            value={this.state.password}
            onChangeText={(e) => this.setState({ password: e })}
          />
          <View style={{ alignItems: 'flex-end', marginVertical: setWidth(5), marginRight: setWidth(1) }}>
            <TouchableOpacity style={styles.pressableTextBtn} onPress={() => this.props.navigation.navigate("ResetPasswordScreen")}>
              <Text style={styles.perssableText}>{Strings.loginScreenStrings.forgotPasswordText}</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            container={{
              backgroundColor: colors.primaryyellow,
              paddingHorizontal: setWidth(7),
              paddingRight: setWidth(9),
            }}
            label={Strings.loginScreenStrings.loginBtnText}
            labelStyle={{ color: colors.white }}
            iconColor={colors.white}
            onPress={() => this._login()}
            leftIcon
          />
          <CustomButton
            container={{
              backgroundColor: colors.white,
              borderColor: colors.primaryyellow,
              borderWidth: setWidth(0.3),
              marginTop: setWidth(5),
              paddingHorizontal: setWidth(7),
              paddingRight: setWidth(9),
            }}
            label={Strings.loginScreenStrings.signupBtnText}
            labelStyle={{ color: colors.primaryyellow }}
            iconColor={colors.primaryyellow}
            onPress={() => this.props.navigation.navigate("RegisterScreen")}
            leftIcon
          />

          <View style={{ marginTop: setWidth(20) }}>
            <Text style={styles.connectingbrandText}>{Strings.loginScreenStrings.connectingBrandsText}</Text>
            <Lottie
              autoPlay
              loop
              style={styles.lottiView}
              source={require("../../utils/login_screen_animation.json")}
            />
          </View>

          <View style={[styles.footer, { marginTop: setWidth(10) }]}>
            <Feather name='check-circle' size={setWidth(4)} color={colors.primaryyellow} />
            <View style={[styles.row, { alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={styles.footerText} > {Strings.loginScreenStrings.bottomText1}</Text>
              <TouchableOpacity onPress={() => Linking.openURL("https://thekidcity.in/terms-conditions")}><Text style={[styles.footerText, styles.link]}> {Strings.loginScreenStrings.bottomText2}</Text></TouchableOpacity>
              <Text style={styles.footerText}> {Strings.loginScreenStrings.bottomText3}</Text>
              <TouchableOpacity onPress={() => Linking.openURL("https://thekidcity.in/privacy/")}><Text style={[styles.footerText, styles.link]}> {Strings.loginScreenStrings.bottomText4}</Text></TouchableOpacity>
            </View>
          </View>

        </View>

        {
          this.state.showLoader &&
          <FullScreenLoader
            isOpen={this.state.showLoader}
          />
        }
      </KeyboardAwareScrollView>
    );
  }
}
