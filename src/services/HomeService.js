import Base from './Base.service'
import { AVAILABLE_BRANDS_SLUG, COLORS_SLUG, GET_APP_VERSION, GET_BANNERS, GET_CITIES, GET_SUGGESTION_SLUG, ICONIC_BRAND_SLUG, MAIN_CATEGORIES_SLUG, SHOP_IN_SHOP_SLUG, STORE_DEVICE_TOKEN, SYNC_CUSTOMER, TRACK_APP, } from './Slug'
import { store } from '../redux/store'
import { availableBrandsAction, mainCategoriesAction, setBannersAction, setColorsAction, setIconicBrandAction, setPromosAction, setShopINshopBrandAction, storeCitiesAction } from '../redux/actions/homeAction'
import { Animated } from 'react-native'
const config = require("../../config/kidcity.config")

class HomeService extends Base {

    _getAppVersion() {
        return new Promise((resolve, reject) => {
            this.post(GET_APP_VERSION).then(response => {
                resolve(response)
            }, error => {
                reject(error)
            })
        })
    }

    _saveTrackingDataService(param) {
        return new Promise((resolve, reject) => {
            this.post(TRACK_APP, param).then(response => {
                resolve(response)
            }, error => {
                reject(error)
            })
        })
    }

    _getCategoriesService(param) {
        return new Promise((resolve, reject) => {
            this.post(MAIN_CATEGORIES_SLUG, param).then(response => {
                const data = response.data.data
                let categories = []
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    categories.push({
                        id: element.id,
                        image: element.image,
                        title: element.name
                    })
                }
                // console.log(categories);
                store.dispatch(mainCategoriesAction(categories))
                resolve(categories)
            }, error => {
                reject(error)
            })
        })
    }

    _availableBrandService(param) {
        // console.log('_availableBrandService');
        return new Promise((resolve, reject) => {
            this.post(AVAILABLE_BRANDS_SLUG, param).then(response => {

                if (response?.data?.data) {
                    const allbrands = response.data.data

                    // console.log(JSON.stringify(allbrands));
                    let location_brands = []

                    for (let index = 0; index < allbrands.length; index++) {
                        const element = allbrands[index];
                        let brands = []

                        if (element.brands.length > 0) {
                            brands = [...element.brands, {
                                brand_name: "view_more",
                                city_id: element.city_id,
                                city_name: element.city_name
                            }]
                        }

                        location_brands.push({
                            location: element.city_name,
                            brands: brands
                        })

                    }

                    // console.log("final ==> ",JSON.stringify(location_brands));

                    store.dispatch(availableBrandsAction(location_brands))
                    resolve(true)
                } else {
                    reject({
                        message: "No available brands found."
                    })
                }
            }, error => {
                reject(error)
            })
        })
    }

    _getColorsService() {
        return new Promise((resolve, reject) => {
            this.post(COLORS_SLUG).then(response => {
                if (response.data) {
                    const data = response.data.data.data
                    store.dispatch(setColorsAction(data))
                    resolve(true)
                }

            }, error => {
                reject(error)
            })
        })
    }

    _getSuggestionService(param) {

        return new Promise((resolve, reject) => {
            this.post(GET_SUGGESTION_SLUG, param).then(response => {

                const data = response.data.data.data
                //console.log('data sugg  =====>  ', data);
                resolve(data)
            }, error => {
                reject(error)
            })
        })
    }

    _syncCustomerToUniwareService(userid) {
        const url = config.serviceUrl + SYNC_CUSTOMER + userid
        return new Promise((resolve, reject) => {
            this.get(url).then(response => {
                // console.log(response);
            }, error => {
                reject(error)
            })
        })
    }

    _shopINshopBrandService(param) {
        return new Promise((resolve, reject) => {
            this.post(SHOP_IN_SHOP_SLUG, param).then(response => {
                // console.log("_shopINshopBrandService  ==> ",response.data.data);
                if (response?.data?.data?.data) {
                    const data = response.data.data.data

                    let final_array = []

                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        final_array.push({
                            ...element,
                            poster: element.image,
                            isPlaying: false,
                            xyAxis: new Animated.ValueXY({ x: -40, y: -50 }),
                            opacity: new Animated.Value(1)
                        })
                        if (index === data.length - 1) {
                            final_array.push({
                                show_more: true
                            })
                        }
                    }

                    store.dispatch(setShopINshopBrandAction(final_array))

                } else {
                    reject({
                        message: "Something went wrong."
                    })
                }

            }, error => {
                reject(error)
            })
        })
    }

    _AllshopINshopBrandService() {
        return new Promise((resolve, reject) => {
            this.post(SHOP_IN_SHOP_SLUG).then(response => {

                if (response?.data?.data?.data) {
                    const data = response?.data?.data?.data
                   
                    let final_array = []

                    if (data.length > 0) {
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            final_array.push({
                                ...element,
                            })
                        }
                    }

                    resolve({
                        data: final_array
                    })
                } else {
                    reject({
                        message: "Something went wrong."
                    })
                }

            }, error => {
                reject(error)
            })
        })
    }

    _IconicBrandService() {
        return new Promise((resolve, reject) => {
            this.post(ICONIC_BRAND_SLUG).then(response => {

                if (response?.data?.data?.data) {
                    const data = response.data.data.data

                    let iconic_final_array = []

                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        iconic_final_array.push({
                            ...element,
                            poster: element.image,
                            isPlaying: false,
                            xyAxis: new Animated.ValueXY({ x: -40, y: -50 }),
                            opacity: new Animated.Value(1)
                        })
                        if (index === data.length - 1) {
                            iconic_final_array.push({
                                show_more: true
                            })
                        }
                    }

                    store.dispatch(setIconicBrandAction(iconic_final_array))

                } else {
                    reject({
                        message: "Something went wrong."
                    })
                }

            }, error => {
                reject(error)
            })
        })
    }

    _getCitiesService() {
        return new Promise((resolve, reject) => {
            this.post(GET_CITIES).then(response => {
                if (response.data.data.data) {

                    if (response.data.data) {
                        const data = response.data.data.data
                        if (data.length > 0) {
                            data.map((item, index) => {

                                if (item.city_name == 'Kolkata') {
                                    item.isActive = true
                                }
                                else {
                                    item.isActive = false
                                }
                            })
                        }
                        store.dispatch(storeCitiesAction(data))
                        resolve(true)
                    } else {
                        reject({
                            message: "Something went wrong in cities API."
                        })
                    }


                } else {
                    reject({ success: false, message: "No cities found" })
                }
                //resolve(data)
            }, error => {
                reject(error)
            })
        })
    }

    _getBannerService(param) {
        // console.log('_getBannerService ==> ', param);

        return new Promise((resolve, reject) => {
            this.post(GET_BANNERS, param).then(response => {
                if (response.data.data.data) {
                    const data = response.data.data.data

                    if (data.banners.length > 0 || data.promos.length > 0) {
                        const banners = data.banners
                        const promos = data.promos
                        const credit_banner = data.credit_banner

                        let banners_final_array = Object.assign({})
                        let iconic_final_array = Object.assign([])
                        let promo_final_array = Object.assign({})



                        for (let index = 0; index < banners.length; index++) {
                            const element = banners[index];

                            let section_string = (element.banner_section == "HEADER") ? element.banner_section : (element.banner_section == "SECTION 1") ? "SECTION_1" : (element.banner_section == "SECTION 2") ? "SECTION_2" : '' // header
                            let obj = {
                                [section_string]: {
                                    banner_section: element.banner_section ? element.banner_section : '',
                                    banner_section_id: element.banner_section_id ? element.banner_section_id : '',
                                    banner_details: element.banner_details ? element.banner_details : []
                                }
                            }
                            banners_final_array = { ...banners_final_array, ...obj }
                        }

                        if (promos.length > 0) {
                            promo_final_array = {
                                banner_section: promos.banner_section ?? "",
                                banner_section_id: promos.banner_section_id ?? "",
                                banner_details: promos.banner_details ?? []
                                // banner_details: [{
                                //     image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/women%27s-day-discount-coupon-banner-advertisem-design-template-82df7cf5db7c9851f8c0d56f38b8ff89_screen.jpg?ts=1614163052"
                                // },
                                // {
                                //     image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/women%27s-day-discount-coupon-banner-advertisem-design-template-82df7cf5db7c9851f8c0d56f38b8ff89_screen.jpg?ts=1614163052"
                                // }]
                            }
                        }

                        // console.log(JSON.stringify(banners_final_array));

                        store.dispatch(setBannersAction(banners_final_array))
                        store.dispatch(setPromosAction(promo_final_array))
                        resolve({ status: true, credit_banner: credit_banner ?? "" })
                    } else {
                        resolve(true)
                    }
                } else {
                    reject({ message: "Something went wrong" })
                }
            }, error => {
                reject(error)
            })
        })
    }

    _storeDeviceToken(param) {
        return new Promise((resolve, reject) => {
            this.post(STORE_DEVICE_TOKEN, param).then(response => {

                const data = response.data.data
                if (data.status) {
                    resolve(true)
                } else {
                    reject(false)
                }
            }, error => {
                reject(error)
            })
        })
    }

}

export default new HomeService()