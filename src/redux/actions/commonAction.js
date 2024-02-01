import { SET_PRODUCT_FILTER,CLEAR_PRODUCT_FILTER, SET_PROPS, SET_AVAILCREDIT_MODAL, SET_WELCOME_MODAL } from "../types";


export const setProductFilterAction = data => {    
    return {
        type: SET_PRODUCT_FILTER,
        payload: data
    }
}


export const setOpenAvailCreditModalAction = data => { 
    return {
        type: SET_AVAILCREDIT_MODAL,
        payload: data
    }
}

export const clearProductFilterAction = data => {
    return {
        type: CLEAR_PRODUCT_FILTER,
    }
}
