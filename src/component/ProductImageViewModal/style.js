import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";
import { setHeight, setWidth } from "../../utils/variable";

const {width , height} = Dimensions.get("screen")

export const styles = StyleSheet.create({
    contianer:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: width,
        height: height,
        backgroundColor: colors.white
    },
    closeBtn:{        
        alignSelf:'flex-end',
        padding: setWidth(3)
    },
    content: {
        flex: 1,        
    },
    leftArrow:{
        position: 'absolute',
        top: -(height / 2)
    },
    rightArrow:{
        position: 'absolute',
        top: -((height) / 2),
        right: 0
    }
})