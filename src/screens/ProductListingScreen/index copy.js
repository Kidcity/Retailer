import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, BackHandler, Alert, Animated, Dimensions } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import FilterButton from '../../component/FilterButton';
import SortByButton from '../../component/SortByButton';
import { styles } from './style';
import Feather from 'react-native-vector-icons/Feather'
import { images, setWidth } from '../../utils/variable';
import GridViewItem from '../../component/GridViewItem';
import ListViewItem from '../../component/ListViewItem';
import FilterModal from '../../component/FilterModal'
import colors from '../../utils/colors';
import ProductListingService from '../../services/ProductListingService';
import { errorAlert, retryAlert, successToast } from '../../helper/ToastHelper';
import FullScreenLoader from '../../component/FullScreenLoader';
import { connect } from 'react-redux';
import { setLastScreenOffset, setLastStateAction, setProductListViewType } from '../../redux/actions/productListAction';
import { clearProductFilterAction, setProductFilterAction } from '../../redux/actions/commonAction';
import { setWishListCount } from '../../redux/actions/wishListAction';
import { Easing } from 'react-native-reanimated';
import { setScreenActivity } from '../../helper/AppActivityTrackingHelper'


const { width, height } = Dimensions.get("screen")

class ProductListingScreen extends Component {
    constructor(props) {
        super(props);
        this.param = this.props.route.params
        this.state = {
            city_id: '',
            redux_stored_list: [],
            list: [],
            isGridView: true,
            showFilter: false,
            totalFilterApplied: 0,
            showLoader: false,
            showBottomLoader: false,
            cust_manu_id: '',
            filter: {
                category: '',
                subCategory: '',
                season: '',
                brand: '',
                color: '',
                ageGroup: '',
                priceRange: '',
                city: '',
                sortPrice: 0,
                popularity: 1,
                whatsNew: 0,
                searchValue: '',
            },
            page: 1,
            isFiltered: false,
            noData: false,
            containerBottomPosition: new Animated.Value(-height),
            userSearchText: ""
        };
        this.flatListRef = React.createRef()
        this.last_screen_offset = 0
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        // console.log('cart props', JSON.stringify(this.props));
    }

    totalFilterApplied() {
        const filter = this.state.filter
        let total = 0
        let i = 0
        console.log('totalFilterApplied  ==> ', filter);
        if (filter.ageGroup && filter.ageGroup != '') {
            total += 1
        }
        if (filter.brand && filter.brand != '') {
            total += 1
        }
        if (filter.category && filter.category != '') {
            if (filter.category.includes(",")) {
                const count = filter.category.split(",").length
                total += count
            } else {
                total += 1
            }
        }
        if (filter.priceRange && filter.priceRange != '') {
            total += 1
        }
        if (filter.season && filter.season != '') {
            total += 1
        }
        if (filter.subCategory && filter.subCategory != '') {
            total += 1
        }
        this.setState({
            totalFilterApplied: total
        })
    }

    static getDerivedStateFromProps(props, state) {
        return {
            filter: props.filter ?? null,
            cust_manu_id: props.cust_manu_id,
        }
    }

    renderGridViewItem = ({ item, index }) => {
        return (
            <GridViewItem
                item={item}
                onPressProduct={() => {
                    setScreenActivity({ action_type: "product_details", action_id: item.id, city_id: this.state.city_id ?? "" })
                    this.props.navigation.navigate("ProductDetails", { product_id: item.id })
                }}
                onPressFavBtn={(value) => this._addToFavourite(value, item.id, index)}
            />
        )
    }

    renderListViewItem = ({ item, index }) => {
        return (
            <ListViewItem
                item={item}
                onPressProduct={() => {
                    setScreenActivity({ action_type: "product_details", action_id: item.id, city_id: this.state.city_id ?? "" })
                    this.props.navigation.navigate("ProductDetails", { product_id: item.id })
                }}
                onPressFavBtn={(value) => this._addToFavourite(value, item.id, index)}
            />
        )
    }

    _addToFavourite(flag, product_id, productIndex) {
        const param = {
            liked_products_id: product_id,
            liked_retailers_id: this.state.cust_manu_id,
            status: flag
        }

        ProductListingService._productLikeUnlikeService(param).then(response => {
            const product = this.state.list
            product[productIndex].isFavourite = flag
            this.setState({
                list: product
            })
            successToast("Added!", "Product added to wishlist")
            const total_wishlist_count = this.props.total_wishlist_count
            this.props.setWishListCount(parseInt(total_wishlist_count) + 1)
        }, error => {
            errorAlert("Error", error.message)
        })
    }

    async _getProductList(param = null) {
        // console.log('param ', this.state.filter);
        param = (param != null) ? param : this.state.filter

        param = { ...param, page: this.state.page, retailer_id: this.state.cust_manu_id }

        console.log('_getProductList param - >', param);

        if (this.state.page == 1) {
            this.setState({ showLoader: true, showFilter: false })
        }
        else {
            this.setState({ showBottomLoader: true, showFilter: false })
        }

        if (param.searchValue && param.searchValue !== '') {
            this.setState({
                userSearchText: param.searchValue
            })
        }

        ProductListingService._getProductListService(param).then(response => {

            let list = []

            if (!this.state.isFiltered) {
                list = [...this.state.list, ...response]
            } else if (this.state.isFiltered && this.state.page > 1) {
                list = [...this.state.list, ...response]
            }
            else {
                list = response
            }
            // this.flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
            this.setState({
                list: list,
                showLoader: false,
                showBottomLoader: false,
                isFiltered: false,
                noData: (response.length == 0) ? true : false,
                page: (response.length == 0) ? 1 : this.state.page
            }, () => {
                this.moveToUp()
            })
        }, error => {
            this.setState({ showLoader: false, showBottomLoader: false, isFiltered: false })
            if (error.message == "server_error") {
                retryAlert(() => this._getProductList())
            } else {
                errorAlert("Error", error.message)
            }
        })
    }

    async componentDidMount() {

        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            async () => {
                // alert(1)
                const filter = this.state.filter
                if (filter.city) {
                    this.setState({
                        city_id: filter.city
                    })
                }
                if (this.props.route.params) {

                    const deeplinkparam = this.props.route.params

                    const filter = { ...this.state.filter, brand: (deeplinkparam.brand && deeplinkparam.brand != 0) ? deeplinkparam.brand : '', category: deeplinkparam.category ?? "", subCategory: deeplinkparam.subCategory ?? "", city: (deeplinkparam.city && deeplinkparam.city != 0) ? deeplinkparam.city : "" }

                    if (deeplinkparam.city && deeplinkparam.city != 0) {
                        this.setState({
                            city_id: deeplinkparam.city
                        })
                    }
                    this.setState({
                        list: []
                    })
                    await this.props.setProductFilterAction(filter)
                    this._getProductList()
                    this.totalFilterApplied()

                } else {
                    if (this.props.productListReducer.laststate) {
                        if (this.props.productListReducer.laststate.list.length == 0) {
                            this._getProductList()
                            this.totalFilterApplied()

                        } else {
                            if (JSON.stringify(this.state.filter) !== JSON.stringify(this.props.productListReducer.laststate.filter)) {
                                this.setState({
                                    list: []
                                })
                                this._getProductList()
                                this.totalFilterApplied()

                            }
                            this.moveToUp()
                        }
                    } else {
                        this.setState({
                            list: [],
                            page: 1
                        })
                        this.totalFilterApplied()
                        this._getProductList()
                    }
                }
            }
        );
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.willBlurSubscription = this.props.navigation.addListener('blur', () => {
            // alert(1)
            this.setState({
                containerBottomPosition: new Animated.Value(-height)
            })
            this.props.setLastScreenOffset(this.last_screen_offset)
            this.props.setLastStateAction(this.state)
        })
    }

    componentWillUnmount() {
        this.willFocusSubscription()
        this.willBlurSubscription()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    _changeListView() {
        this.props.setProductListViewType(!this.state.isGridView)
        this.setState({ isGridView: !this.state.isGridView })
    }

    handleScroll = (event) => {
        this.last_screen_offset = event.nativeEvent.contentOffset.y
    }

    _searchProduct = () => {
        this.totalFilterApplied()
        this.setState({
            isFiltered: true,
            page: 1
        }, () => this._getProductList())
    }

    moveToUp() {
        Animated.timing(
            this.state.containerBottomPosition,
            {
                toValue: 0,
                duration: 900,
                easing: Easing.linear(),
                useNativeDriver: false
            },
        ).start()
    }

    handleBackButtonClick() {
        setScreenActivity({ action_type: "going_back", action_id: '', city_id: this.state.city_id ?? "" })

        if (!this.props.navigation.canGoBack()) {
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        } else {
            this.props.navigation.goBack();
        }
        return true;
    }

    render() {
        return (
            <View style={[styles.container]}>
                <Animated.View style={{ width: width, height: height, bottom: this.state.containerBottomPosition, }}>
                    <CustomHeader
                        userSearchText={this.state.userSearchText}
                        city_id={this.state.city_id}
                        showingThreeIcon={true}
                        showSearchIcon={true}
                        showCartIcon={true}
                        showFavouriteIcon={true}
                        showBackButton={true}

                        headingLogoStyle={{
                            marginLeft: setWidth(6)
                        }}

                        navigation={this.props.navigation}
                        shouldRedirectToSelfScreen={true}
                        onSearch={this._searchProduct}
                        onPressBack={() => this.handleBackButtonClick()}
                        onPressCartIcon={() => {
                            this.props.navigation.navigate("Cart")
                        }}
                    />
                    <View style={styles.content}>
                        <View style={[styles.row, styles.filterContainer]}>
                            <View style={styles.row}>
                                <FilterButton
                                    onPress={() => this.setState({ showFilter: true })}
                                    totalFilterApplied={this.state.totalFilterApplied}
                                />
                                <SortByButton
                                    onSelectSortItem={(isCancel) => {
                                        if (!isCancel) {
                                            this.setState({
                                                list: []
                                            })
                                            this._getProductList()
                                        }
                                    }}
                                />
                            </View>
                            <TouchableOpacity style={styles.gridbtn} onPress={() => this._changeListView()}>
                                <Feather name={this.state.isGridView ? 'grid' : 'list'} size={setWidth(6)} color={colors.dark_charcoal} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.listContainer}>
                            {
                                this.state.isGridView ?
                                    <FlatList
                                        ref={this.flatListRef}
                                        key={'#'}
                                        data={this.state.list}
                                        keyExtractor={(item, index) => '#' + index}
                                        renderItem={this.renderGridViewItem}
                                        numColumns={2}
                                        initialNumToRender={10}
                                        columnWrapperStyle={{
                                            justifyContent: 'space-between'
                                        }}
                                        contentContainerStyle={{
                                            paddingBottom: setWidth(10)
                                        }}
                                        onEndReachedThreshold={0.1}
                                        onEndReached={() => {
                                            if (!this.state.noData) {
                                                this.setState({
                                                    page: this.state.page + 1
                                                }, () => this._getProductList())
                                            }
                                        }}
                                        onScroll={this.handleScroll}
                                        scrollEventThrottle={16}
                                        ListFooterComponent={() => this.state.noData ?
                                            <Text style={styles.emptyMessageStyle}>No More Data</Text>
                                            :
                                            null
                                        }
                                    />
                                    :
                                    <FlatList
                                        ref={this.flatListRef}
                                        key={'_'}
                                        data={this.state.list}
                                        keyExtractor={(item, index) => '_' + index}
                                        renderItem={this.renderListViewItem}
                                        numColumns={1}
                                        initialNumToRender={10}
                                        onEndReachedThreshold={0.1}
                                        contentContainerStyle={{
                                            paddingBottom: setWidth(10)
                                        }}
                                        onEndReached={() => {
                                            if (!this.state.noData) {
                                                this.setState({
                                                    page: this.state.page + 1
                                                }, () => this._getProductList())
                                            }
                                        }}
                                        onScroll={this.handleScroll}
                                        scrollEventThrottle={16}
                                        ListFooterComponent={() => this.state.noData ?
                                            <Text style={styles.emptyMessageStyle}>No More Data</Text>
                                            :
                                            null
                                        }
                                    />
                            }
                            {
                                this.state.showBottomLoader &&
                                <ActivityIndicator animating={true} color={colors.primaryyellow} style={{ marginTop: setWidth(2), marginBottom: setWidth(2) }} />
                            }

                        </View>
                    </View>
                </Animated.View>
                {
                    this.state.showFilter &&
                    <FilterModal
                        isOpen={this.state.showFilter}
                        onClose={() => this.setState({ showFilter: false })}
                        onDone={async (totalFilterApplied) => {
                            //await this.props.clearProductFilterAction()
                            this.flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
                            this.setState({
                                showFilter: false,
                                totalFilterApplied: totalFilterApplied,
                                isFiltered: true,
                                page: 1
                            }, () => {
                                this._getProductList()
                            })
                        }}
                        onPageFilter={this.state.filter}
                    />
                }
                {
                    this.state.showLoader &&
                    <FullScreenLoader
                        isOpen={this.state.showLoader}
                    />
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        cust_manu_id: state.loginReducer.data.cust_manu_id,
        filter: state.commonReducer.filter,
        productListReducer: state.productListReducer,
        total_wishlist_count: state.wishListReducer.total_wishlist_count
    }
}
const mapDispatchToProps = dispatch => ({
    //clearLoginData: () => dispatch(clearLoginData())
    setProductListViewType: (data) => dispatch(setProductListViewType(data)),
    setLastScreenOffset: (data) => dispatch(setLastScreenOffset(data)),
    setLastStateAction: (data) => dispatch(setLastStateAction(data)),
    setProductFilterAction: (param) => dispatch(setProductFilterAction(param)),
    clearProductFilterAction: () => dispatch(clearProductFilterAction()),
    setWishListCount: (data) => dispatch(setWishListCount(data)),
})

const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(ProductListingScreen)
