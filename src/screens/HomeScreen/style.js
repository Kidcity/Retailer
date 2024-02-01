import { StyleSheet, Dimensions, Platform } from "react-native";
import colors from "../../utils/colors";
import { normalize, setHeight, setWidth } from "../../utils/variable";
import { fonts } from "../../utils/variable";

const {width, height} = Dimensions.get("screen")

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    content: {
        flexGrow: 1,
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    alignCenter: {
        alignItems: 'center'
    },
    bannerContainer: {
        height: setHeight(48),        
    },    
    promoBannerContainer:{
        height: 130,
        // marginTop: setHeight(1),
    },
    heading: {
        textAlign: 'center',
        fontSize: setWidth(4.5),
        fontFamily: fonts.fontBold,
        color: colors.dark_charcoal,
        marginBottom: setWidth(5)
    },
    row: {
        flexDirection: 'row'
    },    
    
    benefitContainer: {
        marginTop: setHeight(3),
        marginHorizontal:setWidth(2),
    },
    benefitImageView:{
        height: setHeight(25),
        marginTop:  Platform.OS === "ios"? setHeight(3): setHeight(5),
    },
    benefitImage1: {
        //flex:1,
        width: setWidth(90),
        height: setHeight(20),
        alignSelf:'center',
        position: 'absolute',
        zIndex: 1,
        top: -45,
    },
    benefitImage2: {
        flex:1,
        width: '100%',
    },
    brandCityContainer:{
        marginTop: setHeight(8),
        marginHorizontal: setWidth(2)
    },
    applyCreditView:{
        marginTop: setHeight(2),
        marginHorizontal: setWidth(4),
        borderRadius: setWidth(5),
        overflow: 'hidden'
    },
    applyCreditimage:{
        width: '100%',
        height: setWidth(50),
        overflow: 'hidden',
        borderRadius: setWidth(5)
    }, 
   
    
    footer:{
        marginTop: setWidth(10),
        //paddingTop: setWidth(4),
        paddingBottom: setWidth(15),
        marginHorizontal: setWidth(2),
    },
    footerText:{
        fontSize: setWidth(6),
        fontFamily: fonts.fontBold,
        color: colors.grey3
    },
    
    dashedBorder:{
        borderStyle: 'dashed',
        borderBottomColor: colors.grey3,
        borderBottomWidth: setWidth(0.5),
        marginTop: setWidth(10)
    },
    
})