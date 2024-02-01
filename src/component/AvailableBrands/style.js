import { StyleSheet } from "react-native";
import colors from "../../utils/colors";
import { fonts, setHeight, setWidth } from "../../utils/variable";

export const styles = StyleSheet.create({
    container: {
        marginTop: setWidth(2),
    },
    brandView: {
        // height: 180,
        width: setWidth(100),
        overflow: 'visible',
        paddingLeft: setWidth(2),
        borderColor: colors.dark_charcoal,
    },
    heading: {
        fontFamily: fonts.fontBold,
        fontSize: setWidth(5),
        color: colors.black,
    },
    animatedTextStyle: {
        fontSize: setWidth(4.5),
        fontFamily: fonts.fontBold,
        color: colors.black,
        textAlign:'center'
    },
    animatedTextContainerStyle: {      
        alignItems:'center',
        paddingVertical: setHeight(0.6)
    },
    headingView:{
        paddingVertical: setHeight(1.6),
        paddingLeft: setWidth(2),
        backgroundColor: colors.primaryyellow,
        borderRadius: setWidth(2),
        marginHorizontal: setWidth(2)
    }

})