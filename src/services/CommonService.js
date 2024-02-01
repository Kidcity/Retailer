import Base from './Base.service'
import { GET_SUGGESTION_SLUG } from './Slug'

class CommonService extends Base{

    _getSuggestionsService(param){
        return new Promise((resolve, reject) => {
            this.post(GET_SUGGESTION_SLUG, param).then(response => {               
                
                const data = response?.data?.data?.data
                console.log(JSON.stringify(response?.data?.data));                                
                resolve({
                    data: (data !== "") ? data : null
                })
            }, error => {
                reject(error)
            })
        })
    }
    
    
}

export default new CommonService()