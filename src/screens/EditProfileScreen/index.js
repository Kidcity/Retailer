import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, Animated, Dimensions } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import { styles } from './style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CircleImage from '../../component/CircleImage';
import { setHeight, setWidth } from '../../utils/variable';
import CustomTextInput from '../../component/CustomTextInput';
import Dropdown from '../../component/Dropdown';
import colors from '../../utils/colors';
import { connect } from 'react-redux';
import EditProfileService from '../../services/EditProfileService';
import { errorAlert, retryAlert, successToast } from '../../helper/ToastHelper';
import FullScreenLoader from '../../component/FullScreenLoader';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Easing } from 'react-native-reanimated';
import { setScreenActivity } from '../../helper/AppActivityTrackingHelper';

const {width, height} = Dimensions.get("screen")

class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyType: [
                { label: 'Limited Company', value: '1' },
                { label: 'LLP', value: '2' },
                { label: 'Partnership', value: '3' },
                { label: 'Private Limited', value: '4' },
                { label: 'Proprietor', value: '5' },
            ],
            selectedCompanyType: '',
            storeType: [
                { label: 'Family', value: '1' },
                { label: 'Kids', value: '2' },
            ],
            selectedStoreType: '',
            storeSize: [
                { label: '50 - 100 sqft', value: '50 - 100 sqft' },
                { label: '100 - 150 sqft', value: '100 - 150 sqft' },
                { label: '200 - 500 sqft', value: '200 - 500 sqft' },
                { label: '500 - 1000 sqft', value: '500 - 1000 sqft' },
                { label: '1000 + beyond', value: '1000 + beyond' },
            ],
            selectedStoreSize: '',

            image: '',
            imageObj: {},
            shop_name: '',
            company_name: '',
            owner_name: '',
            year: '',
            address: '',
            url: '',
            no_of_store: '',
            transport_pref: '',

            imageContainer: new Animated.Value(-width),
            imageVisibility: new Animated.Value(0)
        };
        this.RBSheet = React.createRef()
    }

    _openImageLibrary() {
        this.RBSheet.close()
        const options = {
            mediaType: 'photo',
            includeBase64: true
        }

        setTimeout(() => {
             launchImageLibrary(options, (response) => {

            if (!response.didCancel) {
                this.setState({
                    image: response.assets[0].uri,
                    imageObj: response
                })
            }
        })
        }, 200);
       
    }

    _openCamera() {
        this.RBSheet.close()
        const options = {
            mediaType: 'photo',
            includeBase64: true
        }
        setTimeout(() => {
            launchCamera(options, (response) => {

            if (!response.didCancel  && !response.errorCode) {
                this.setState({
                    image: response.assets[0].uri,
                    imageObj: response
                })
            }
        })
        }, 200);
        
    }

    componentDidMount() {
        this._getProfileInfo()
    }

    _getProfileInfo() {
        const param = {
            retailer_id: this.props.loginReducer.data.cust_manu_id
        }
        this.setState({
            showLoader: true
        })
        EditProfileService._getProfileInfoService(param).then(response => {
            const data = response.data.data.data
            //console.log(data);
            if (!response.data.data.data) {
                errorAlert("Message", "API error: Proper data is missing")
                return
            }

            let company_type = []
            let selected_company = ''
            for (let index = 0; index < data.company_type.length; index++) {
                const element = data.company_type[index];
                if (element.id == data.retailer_info[0].company_type_id) {
                    selected_company = element.id
                }
                company_type.push(
                    { label: element.type_name, value: element.id }
                )
            }
            let store_type = []
            let selected_store = ''
            for (let index = 0; index < data.store_types.length; index++) {
                const element = data.store_types[index];
                if (element.id == data.retailer_info[0].store_type_id) {
                    selected_store = element.id
                }
                store_type.push(
                    { label: element.type_name, value: element.id }
                )
            }

            this.setState({
                companyType: company_type,
                storeType: store_type,
                owner_name: data.retailer_info[0].owner_name,
                shop_name: data.retailer_info[0].shop_name,
                company_name: data.retailer_info[0].company_name,
                year: data.retailer_info[0].year_of_est,
                address: data.retailer_info[0].bill_address,
                selectedStoreType: selected_store,
                selectedCompanyType: selected_company,
                selectedStoreSize: data.retailer_info[0].store_size,
                no_of_store: data.retailer_info[0].no_of_store,
                transport_pref: data.retailer_info[0].transport_pref,
                image: this.props.loginReducer.data.image,
                showLoader: false
            },() => {
                this.moveToRight()
            })
        }, error => {
            this.setState({
                showLoader: false
            })
            if (error.message == "server_error") {
                retryAlert(() => this._getProfileInfo())
            } else {
                errorAlert("Error", error.message)
            }
        })
    }

    _editProfile() {
        const imageObj = this.state.imageObj
        // var data = new FormData();
        // data.append('retailer_id',this.props.loginReducer.data.cust_manu_id);
        // data.append('shop_name',this.state.shop_name);
        // data.append('company_name',this.state.company_name);
        // data.append('owner_name',this.state.owner_name);
        // data.append('year_of_est',this.state.year);
        // data.append('bill_address',this.state.address);
        // data.append('no_of_store',this.state.no_of_store);
        // data.append('store_type_id',this.state.selectedStoreSize);
        // data.append('store_size',this.state.selectedStoreSize);
        // data.append('transport_pref',this.state.transport_pref);

        // data.append('store_photo',
        //   {
        //      uri:imageObj.assets[0].uri,
        //      name: Math.random()+'.jpg',
        //      type: imageObj.assets[0].type
        //   });

        const param = {
            retailer_id: this.props.loginReducer.data.cust_manu_id,
            shop_name: this.state.shop_name,
            company_name: this.state.company_name,
            owner_name: this.state.owner_name,
            year_of_est: this.state.year,
            bill_address: this.state.address,
            no_of_store: this.state.no_of_store,
            store_type_id: this.state.selectedStoreType,
            store_size: this.state.selectedStoreSize,
            transport_pref: this.state.transport_pref,
            store_photo: (Object.keys(imageObj).length > 0) ? 'data:image/jpg;base64,' + imageObj.assets[0].base64 : ''
        }
        // console.log(param);
        this.setState({ showLoader: true })
        EditProfileService._updateProfileInfo(param).then(response => {
            successToast("SUCCESS!", "Data Updated Successfully.")
            this.setState({ showLoader: false })
        }, error => {
            this.setState({ showLoader: false })
            if (error.message == "server_error") {
                retryAlert(() => this._editProfile())
            } else {
                errorAlert("Error", error.message)
            }
        })

    }

    moveToRight() {
        Animated.timing(
            this.state.imageContainer,
            {
                toValue: 0,
                duration: 900,
                easing: Easing.linear(),
                useNativeDriver: false
            },
        ).start()

        Animated.timing(
            this.state.imageVisibility,
            {
                toValue: 1,
                duration: 900,
                useNativeDriver: false
            }
        ).start()       
    }


    render() {
        return (
            <View style={styles.container}>
                <CustomHeader   
                    showBackButton
                    onPressBack={() => {
                        setScreenActivity({ action_type: "going_back", action_id: '' })
                        this.props.navigation.goBack()}}
                    // showSearchIcon={true}
                    heading="EDIT PROFILE"
                    headingStyle={{
                        textAlign: 'center'
                    }}
                    showAnimation={true}
                    navigation={this.props.navigation}
                />
                <KeyboardAwareScrollView contentContainerStyle={styles.content}>

                    <Animated.View style={[{opacity: this.state.imageVisibility, left: this.state.imageContainer}]}>
                        <CircleImage
                            container={{
                                alignSelf: 'center',
                                marginTop: setWidth(4)
                            }}
                            image={this.state.image}
                            onPress={() => this.RBSheet.open()}
                            footerImage={true}
                        />
                    </Animated.View>
                    <Text style={styles.changeProfilePicText}>Change Profile Picture</Text>

                    <CustomTextInput
                        placeholder="Shop Name*"
                        inputStyle={styles.inputStyle}
                        value={this.state.shop_name}
                        onChangeText={(e) => this.setState({ shop_name: e })}
                    />
                    <CustomTextInput
                        placeholder="Company Name*"
                        inputStyle={styles.inputStyle}
                        value={this.state.company_name}
                        onChangeText={(e) => this.setState({ company_name: e })}
                    />

                    {/* <Dropdown
                        container={styles.dropdownContainer}
                        placeholderStyle={styles.dropdownPlacholderStyle}
                        dropdownItemStyle={styles.dropdownItemStyle}
                        dropdownItemTextStyle={styles.dropdownItemTextStyle}
                        selectedTextStyle={{
                            fontSize: setWidth(3.2),
                            color: colors.dark_charcoal
                        }}
                        data={this.state.companyType}
                        value={this.state.selectedCompanyType}
                        placeholder={"Type Of Company"}
                        onChange={(v) => this.setState({ selectedCompanyType: v })}
                    /> */}

                    <CustomTextInput
                        placeholder="Year*"
                        inputStyle={styles.inputStyle}
                        keyboardType="number-pad"
                        value={this.state.year}
                        onChangeText={(e) => this.setState({ year: e })}
                    />

                    <CustomTextInput
                        placeholder="Address*"
                        inputStyle={styles.inputStyle}
                        value={this.state.address}
                        onChangeText={(e) => this.setState({ address: e })}
                    />

                    <Dropdown
                        container={styles.dropdownContainer}
                        placeholderStyle={styles.dropdownPlacholderStyle}
                        dropdownItemStyle={styles.dropdownItemStyle}
                        dropdownItemTextStyle={styles.dropdownItemTextStyle}
                        selectedTextStyle={{
                            fontSize: setWidth(3.2),
                            color: colors.dark_charcoal
                        }}
                        data={this.state.storeType}
                        placeholder={"Store Type"}
                        value={this.state.selectedStoreType}
                        onChange={(v) => this.setState({ selectedStoreType: v })}
                    />

                    <Dropdown
                        container={styles.dropdownContainer}
                        placeholderStyle={styles.dropdownPlacholderStyle}
                        dropdownItemStyle={styles.dropdownItemStyle}
                        dropdownItemTextStyle={styles.dropdownItemTextStyle}
                        selectedTextStyle={{
                            fontSize: setWidth(3.2),
                            color: colors.dark_charcoal
                        }}
                        data={this.state.storeSize}
                        placeholder={"Store Size"}
                        value={this.state.selectedStoreSize}
                        onChange={(v) => this.setState({ selectedStoreSize: v })}
                    />

                    {/* <CustomTextInput
                        placeholder="URL*"
                        inputStyle={styles.inputStyle}
                        value={this.state.url}
                        onChangeText={(e) => this.setState({ url: e })}
                    /> */}

                </KeyboardAwareScrollView>
                <View style={styles.footerBtnContainer} >
                    <TouchableOpacity style={[styles.footerBtn, { backgroundColor: colors.white }]} onPress={() => {
                        setScreenActivity({ action_type: "going_back", action_id: '' })
                        this.props.navigation.goBack()}}>
                        <Text style={[styles.btnText, { color: colors.lightRed }]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerBtn} onPress={() => this._editProfile()}>
                        <Text style={styles.btnText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.showLoader &&
                    <FullScreenLoader
                        isOpen={this.state.showLoader}
                    />
                }
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    // height={setHeight(10)}
                    openDuration={250}
                    customStyles={{
                        container: {
                            height: Platform.OS === 'ios' ? setHeight(25) : setHeight(20),
                        },
                        wrapper: {
                            // backgroundColor: 'red'
                        },
                    }}
                >
                    <TouchableOpacity style={styles.itemView} onPress={() => this._openImageLibrary()}>
                        <Text style={styles.actionsheetTitle}>Launch Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemView} onPress={() => this._openCamera()}>
                        <Text style={styles.actionsheetTitle}>Launch Camera</Text>
                    </TouchableOpacity>
                </RBSheet>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        loginReducer: state.loginReducer,
    }
}

const mapDispatchToProps = dispatch => ({
})

const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(EditProfileScreen)

