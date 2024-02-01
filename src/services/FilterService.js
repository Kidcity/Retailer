import Base from './Base.service'
import { FILTER_SLUG } from './Slug'

class FilterService extends Base {

    _getFilterDataService(param, onPageFilter) {
        // console.log(onPageFilter);

        return new Promise((resolve, reject) => {
            this.post(FILTER_SLUG, param).then(response => {

                // console.log(JSON.stringify(response));
                if (response?.data?.data) {

                    const categories = response?.data?.data?.categories
                    const preselected_categories = (onPageFilter?.subCategory && onPageFilter?.subCategory != '') ? onPageFilter.subCategory.split(",")  : ''

                    let categories_list = []

                    if (categories && categories.length > 0) {
                        for (let index = 0; index < categories.length; index++) {
                            const element = categories[index];

                            categories_list.push({
                                id: element.id,
                                subtitle: element.name,
                                isActive: (preselected_categories != '') && (preselected_categories.includes(element.id.toString())) ? true : false
                                //(preselected_categories == element.id) ? true : false,
                            })
                        }
                    }

                    // console.log('categories_list  ==> ',categories_list);

                    const brands = response?.data?.data?.brands
                    const preselected_brand = (onPageFilter.brand && onPageFilter.brand != '') ? onPageFilter.brand.split(",") : ''
                    
                    let brands_list = []
                    if (brands && brands.length > 0) {
                        for (let index = 0; index < brands.length; index++) {
                            const element = brands[index];
                            brands_list.push({
                                id: element.id,
                                subtitle: element.name,
                                isActive: (preselected_brand.includes(element.id.toString())) ? true : false,
                            })
                        }
                    }
                    
                    resolve({
                        categories: categories_list,
                        brands: brands_list
                    })
                }else{
                    reject(false)
                }

            }, error => {
                reject(error)
            })
        })
    }
}
export default new FilterService()