import { loginAction, setCityWalletAction } from '../redux/actions/loginAction';
import Base from './Base.service'
import { LOGIN_SLUG } from './Slug'
import { store } from '../redux/store'
import { setCartCountDataAction } from '../redux/actions/cartAction';
import { setDefaultAddressAction } from '../redux/actions/addressAction'
import { setWishListCount } from '../redux/actions/wishListAction';


class LoginService extends Base {

    _loginService(param) {
        //console.log(param);
        return new Promise((resolve, reject) => {
            this.post(LOGIN_SLUG, param).then(async response => {
                
                if (response?.data?.data) {
                    
                    if (response.data.data.otp_verified) {
                        
                        const resp_data = response.data.data.data

                        const data = {
                            android_version: response.data.data.data.android_version,
                            ios_version: response.data.data.data.ios_version,
                            cust_manu_id: response.data.data.data.cust_manu_id,
                            default_address: response.data.data.data.default_address,
                            email: response.data.data.data.email,
                            first_name: response.data.data.data.first_name,
                            last_name: response.data.data.data.last_name,
                            image: response.data.data.data.image,
                            phone: response.data.data.data.phone,
                            shop_name: response.data.data.data.shop_name,
                            user_name: response.data.data.data.user_name,
                            user_type_id: response.data.data.data.user_type_id,
                            is_applied_for_credit: 0
                        }

                        if (!response.data.data.data.default_address) {
                            reject({ message: "API error: Proper data is not coming" })
                            return
                        }

                        const add = response.data.data.data.default_address
                        const address = {
                            address_book_id: add.address_book_id,
                            name: response.data.data.data.shop_name,
                            address: add.entry_address1,
                            state: add.zone_name,
                            pin: add.entry_postcode,
                            country: add.countries_name,
                            mobile: response.data.data.data.phone,
                            email: response.data.data.data.email,
                            isChecked: true
                        }
                        
                        await store.dispatch(setCityWalletAction(resp_data?.City_Wallet))                        
                        await store.dispatch(setDefaultAddressAction(address))
                        await store.dispatch(loginAction(data))
                        await store.dispatch(setCartCountDataAction(resp_data?.AddTheCart ))
                        await store.dispatch(setWishListCount(resp_data?.GetWishList))
                        
                        
                        resolve(true)
                    } else {
                        reject({
                            message: "OTP is not verified.\nPlease verify OTP first to access the app.",
                            otp_verification: false
                        })
                    }
                }
                return

            }, error => {

                reject(error)
            })
        })
    }

}

export default new LoginService()