import { StyleSheet, Dimensions, Platform } from "react-native";
import colors from "../../utils/colors";
import { fonts, setHeight, setWidth } from "../../utils/variable";
import { initialWindowMetrics } from "react-native-safe-area-context";

const {width, height} = Dimensions.get("screen")
const usableHeight = Platform.OS === 'ios' ? initialWindowMetrics.frame.height - initialWindowMetrics.insets.top - initialWindowMetrics.insets.bottom : initialWindowMetrics.frame.height
export const styles = StyleSheet.create({
    container:{        
        position: 'absolute',             
        backgroundColor: colors.white,
        height: height,
        zIndex: 9999,
    },
    header:{
        flexDirection: 'row',        
        paddingHorizontal: setWidth(4),
        paddingTop: setWidth(6),
        paddingBottom: setWidth(3),
        justifyContent:'space-between',
        borderBottomColor: colors.grey1,
        borderBottomWidth: setWidth(0.4),        
    },
    heading:{
        color: colors.dark_charcoal,
        fontFamily: fonts.fontBold,
        fontSize: setWidth(3.5)
    },
    clearFilterText:{
        color: colors.lightRed,
        fontFamily: fonts.fontBold,
        fontSize: setWidth(3.5)
    },
    content:{
        flex: 1,
        //flexDirection:'row',
    },
    leftFlexBox:{
        flex: 0.4,
        backgroundColor: colors.grey1
    },
    rightFlexBox:{
        flex: 0.6,
    },
    row:{
        flexDirection:'row',
    },
    leftItemContainer:{
        height: setHeight(6),
        justifyContent:'center',
        paddingLeft: setWidth(5),
        backgroundColor: colors.grey5,
        borderBottomColor: colors.grey3,
        borderBottomWidth: setWidth(0.3)
    },
    rightItemContainer:{
        height: setHeight(6),        
        paddingLeft: setWidth(5),
        flexDirection:'row',
        borderBottomColor: colors.grey3,
        borderBottomWidth: setWidth(0.2),
        justifyContent:'space-between',
        alignItems:'center'
    },
    itemTextBold:{
        color: colors.dark_charcoal,
        fontFamily: fonts.fontBold,
        fontSize: setWidth(3.4)
    },
    itemText:{
        color: colors.dark_charcoal,
        fontSize: setWidth(3.3),
        fontFamily: fonts.fontRegular
    },
    colorView:{
        width: setWidth(5),
        height: setWidth(5),
        borderRadius: setWidth(1.5),
    },
    footerBtnContainer:{
        //marginTop: 'auto',
        //height: setHeight(10),
        flexDirection:'row',
        paddingVertical: setWidth(3),
        paddingBottom: Platform.OS === 'ios' ? setHeight(3) : null,
        justifyContent:'space-around',
        alignItems:'center',
        borderColor: colors.grey5,
        borderWidth: setWidth(0.3)
    },
    footerBtn:{
        width: setWidth(40),
        height: setHeight(7),
        backgroundColor: colors.lightRed,
        borderRadius: setWidth(3),
        justifyContent:'center',
        alignItems:'center',
        borderColor: colors.lightRed,
        borderWidth:setWidth(0.2)
    },
    btnText:{
        color: colors.white,
        fontSize: setWidth(4),
        fontFamily: fonts.fontBold
    },
    searchBox:{
        height: setHeight(6),
        borderBottomColor: colors.grey5,
        borderBottomWidth: setWidth(0.3),
        flexDirection: 'row',
        alignItems:'center'
    },
    input:{
        flex: 1,
    }
})