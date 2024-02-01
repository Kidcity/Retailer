import Base from './Base.service'
import { OTP_VALIDATE_SLUG } from './Slug'


class OTPVerificationService extends Base {

    _OTPvalidate(param){
        return new Promise((resolve, reject) => {
            this.post(OTP_VALIDATE_SLUG, param).then(response => {                            
                resolve(response)            
            }, error => {                               
                reject(error)
            })
        })
    }
}

export default new OTPVerificationService()