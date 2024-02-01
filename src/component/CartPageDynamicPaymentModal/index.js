import { Animated, Dimensions, Text, View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { styles } from './style'
import CartPageMapping from '../CartPageMapping';
import Step1 from './Step1';
import colors from '../../utils/colors';
import { errorAlert } from '../../helper/ToastHelper';
import Step2 from './Step2';
import Step3 from './Step3';
import EmptyCartModal from '../EmptyCartModal';

const { width, height } = Dimensions.get("screen")

export default class CartPageDynamicPaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart_map_pointer: [
        {
          id: 1,
          title: "Step1",
          isDone: true,
          showRedDash: false
        },
        {
          id: 2,
          title: "Step2",
          isDone: false,
          showRedDash: false
        },
        {
          id: 3,
          title: "Step3",
          isDone: false,
          showRedDash: false
        }
      ],
      currentMapIndex: 0,
      total_price_to_pay: 0,
      cart_items: [],
      brand_id: '',
      city_name: '',
      selected_item: {},
      emptyCartModalTitle: '',
      showEmptyCartModal: false,

      onPressAddNewAddress: undefined,
      onPressChangeAddress: undefined,
      total_price_details: undefined,
      default_shipping_address: undefined,
      onCityWiseBuy: undefined,
      checkMinimumOrderPrice: undefined,
      onPressContinueShopping: undefined,
      onChoosePaymentMode: undefined,
      showPaymentBreakUpModal: undefined,
      onClosePaymentProcessModal: undefined,
      notDeliverable: false,
      cod_percentage: 0,
      cod_amount_to_pay: 0,
      total_order_value: 0,
      city_wallet_amount: 0,
      credit_balance: 0
    };
    this.yAxis = new Animated.Value(height)
  }

  static getDerivedStateFromProps(props, state) {

    return {
      cart_items: props.cart_items ? props.cart_items : [],
      onPressAddNewAddress: props.onPressAddNewAddress ? props.onPressAddNewAddress : undefined,
      onPressChangeAddress: props.onPressChangeAddress ? props.onPressChangeAddress : undefined,
      // total_price_details: props.total_price_details ? props.total_price_details : undefined,
      onCityWiseBuy: props.onCityWiseBuy ? props.onCityWiseBuy : undefined,
      default_shipping_address: props.default_shipping_address ? props.default_shipping_address : undefined,
      checkMinimumOrderPrice: props.checkMinimumOrderPrice ? props.checkMinimumOrderPrice : undefined,
      onPressContinueShopping: props.onPressContinueShopping ? props.onPressContinueShopping : undefined,
      onChoosePaymentMode: props.onChoosePaymentMode ? props.onChoosePaymentMode : undefined,
      showPaymentBreakUpModal: props.showPaymentBreakUpModal ? props.showPaymentBreakUpModal : undefined,
      onClosePaymentProcessModal: props.onClosePaymentProcessModal ? props.onClosePaymentProcessModal : undefined,
      notDeliverable: props.hasOwnProperty("notDeliverable") ? props.notDeliverable : false,
      cod_percentage: props.cod_percentage ? props.cod_percentage : 0,
      cod_amount_to_pay: props.cod_amount_to_pay ? props.cod_amount_to_pay : 0,
      total_order_value: props.total_order_value ? props.total_order_value : 0,
      city_wallet_amount: props.city_wallet_amount ? props.city_wallet_amount : 0,
      credit_balance: props.credit_balance ? props.credit_balance : 0
    }
  }

  onPressCartItem = (item) => {
    
    if (item) {
      this.setState({ 
        total_price_to_pay: item.gross_total_price, 
        city_name: item.city_name, 
        selected_item: item 
      })
      if (this.state.onCityWiseBuy) {
        this.state.onCityWiseBuy(item)
      }
    } else {
      this.setState({ total_price_to_pay: 0, city_name: '', selected_item: {} })
    }
  }


  async checkMinimumOrderPrice() {

    const item_data = this.state.selected_item

    if (+item_data.gross_total_price < +item_data.minimum_order_amount) {
      const remain = (+item_data.minimum_order_amount - +item_data.gross_total_price)
      this.setState({
        showEmptyCartModal: true,
        emptyCartModalTitle: "ADD PRODUCT FOR RS " + parseFloat(remain).toFixed(2) + " TO REACH MINIMUM ORDER VALUE OF RS. " + parseFloat(item_data.minimum_order_amount).toFixed(2)
      })
      return false
    } else {
      return true
    }
  }


  onPressFooterBtn = async () => {
    const currentMapIndex = this.state.currentMapIndex
    const cart_map_pointer = this.state.cart_map_pointer

    const total_price_details = this.props.total_price_details
    const selected_item = this.state.selected_item

    if (this.state.total_price_to_pay == 0) {
      errorAlert("Oops!", "Please Select an Order To Proceed.")
      return
    }        

    if (this.state.notDeliverable && currentMapIndex == 1) {
      errorAlert("Sorry!", "Order cannot be deliver in your address.\nPlease change your address.")
      return
    }

    let filter_price = []
    if(selected_item?.shop_in_shop == "1"){
      filter_price = total_price_details.filter(item => item.brand_id == selected_item.brand_id)
    }else{
      filter_price = total_price_details.filter(item => item.city_id == selected_item.city_id)
    }

    this.setState({
      total_price_details: filter_price
    })

    if (+currentMapIndex + 1 > 2) {
      if (this.state.showPaymentBreakUpModal) {
        this.state.showPaymentBreakUpModal()
      }
      return
    }

    const result = await this.checkMinimumOrderPrice()
    if (result) {
      cart_map_pointer[(+currentMapIndex + 1)].isDone = true
      cart_map_pointer[(+currentMapIndex + 1)].showRedDash = true

      this.setState({
        currentMapIndex: (+currentMapIndex + 1),
        cart_map_pointer: cart_map_pointer
      })
    }
  }

  onChoosePaymentMode = (payment_obj) => {
    if (this.state.onChoosePaymentMode) {
      //console.log(payment_obj);
      this.setState({
        total_price_to_pay: payment_obj.amount
      })
      this.state.onChoosePaymentMode(payment_obj)
    }
  }

  animUp() {
    Animated.timing(this.yAxis, {
      useNativeDriver: false,
      toValue: 0,
      duration: 500
    }).start()
  }

  animDown() {
    Animated.timing(this.yAxis, {
      useNativeDriver: false,
      toValue: height,
      duration: 500
    }).start(() => {
      if (this.state.onClosePaymentProcessModal) {
        this.state.onClosePaymentProcessModal()
      }
    })
  }

  componentDidMount() {
    this.animUp()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backDrop} onPress={() => this.state.onClosePaymentProcessModal()}>

        </TouchableOpacity>
        <Animated.View style={[styles.content, { transform: [{ translateY: this.yAxis }] }]}>
          <CartPageMapping
            cart_map_pointer={this.state.cart_map_pointer}
          />

          {
            this.state.currentMapIndex == 0 ?
              <Step1
                cart_items={this.state.cart_items}
                onPressCartItem={(item) => this.onPressCartItem(item)}
              />
              :
              this.state.currentMapIndex == 1 ?
                <Step2
                  city_name={this.state.city_name}
                  onPressChangeAddress={this.state.onPressChangeAddress}
                  onPressAddNewAddress={this.state.onPressAddNewAddress}
                  total_price_details={this.state.total_price_details}
                  default_shipping_address={this.state.default_shipping_address}
                  notDeliverable={this.state.notDeliverable}
                />
                :
                <Step3
                  default_shipping_address={this.state.default_shipping_address}
                  city_wallet_amount={this.state.city_wallet_amount}
                  credit_balance={this.state.credit_balance}
                  cod_percentage={this.state.cod_percentage}
                  cod_amount_to_pay={this.state.cod_amount_to_pay}
                  total_order_value={this.state.total_order_value}
                  onChoosePaymentMode={(payment_obj) => this.onChoosePaymentMode(payment_obj)}
                />
          }

          {
            this.state.showEmptyCartModal &&
            <EmptyCartModal
              title={this.state.emptyCartModalTitle}
              onPressContinueShopping={() => {
                this.setState({ showEmptyCartModal: false })
                if (this.state.onPressContinueShopping) {
                  this.state.onPressContinueShopping()
                }
              }}
              onPressClose={() => {
                this.setState({ showEmptyCartModal: false })
                this.animDown()
              }}
            />
          }
          <View style={styles.footerBtnView}>
            <View style={styles.row}>
              <Text style={[styles.footerText, styles.textBold]}>Total </Text>
              <Text style={[styles.footerText, styles.textBold, { color: colors.grey2 }]}> ₹ {parseFloat(this.state.total_price_to_pay).toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.footerBtn} onPress={this.onPressFooterBtn}>
              <Text style={styles.footerBtnText} adjustsFontSizeToFit numberOfLines={1}>
                {
                  this.state.currentMapIndex == 0 ?
                    "PROCEED TO SELECT ADDRESS"
                    :
                    this.state.currentMapIndex == 1 ?
                      "CONFIRM ADDRESS"
                      :
                      "PROCEED TO BUY"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </View>
    )
  }
}