import Base from './Base.service'
import { ORDER_LIST_SLUG } from './Slug'
import { store } from '../redux/store'
import { storeOrderListAction } from '../redux/actions/orderListAction'
import { order_status } from '../utils/variable'
import moment from 'moment'

class OrderListService extends Base {

    populatedata(data) {
        // console.log(data);
        return new Promise((resolve, reject) => {
            let list = []
            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                // calculation on order date
                var order_date = moment(element.order_date, "YYYY-MM-DD").format("DD MMM YYYY")

                // calculation on expected delivery date
                var exp_date = moment(element.order_date, "DD-MM-YYYY").add(10, 'days');
                // var exp_date = moment(element.order_date, "YYYY-MM-DD").format("DD-MM-YYYY");
                // exp_date = moment(exp_date, "DD-MM-YYYY").add(10, 'days')
                exp_date = moment(exp_date).format("DD MMM YYYY")

                // calculation of return expire date
                let return_expire_date = moment(element.delivery_date, "DD-MM-YYYY").add(parseInt(element.return_period), 'days')
                return_expire_date = moment(return_expire_date).format("DD MMM YYYY")

                // calculation is return policy applicable for today               
                let today = moment(new Date()).format("DD MMM YYYY")
                let isReturnApplicable = ! moment(today).isAfter(return_expire_date, 'day')
                if(element.return_request_reference_id && element.return_request_reference_id != ''){
                    //isReturnApplicable = false
                }

                list.push({
                    id: element.orders_id,
                    image: element.product_image,
                    order_no: element.order_no,
                    sets: element.set,
                    // order_placed_on: order_date,
                    order_placed_on: moment(element.order_date, "DD-MM-YYYY").format("DD MMM YYYY"),
                    expected_delivery: exp_date,
                    total: element.order_value_inc_tax,
                    orders_status_id: element.orders_status_id,
                    order_status: element.order_status,
                    delivery_date: moment(element.delivery_date,"DD-MM-YYYY").format("DD MMM YYYY"),
                    return_period: element.return_period,
                    return_expire_date: return_expire_date,
                    isReturnApplicable: isReturnApplicable,
                    return_request_reference_id: element.return_request_reference_id ? element.return_request_reference_id : '',
                    return_request_status_id: element.return_request_status_id ? element.return_request_status_id : '',
                    return_request_status: element.return_request_status ? element.return_request_status : '',
                    return_requested_date: element.return_requested_date ? moment(element.return_requested_date).format("DD MMM YYYY") : ''                   
                })
            }
            //console.log(list);
            resolve(list)
        })
    }

    _getOrdersService(param) {

        return new Promise((resolve, reject) => {
            this.post(ORDER_LIST_SLUG, param).then(async response => {
                //console.log(response);
                if (response.data.data.success == false) {
                    reject({ message: "No orders available" })
                    return
                }
                const data = response.data.data.data
                const pop_data = await this.populatedata(data)
                store.dispatch(storeOrderListAction(pop_data))
                resolve({ success: true })
            }, error => {
                reject(error)
            })
        })
    }
}
export default new OrderListService()