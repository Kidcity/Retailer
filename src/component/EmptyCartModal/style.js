import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";
import { fonts, setWidth } from "../../utils/variable";

const {width, height} = Dimensions.get("screen")

export const styles = StyleSheet.create({
    container:{
        height: '100%',
        width: '100%',
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 99
    },
    row: {
        flexDirection: 'row'
    },
    content:{
        width: setWidth(100-20),
        backgroundColor: colors.white,
        paddingVertical: setWidth(8),
        paddingHorizontal: setWidth(4),
        borderRadius: setWidth(3)
    },
    title: {
        fontFamily: fonts.fontRegular,
        fontSize: setWidth(4),
        textAlign:'center',
        color: colors.dark_charcoal
    },
    btn:{
        borderColor: colors.red,
        borderWidth: setWidth(0.3),
        paddingHorizontal: setWidth(6),
        paddingVertical: setWidth(3),
        borderRadius: setWidth(10),
        elevation: 8,
        overflow:'hidden',
        backgroundColor: colors.white
    },
    btnText:{
        fontFamily: fonts.fontRegular,
        color: colors.dark_charcoal
    }
})