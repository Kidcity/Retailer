import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";
import { setHeight, setWidth } from "../../utils/variable";

const {width, height} = Dimensions.get("screen")

export const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        width: width,
        height: height,
        backgroundColor: colors.white,
        // justifyContent:'center',
    },
    image:{
        // backgroundColor: 'red',
        width: setWidth(50),
        height: setHeight(50)
    },
    lottiView: {
        position: 'relative',
        height: setHeight(100),
        // width: setWidth(50),
        alignSelf: 'center',
        // backgroundColor:'red'
    },
})