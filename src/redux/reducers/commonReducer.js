import { SET_PRODUCT_FILTER, CLEAR_PRODUCT_FILTER, SET_PROPS, SET_AVAILCREDIT_MODAL, SET_WELCOME_MODAL } from "../types";

const initialState = {
    filter: {
        category: '',
        subCategory: '',
        season: '',
        brand: '',
        color: '',
        ageGroup: '',
        city: '',
        priceRange: '',
        sortPrice: 0,
        popularity: 0,
        whatsNew: 0,
        searchValue: '',
        page: 1
    },   
    openAvailCreditModal: false,
}

function commonReducer(state = initialState, action) {
    // console.log('commonReducer',action);
    switch (action.type) {

        case SET_PRODUCT_FILTER:
            return { ...state, filter: action.payload }

        case SET_AVAILCREDIT_MODAL:
            return { ...state, openAvailCreditModal: action.payload }

        case CLEAR_PRODUCT_FILTER:
            return initialState

        default:
            return state
    }
}

export default commonReducer