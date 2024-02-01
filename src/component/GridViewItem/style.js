import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";
import { fonts, setHeight, setWidth } from "../../utils/variable";

const width = Dimensions.get("screen").width

export const styles = StyleSheet.create({
    container: {
        borderRadius: setWidth(2),
        overflow: 'hidden',
        marginTop: setWidth(2),
        width: (width / 2 - setWidth(3)),
        borderColor: colors.grey5,
        borderWidth: setWidth(0.3)
    },
    favBtn: {
        backgroundColor: colors.white,
        position: 'absolute',
        right: 10,
        top: 5,
        padding: setWidth(1),
        borderRadius: setWidth(5),
        elevation: 8,
        shadowColor: colors.grey2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 1,
    },
    itemsLeftContainer: {
        position: 'absolute',
        bottom: 10,
        right: 0,
        backgroundColor: colors.lightRed,
        paddingHorizontal: setWidth(5),
        paddingVertical: setWidth(1),
        borderTopLeftRadius: setWidth(1.2),
        borderBottomLeftRadius: setWidth(1.2)
    },
    productImage: {
        flex: 1,
        width: '100%',
        // width: (width / 2 - 13),
        height: setHeight(35), 
    },
    row: {
        flexDirection: 'row'
    },
    justifyBetween: {
        justifyContent: 'space-between'
    },
    justifyEnd: {
        justifyContent: 'flex-end'
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    alignItemEnd: {
        alignItems: 'flex-end'
    },  
    text: {
        flexWrap: 'wrap',
        fontSize: setWidth(3),
        color: colors.grey2,
        fontFamily: fonts.fontBold,
        flexShrink: 1,
    },
    largeBoldFont: {
        fontSize: setWidth(4),
        fontFamily: fonts.fontBold,
        color: colors.dark_charcoal
    },
    strikThroughFont: {
        textDecorationLine: 'line-through',
        color: colors.lightRed
    },
    subHeading: {
        color: colors.grey3,
        fontFamily: fonts.fontBold
    },
    mainblock:{
        // height: setHeight(10),
        // backgroundColor: 'pink',   
        paddingHorizontal: setWidth(3),     
        paddingVertical: setHeight(1),
        borderBottomColor: colors.grey5, 
        borderBottomWidth: setWidth(0.3),
    },
    block:{
        height: setHeight(5),
        // backgroundColor:'pink',
        justifyContent:'center',
        paddingHorizontal: setWidth(3), 
        borderBottomColor: colors.grey5, 
        borderBottomWidth: setWidth(0.3),
    },
    rightBorder:{
        borderRightColor: colors.grey5,
        borderRightWidth: setWidth(0.3),
    },
    leftBorder:{
        borderLeftColor: colors.grey5,
        borderLeftWidth: setWidth(0.3),
    },
    movView:{
        backgroundColor: colors.primaryyellow,
        paddingVertical: setHeight(1)
    },
    movText:{
        flexWrap: 'wrap',
        fontSize: setWidth(3),
        color: colors.white,
        fontFamily: fonts.fontBold,
        textAlign: 'center',
        flexShrink: 1,
    }
})