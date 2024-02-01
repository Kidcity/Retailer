import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, Platform, Linking, Animated, BackHandler, Dimensions } from 'react-native';
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
import { clearProductFilterAction, setProductFilterAction } from '../../redux/actions/commonAction';
import { clearProductListData } from '../../redux/actions/productListAction'
import FooterTabMenu from '../../component/FooterTabMenu';
import RetailerZone from '../../component/RetailerZone';
import RupifiServices from '../../services/RupifiServices';
import CityWalletServices from '../../services/CityWalletServices';
import SearchTextBox from '../../component/SearchTextBox';
import YoutubeTutorialButton from '../../component/YoutubeTutorialButton';
import IconicBrand from '../../component/IconicBrand';
import FastImageComponent from '../../component/FastImageComponent';
import VersionInfo from 'react-native-version-info'
import { setAppVersionAction } from '../../redux/actions/loginAction';
import RateUsModal from '../../component/RateUsModal';
import { clearScreenActivity, setScreenActivity } from '../../helper/AppActivityTrackingHelper'
import { getStore } from '../../helper/AsyncStorageHelper';
import { store } from '../../redux/store'
import NotificationServices from '../../services/NotificationServices';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      phone_number: '',
      banners: {},
      store_category: [],
      cities: [],
      brands: [],
      iconic_brand: [],
      promos: [],
      isOpenFloatingMenu: false,
      showCreditModal: false,
      openChooseStoreModal: false,
      selectedStoreCategoryType: '',
      selectedStoreCategoryName: '',
      showLoader: false,
      searchText: '',
      suggestions: [],
      rupifi_account_status: '',
      showStatusModal: false,
      device_token: "",
      showRateUsModal: false,
      viewablePromoItemIndex: 0,
      credit_banner: ""
    };

    this.scrollRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props.device_token);
    return {
      banners: props.banners ? props.banners : {},
      promos: props.promos ? props.promos : [],
      store_category: props.homeReducer.main_categories ? props.homeReducer.main_categories : [],
      brands: (props.homeReducer.available_brand) ? props.homeReducer.available_brand : [],
      phone_number: (props.phone_number) ? props.phone_number : '',
      user_id: props.user_id ? props.user_id : '',
      cities: (props.homeReducer.cities) ? props.homeReducer.cities : [],
      iconic_brand: props.iconic_brand ? props.iconic_brand : [],
      rupifi_account_status: props.rupifi_account_status ? props.rupifi_account_status : '',
    }
  }

  navigateToCityStore(city_name, city_id) {
    setScreenActivity({ action_type: "city_count", action_id: city_id, city_id: city_id })

    this.props.navigation.navigate("StoreByCity", { city_name: city_name, city_id: city_id, fromHomeScreen: true })
  }

  async _navigateToProductList(brand = null) {

    await this.props.clearProductListData()
    await this.props.clearProductFilterAction()
    let param = this.props.filter
    param = {
      ...param,
      brand: brand.id.toString(),
    }

    this.setState({
      searchText: ''
    })
    setScreenActivity({ action_type: "brandwise_list", action_id: brand.id })
    await this.props.setProductFilterAction(param)
    this.props.navigation.navigate("ProductListing")
  }


  _availableBrand() {
    const param = {
      city: ''
    }
    HomeService._availableBrandService(param).then(response => {
      this.setState({
        // brands: response
      })
    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this._availableBrand())
      } else {
        // errorAlert("Error in getting brands", error.message)
      }
    })
  }

  _getColors() {
    HomeService._getColorsService().then(response => {

    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this._getColors())
      } else {
        // errorAlert("Error in getting colors", error.message)
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

  _getBanners() {
    this.setState({ showLoader: true })
    const param = {
      city: ''
    }

    HomeService._getBannerService(param).then(response => {
      if (response.credit_banner) {
        this.setState({
          credit_banner: response.credit_banner
        })
      }
      this.setState({ showLoader: false })
    }, error => {
      this.setState({ showLoader: false })
      if (error.message == "server_error") {
        retryAlert(() => this._getBanners())
      } else {
        // errorAlert("Error in get banners", error.message)
      }
    })
  }

  _getCities() {
    this.setState({ showLoader: true })
    HomeService._getCitiesService().then(response => {
      this.setState({ showLoader: false })
    }, error => {
      this.setState({ showLoader: false })
      if (error.message == "server_error") {
        retryAlert(() => this._getCities())
      } else {
        // errorAlert("Error in get cities", error.message)
      }
    })
  }

  _getCutomerCreditAccountDetails() {
    const param = {
      merchant_customer_id: this.state.phone_number
    }
    RupifiServices._getCustomerAccountInfo(param).then(response => {
      if (response != rupifi_status.PRE_APPROVED && response != rupifi_status.ACTIVE && response != rupifi_status.PRE_APPROVAL_PENDING) {
        this.setState({
          showStatusModal: true
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
    console.log(param);
    NotificationServices._unreadNotificationService(param).then(response => {

    }, error => {
      if (error.message == "server_error") {
        retryAlert(() => this.onPressNotification())
      } else {
        errorAlert("Error", error.message)
      }
    })
  }




  async componentDidMount() {
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
        // this.scrollRef.current.scrollTo({ animated: true, y: 0 });
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

    await Promise.allSettled([
      this.storeDeviceToken(),
      this.getUnreadNotification(),
      this.getAppVersion(),
      this._getBanners(),
      this._getCities(),
      this._availableBrand(),
      this._syncCustomerToUniware(),
      this._getCutomerCreditAccountDetails(),
      this._getCutomerCityWalletAmount()
    ])

  }

  componentWillUnmount() {
    this.willFocusSubscription()
    this.backHandler.remove()
  }

  onPressBannerItem = (index, status, item) => {
    if (item.link) {
      setScreenActivity({ action_type: "banner_select", action_id: item.id })

      Linking.openURL(item.link)

    }
  }


  renderCities = ({ item, index }) => {
    const numOfCity = this.state.cities.length;

    return (
      <TouchableOpacity key={index} style={[styles.citiesContainer, numOfCity == 2 && { width: '45%' }, numOfCity == 1 && { width: '100%' }]} onPress={() => {
        this.navigateToCityStore(item.city_name, item.city_id)
      }}>
        <View style={[styles.citiesView, numOfCity == 2 && {
          flex: 1,
          width: null
        }, numOfCity == 1 && { width: '100%' }]}>
          <FastImageComponent
            style={[styles.cityImage]}
            source={{ uri: item.logo }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </View>
        <Text style={styles.cityName}>{item.city_name}</Text>
      </TouchableOpacity>
    )
  }

  renderPromos = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ width: ((Dimensions.get("screen").width) - setWidth(5)) / 2 }} onPress={() => this.onPressBannerItem(index, false, item)}>
        <View style={styles.discoutnImageView}>
          <FastImageComponent
            style={styles.discountImage}
            source={{ uri: item.image }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        {/*
          item.title &&
          <Text style={styles.promoText}>{item.title}</Text>
    */}
      </TouchableOpacity>
    )
  }

  renderPromoDotItem = ({ item, index }) => {
    const viewablePromoItemIndex = this.state.viewablePromoItemIndex
    return (
      <View style={[styles.dotView]}>
        {
          (viewablePromoItemIndex == index) &&
          <Animated.View style={[styles.activeDot]}>
          </Animated.View>
        }
      </View>
    )
  }

  onViewableItemsChanged = (info: { viewableItems: ViewToken[]; changed: ViewToken[] }): void => {
    const visibleItems = info.changed.filter((entry) => entry.isViewable);
    visibleItems.forEach((visible) => {
      this.setState({
        viewablePromoItemIndex: (visible) ? visible.index : this.state.viewablePromoItemIndex
      })
      // console.log(visible)
    });
  }

  backAction = () => {
    // const { routesLength } = this.props;
    // setScreenActivity({ action_type: "going_back", action_id: '' })

    BackHandler.exitApp();
    // if (routesLength == 1 || routesLength === undefined) {
    // } else {
    //   this.props.navigation.goBack();
    // }
    return true;
  };

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          showMenu={true}
          showFavouriteIcon={true}
          showSearchIcon={true}
          onPressBellIcon={() => this.props.navigation.navigate("Notification")}
          navigation={this.props.navigation}
        />

        <SearchTextBox
          shouldShowUpperPaddingForIOS={false}
          navigation={this.props.navigation}
          city_id=""
          placeholder="Search For Brands, Items or More ........."
          searchIconColor={colors.grey1}
          suggestionBoxTopGap={setWidth(15) + setWidth(12)}
          shouldShowSuggesstionDropdown
        />


        <View style={{ flex: 1 }}>
          <ScrollView ref={this.scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            <View style={styles.bannerContainer}>
              <FullScreenBanner
                autoScroll
                data={(this.state.banners.HEADER) ? this.state.banners.HEADER.banner_details : []}
                bannerCardStyle={{
                  width: setWidth(100),
                  height: setHeight(50),
                  margin: 0,
                  borderRadius: 0,
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

            <View style={styles.brandCityContainer}>
              <Text style={[styles.heading, { color: colors.grey2 }]}>SHOP BY CITY</Text>
              <FlatList
                data={this.state.cities}
                renderItem={this.renderCities}
                numColumns={3}
                columnWrapperStyle={{
                  // flex: 1
                  justifyContent: 'space-around'
                }}
                contentContainerStyle={{
                  // backgroundColor:'red'
                }}
                ItemSeparatorComponent={() => <View style={{ marginTop: setHeight(3) }} />}
                style={{
                  marginTop: setHeight(2)
                }}
              />
            </View>

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


            <YoutubeTutorialButton
              containerStyle={{
                marginTop: setHeight(2)
              }}
              onPress={() => { Linking.openURL("https://www.youtube.com/@kidcityindia934") }}
            />

            <AvailableBrands
              containerStyle={{
                marginTop: setHeight(6)
              }}
              brands={this.state.brands}
              onPressBrand={(brand) => this._navigateToProductList(brand)}
              onPressAllBrand={() => {
                this.props.navigation.navigate("AllBrands", { city_name: '', from_screen: 'home' })
              }}
            />


            <TouchableOpacity style={styles.applyCreditView}
              onPress={() => {
                this.props.navigation.navigate("ApplyForCredit")
              }}
            >
              {
                this.state.credit_banner !== '' ?

                  <FastImageComponent
                    style={styles.applyCreditimage}
                    source={{uri: this.state.credit_banner}}
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


            <View style={[styles.bannerContainer, { height: setHeight(30), marginTop: setHeight(5) }]}>
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
                dotContainerStyle={{
                  marginTop: setWidth(3)
                }}
                onPressBannerItem={(index, status, item) => this.onPressBannerItem(index, status, item)}
              />
            </View>

            {
              (this.state.promos.banner_details && this.state.promos.banner_details.length > 0) ?
                <View style={styles.discountContainer}>
                  <View>
                    <Text style={styles.heading}>DIRECT ACCESS TO CATEGORIES</Text>
                  </View>
                  <FlatList
                    data={this.state.promos.banner_details ?? []}
                    horizontal
                    renderItem={this.renderPromos}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ margin: setWidth(2) }} />}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    decelerationRate={0}
                    scrollEventThrottle={16}
                    viewabilityConfig={{
                      itemVisiblePercentThreshold: 100,
                      minimumViewTime: 200,
                    }}
                    style={{
                      marginTop: setHeight(2)
                    }}
                  />

                  <View style={{ marginTop: setHeight(3) }}>
                    <FlatList
                      data={this.state.promos.banner_details ?? []}
                      keyExtractor={(item, index) => index}
                      renderItem={this.renderPromoDotItem}
                      horizontal
                      ItemSeparatorComponent={() => <View style={{ marginLeft: setWidth(2) }} />}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </View>
                </View>
                :
                <View style={{ marginBottom: setWidth(15) }} />
            }


            <IconicBrand
              data={this.state.iconic_brand}
              onPressBrand={(brand) => this._navigateToProductList({ ...brand, id: brand.brand_id })}
            />

            <View style={[styles.bannerContainer, { height: setHeight(30) }]}>
              <FullScreenBanner
                showDots={true}
                autoScroll
                data={(this.state.banners.SECTION_2) ? this.state.banners.SECTION_2.banner_details : []}
                // staticImage={true}
                bannerCardStyle={{
                  height: setHeight(25),
                }}
                bannerImageStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  resizeMode: 'cover'
                }}
                dotContainerStyle={{
                  marginTop: setWidth(2)
                }}
                onPressBannerItem={(index, status, item) => this.onPressBannerItem(index, status, item)}
              />
            </View>

            <RetailerZone
              containerStyle={{
                marginTop: setHeight(5)
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
        </View>

        <FloatingMenuIcon />

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

        {
          this.state.showLoader &&
          <FullScreenLoader
            isOpen={this.state.showLoader}
          />
        }
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
    homeReducer: state.homeReducer,
    banners: state.homeReducer.banners,
    promos: state.homeReducer.promos,
    filter: state.commonReducer.filter,
    user_id: state.loginReducer.data.cust_manu_id,
    phone_number: state.loginReducer.data.phone,
    iconic_brand: state.homeReducer.iconic_brand,
    rupifi_account_status: state.applyForCreditReducer.rupifi_account_status,
  }
}

const mapDispatchToProps = dispatch => ({
  setProductFilterAction: (param) => dispatch(setProductFilterAction(param)),
  clearProductFilterAction: () => dispatch(clearProductFilterAction()),
  clearProductListData: () => dispatch(clearProductListData()),
  setAppVersionAction: (param) => dispatch(setAppVersionAction(param))
})

const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(HomeScreen)
