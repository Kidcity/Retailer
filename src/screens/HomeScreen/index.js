import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Platform, Linking, BackHandler } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import { styles } from './style';
import { appStoreLink, fonts, images, rupifi_status, setHeight, setWidth } from '../../utils/variable';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import colors from '../../utils/colors';
import FloatingMenuIcon from '../../component/FloatingMenuIcon';
import AvailableBrands from '../../component/AvailableBrands';
import HomeService from '../../services/HomeService';
import { retryAlert } from '../../helper/ToastHelper';
import FullScreenLoader from '../../component/FullScreenLoader';
import FullScreenBanner from '../../component/FullScreenBanner';
import { clearProductFilterAction, setOpenAvailCreditModalAction, setProductFilterAction } from '../../redux/actions/commonAction';
import { clearProductListData } from '../../redux/actions/productListAction'
import FooterTabMenu from '../../component/FooterTabMenu';
import RetailerZone from '../../component/RetailerZone';
import RupifiServices from '../../services/RupifiServices';
import CityWalletServices from '../../services/CityWalletServices';
import YoutubeTutorialButton from '../../component/YoutubeTutorialButton';
import IconicBrand from '../../component/IconicBrand';
import FastImageComponent from '../../component/FastImageComponent';
import VersionInfo from 'react-native-version-info'
import { setAppVersionAction } from '../../redux/actions/loginAction';
import RateUsModal from '../../component/RateUsModal';
import { clearScreenActivity, setScreenActivity } from '../../helper/AppActivityTrackingHelper'
import { getStore } from '../../helper/AsyncStorageHelper';
import NotificationServices from '../../services/NotificationServices';
import StoreByCityService from '../../services/StoreByCityService';
import CategoriesSlider from '../../component/CategoriesSlider';
import VerticalCategories from '../../component/VerticalCategories';
import ShopByAge from '../../component/ShopByAge'
import WelcomeModal from '../../component/WelcomeModal';
import AvailCreditModal from '../../component/AvailCreditModal';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genders: null,
      user_id: '',
      phone_number: '',
      categories: null,
      vertical_categories: null,
      showLoader: true,
      selectedGender: '',
      banners: null,
      available_brands: null,
      shop_in_shop: null,
      promos: null,
      showRateUsModal: false,
      credit_banner: "",
      showAvailCredit: false
    };
    this.interval = null
    this.second = 0
    this.scrollRef = React.createRef()
  }

  startTimer = () => {

    this.interval = setInterval(() => {
      this.second += 1
      if (this.second === 15) {
        this.props.setOpenAvailCreditModalAction(true)
        this.stopTimer()
      }
    }, 1000);
  }

  stopTimer = () => {
    clearInterval(this.interval)
    this.second = 0
  }

  static getDerivedStateFromProps(props, state) {
    return {
      user_id: props.user_id ? props.user_id : '',
      phone_number: (props.phone_number) ? props.phone_number : '',
      genders: props.hasOwnProperty("genders") ? props.genders : null,
      categories: props.hasOwnProperty("categories") ? props.categories : null,
      banners: props.hasOwnProperty("banners") ? props.banners : null,
      vertical_categories: props.hasOwnProperty("vertical_categories") ? props.vertical_categories : null,
      available_brands: props.hasOwnProperty("available_brands") ? props.available_brands : null,
      shop_in_shop: props.shop_in_shop ? props.shop_in_shop : null,
      promos: props.hasOwnProperty("promos") ? props.promos : null
    }
  }

  async componentDidMount() {

    this.startTimer()

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      (e) => {
        setTimeout(() => {
          clearScreenActivity()
        }, 500);
        const param = this.props?.route?.params
        if (param && param.rate_experience == 1) {
          this.setState({
            showRateUsModal: true
          })
        }
      }
    );
    await this.props.clearProductFilterAction()
    await this.props.clearProductListData()

    this._singleTymCallingApis()
    // this._multiTymCallingAPIs()

  }

  _multiTymCallingAPIs = async () => {
    // parallel apis
    this.scrollRef.current.scrollTo({ animated: true, y: 0 });
    await Promise.allSettled([
      this._getCategories(),
      this._getBanners(),
      this._getShopINShopBrand(),
      this._availableBrand(),
    ])

  }

  _singleTymCallingApis = async () => {
    await Promise.allSettled([
      await this._getGenders(),
      this._getBanners(),
      this._getCategories(),
      this._getCities(),
      this._availableBrand(),
      this._getShopINShopBrand(),
      this.storeDeviceToken(),
      this.getUnreadNotification(),
      this.getAppVersion(),
      this._syncCustomerToUniware(),
      this._getCutomerCityWalletAmount(),
      this._getCutomerCreditAccountDetails(),
    ])
  }

  componentWillUnmount() {
    this.willFocusSubscription()
    this.backHandler.remove()
  }

  getAppVersion() {
    const current_app_versionName = VersionInfo.appVersion.toString()
    const current_app_versionCode = VersionInfo.buildVersion.toString()
    this.props.setAppVersionAction({ version_code: current_app_versionCode, version_name: current_app_versionName })
    return { version_code: current_app_versionCode, version_name: current_app_versionName }
  }

  async storeDeviceToken() {
    const device_token = await getStore("@device_token_KC")
    const current_app_versionName = this.getAppVersion().version_name
    const current_app_versionCode = this.getAppVersion().version_code

    const param = {
      retailer_id: this.state.user_id,
      fcm_token: device_token,
      android_version: Platform.OS === 'android' ? current_app_versionName : "",
      android_code: Platform.OS === 'android' ? current_app_versionCode : "",
      ios_version: Platform.OS === 'ios' ? current_app_versionName : "",
      ios_code: Platform.OS === 'ios' ? current_app_versionCode : "",
    }

    HomeService._storeDeviceToken(param).then(response => {

    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this.storeDeviceToken())
      } else {
        // errorAlert("Error in getting wallet balance", error.message)
      }
    })
  }

  getUnreadNotification = () => {

    const param = {
      retailer_id: this.state.user_id,
    }
    // console.log(param);
    NotificationServices._unreadNotificationService(param).then(response => {

    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this.onPressNotification())
      } else {
        errorAlert("Error", error.message)
      }
    })
  }

  _getGenders = async () => {
    const param = {
      category_id: '',
      season: '',
      city: ''
    }

    await StoreByCityService._getGenderService(param).then(response => {
      // set the gender initial state
      if (!this.state.selectedGender) {
        this.setState({
          selectedGender: this.state.genders[0].id
        })
      }
    }, error => {

    })
  }

  _getShopINShopBrand = async () => {
    // console.log(this.state.selectedGender);

    const param = {
      limit: 5,
      gender: this.state.selectedGender
    }
    // console.log('_getShopINShopBrand ', param);
    await HomeService._shopINshopBrandService(param).then(response => {

    }, error => {

    })
  }

  _getCategories = async () => {
    if (!this.state.selectedGender) {
      return
    }
    const param = {
      category_id: this.state.selectedGender+"",
      season: '1,2',
      city: ''
    }
    console.log('_getCategories ==> ', param);
    this.setState({ showLoader: true })

    await StoreByCityService._categoriesService(param).then(response => {
      this.setState({ showLoader: false })
    }, error => {
      this.setState({ showLoader: false })
    })
  }

  _getBanners() {

    const param = {
      city: '',
      gender: this.state.selectedGender+""
    }

    console.log("banner param ==> ", param);

    HomeService._getBannerService(param).then(response => {
      if (response.credit_banner) {
        this.setState({
          credit_banner: response.credit_banner
        })
      }

    }, error => {
      console.log("banner err => ",error);
      if (error.message == "server_error") {
        retryAlert(() => this._getBanners())
      } else {
      }
    })
  }

  _getCities() {

    HomeService._getCitiesService().then(response => {

    }, error => {

      if (error.message == "server_error") {
        retryAlert(() => this._getCities())
      } else {
        // errorAlert("Error in get cities", error.message)
      }
    })
  }

  _availableBrand() {
    const param = {
      city: '',
      gender: this.state.selectedGender
    }
    // console.log('_availableBrand ', param);

    HomeService._availableBrandService(param).then(response => {
    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this._availableBrand())
      } else {
      }
    })
  }

  _syncCustomerToUniware() {
    HomeService._syncCustomerToUniwareService(this.state.user_id).then(response => {

    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this._syncCustomerToUniware())
      } else {
        // errorAlert("Error in sync customer to uniware", error.message)
      }
    })
  }

  _getCutomerCreditAccountDetails() {
    const param = {
      merchant_customer_id: this.state.phone_number
    }

    // console.log('credit ', param);

    RupifiServices._getCustomerAccountInfo(param).then(response => {
      // console.log("_getCustomerAccountInfo ===> ",JSON.stringify(response));
      if (response !== rupifi_status.PRE_APPROVED && response !== rupifi_status.ACTIVE) {
        this.setState({
          showAvailCredit: true
        })
      }
    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this._getCutomerCreditAccountDetails())
      } else {
        // errorAlert("Error in getting credit details", error.message)
      }
    })
  }

  async _getCutomerCityWalletAmount() {
    const param = {
      retailer_id: this.state.user_id
    }

    await CityWalletServices._getCityWalletAmountService(param).then(response => {

    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this._getCutomerCityWalletAmount())
      } else {
        // errorAlert("Error in getting wallet balance", error.message)
      }
    })
  }

  _onApplygender = (data) => {
    this.setState({
      selectedGender: data.selectedGender
    }, () => {
      this._multiTymCallingAPIs()
    })
  }

  showMoreShopinShop = () => {
    this.props.navigation.navigate("ShopInShop")
  }

  async _brandWistList(brand = null) {

    await this.props.clearProductListData()
    await this.props.clearProductFilterAction()
    let param = this.props.filter
    param = {
      ...param,
      brand: brand.id.toString(),
      city: brand.city_id.toString()
    }

    setScreenActivity({ action_type: "brandwise_list", action_id: brand.id })
    await this.props.setProductFilterAction(param)
    this.props.navigation.navigate("ProductListing")
  }

  async _ageWiseList(age = null) {

    await this.props.clearProductListData()
    await this.props.clearProductFilterAction()
    let param = this.props.filter
    param = {
      ...param,
      ageGroup: age,
    }

    // setScreenActivity({ action_type: "agewise_list", action_id: brand.id })
    await this.props.setProductFilterAction(param)
    this.props.navigation.navigate("ProductListing")
  }

  onPressHorizontalCategories = async(item) => {
    if(item.link !== ""){     
      console.log("link clicked => ", item.link); 
      await this.props.clearProductListData()
      await this.props.clearProductFilterAction()
      Linking.openURL(item.link)
    }else{
      // console.log("link clicked => ", item.id); 
      this._categoryWiseList(item.id)
    }
  }

  async _categoryWiseList(category_id) {

    await this.props.clearProductListData()
    await this.props.clearProductFilterAction()
    let param = this.props.filter
    param = {
      ...param,
      category: this.state.selectedGender + "",
      subCategory: category_id.toString(),
    }


    setScreenActivity({ action_type: "categorywise_list", action_id: category_id })
    await this.props.setProductFilterAction(param)
    this.props.navigation.navigate("ProductListing")
  }

  onPressBannerItem = (index, status, item) => {
    if (item.link) {
      setScreenActivity({ action_type: "banner_select", action_id: item.id })
      Linking.openURL(item.link)
    }
  }


  backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          showMenu={true}
          showBuyFor={true}
          showFavouriteIcon={true}
          showSearchIcon={true}
          onPressBellIcon={() => this.props.navigation.navigate("Notification")}
          navigation={this.props.navigation}
          genders={this.state.genders}
          initialSelecteGender={this.state.genders[0] ?? null}
          onApplyGender={this._onApplygender}
        />

        <ScrollView ref={this.scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <CategoriesSlider
            selectedGender={this.state.selectedGender}
            categories={this.state.categories}
            showLoader={this.state.categories_loader}
            onPressCategory={(item) => this.onPressHorizontalCategories(item)}
          />

          {
            this.state.banners?.HEADER?.banner_details &&
            <View style={[styles.bannerContainer, { marginTop: setHeight(2) }]}>
              <FullScreenBanner
                autoScroll
                data={this.state.banners?.HEADER?.banner_details ?? []}
                bannerCardStyle={{
                  // width: setWidth(100),
                  height: setHeight(43),
                  // margin: 0,
                  // borderRadius: 0,
                }}
                bannerImageStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  resizeMode: 'cover'
                }}
                showDots={true}
                onPressBannerItem={(index, status, item) => this.onPressBannerItem(index, status, item)}
              />
            </View>
          }


          {
            this.state.promos?.banner_details &&
            <View style={styles.promoBannerContainer}>
              <FullScreenBanner
                autoScroll
                data={this.state.promos?.banner_details}
                bannerCardStyle={{
                  width: setWidth(100),
                  height: 110,
                  margin: 0,
                  borderRadius: 0,
                }}
                bannerImageStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  resizeMode: 'contain'
                }}
                resizeMode={FastImage.resizeMode.contain}
                showDots={true}
                dotViewContainer={{
                  paddingVertical: setHeight(1.2),
                }}
                onPressBannerItem={(index, status, item) => this.onPressBannerItem(index, status, item)}
              />
            </View>
          }


          {
            this.state.available_brands &&
            <AvailableBrands
              selectedGender={this.state.selectedGender}
              brands={this.state.available_brands}
              onPressBrand={(brand) => {
                if (brand.brand_name == "view_more") {
                  this.props.navigation.navigate("AllBrands", { city_name: brand.city_name, city_id: brand.city_id, from_screen: 'home' })
                } else {
                  this._brandWistList(brand)
                }
                //
              }}
              onPressAllBrand={() => {
                this.props.navigation.navigate("AllBrands", { city_name: '', from_screen: 'home' })
              }}
            />
          }

          {
            this.state.banners?.SECTION_1?.banner_details &&
            <View style={[styles.bannerContainer, { height: setHeight(30), marginTop: setHeight(3) }]}>
              <FullScreenBanner
                showDots={true}
                autoScroll
                data={(this.state.banners.SECTION_1) ? this.state.banners.SECTION_1.banner_details : []}
                bannerCardStyle={{
                  height: setHeight(25),
                }}
                bannerImageStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  resizeMode: 'cover'
                }}

                onPressBannerItem={(index, status, item) => this.onPressBannerItem(index, status, item)}
              />
            </View>
          }


          <IconicBrand
            selectedGender={this.state.selectedGender}
            data={this.state.shop_in_shop}
            onPressBrand={(brand) => this._brandWistList({ ...brand, id: brand.brand_id })}
            onPressShowMore={this.showMoreShopinShop}
          />

          {
            // this.state.showAvailCredit &&
            <TouchableOpacity style={styles.applyCreditView}
              onPress={() => {
                this.props.navigation.navigate("ApplyForCredit")
              }}
            >
              {
                this.state.credit_banner !== '' ?

                  <FastImageComponent
                    style={styles.applyCreditimage}
                    source={{ uri: this.state.credit_banner }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  :
                  <FastImageComponent
                    style={styles.applyCreditimage}
                    source={images.apply_credit}
                    resizeMode={FastImage.resizeMode.cover}
                  />
              }
            </TouchableOpacity>
          }

          {
            this.state.banners?.SECTION_2?.banner_details &&
            <View style={[styles.bannerContainer, { height: setHeight(30), marginTop: setHeight(3.5) }]}>
              <FullScreenBanner
                showDots={true}
                autoScroll
                data={(this.state.banners.SECTION_2) ? this.state.banners.SECTION_2.banner_details : []}
                bannerCardStyle={{
                  height: setHeight(25),
                }}
                dotViewContainer={{

                }}
                bannerImageStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  resizeMode: 'cover',
                }}
                onPressBannerItem={(index, status, item) => this.onPressBannerItem(index, status, item)}
              />
            </View>
          }
          <VerticalCategories
            categories={this.state.vertical_categories}
            onPressCategory={(category_id) => this._categoryWiseList(category_id)}
          />

          <View style={styles.benefitContainer}>
            <View style={[styles.row, styles.justifyCenter, styles.alignCenter]}>
              <Text style={[styles.heading, { textDecorationLine: 'underline' }]}>BENEFITS ON</Text>
              <Text style={[styles.heading, { color: colors.lightRed, textDecorationLine: 'underline' }]}> KIDCITY</Text>
            </View>
            <View style={[styles.benefitImageView]}>
              <Image source={images.benefit1} resizeMode="contain" style={styles.benefitImage1} />
              <FastImage
                style={styles.benefitImage2}
                source={images.benefit2}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>

          <ShopByAge
            onPress={(age) => this._ageWiseList(age)}
          />

          <YoutubeTutorialButton
            onPress={() => { Linking.openURL("https://www.youtube.com/@kidcityindia934") }}
          />

          <RetailerZone
            containerStyle={{
              marginTop: setHeight(2)
            }}
          />

          {
            Platform.OS === 'ios' ?
              <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: colors.grey3, marginTop: setWidth(15), marginHorizontal: setWidth(2) }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
              :
              <View style={styles.dashedBorder} />
          }

          <View style={styles.footer}>
            <Text style={[styles.footerText]}>SHOP MORE</Text>
            <Text style={[styles.footerText]}>SAVE MORE</Text>
            <Text style={[styles.heading, { textAlign: 'left', color: colors.grey2, fontSize: setWidth(3.5), fontFamily: fonts.fontRegular }]}>Connecting Brands With Retailers</Text>
          </View>

        </ScrollView>
        <FloatingMenuIcon />
        {
          this.state.showLoader &&
          <FullScreenLoader
            isOpen={this.state.showLoader}
          />
        }

        {
          this.state.showRateUsModal &&
          <RateUsModal
            onClose={() => {
              this.setState({
                showRateUsModal: false
              })
            }}
            onPressRateBtn={(link) => {
              this.setState({ showRateUsModal: false })
              Linking.openURL(Platform.OS === 'android' ? appStoreLink.androidstore : appStoreLink.iosstore)
            }}
          />
        }

        {/* <WelcomeModal />
        <AvailCreditModal /> */}

        <FooterTabMenu
          focused={true}
          route_name="Home"
          navigation={this.props.navigation}
        />

      </View>
    );
  }
}


const mapStateToProps = state => {
  return {
    genders: state.storeByCityReducer.gender,
    categories: state.storeByCityReducer.categories,
    vertical_categories: state.storeByCityReducer.vertical_categories,
    banners: state.homeReducer.banners,
    promos: state.homeReducer.promos,
    available_brands: state.homeReducer.available_brand,
    shop_in_shop: state.homeReducer.shop_in_shop,
    user_id: state.loginReducer.data.cust_manu_id,
    phone_number: state.loginReducer.data.phone,
  }
}

const mapDispatchToProps = dispatch => ({
  setProductFilterAction: (param) => dispatch(setProductFilterAction(param)),
  clearProductFilterAction: () => dispatch(clearProductFilterAction()),
  clearProductListData: () => dispatch(clearProductListData()),
  setAppVersionAction: (param) => dispatch(setAppVersionAction(param)),
  setOpenAvailCreditModalAction: (data) => dispatch(setOpenAvailCreditModalAction(data)),
})

const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(HomeScreen)
