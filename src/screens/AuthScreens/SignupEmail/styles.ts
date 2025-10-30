import { StyleSheet } from 'react-native';
import { Colors } from '../../../constant/Colors';
import { Fonts } from '../../../constant/Fonts';
import tw from '../../../lib/tailwind';
export const styles = StyleSheet.create({
  container: tw`flex-1 bg-white`,
  contentWrapper: tw`
    flex-1
    px-6
    pt-8
  `,
  title: {
    fontFamily: Fonts.FunnelRegular,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  inputGroup: tw`mb-6 gap-4`,
  backToSignInText: tw`
    text-center 
    text-base 
    text-gray-600 
    mt-4 
  `,
  backToSignInLink: tw`
    underline
    text-center
     px-3 
     py-1 
     text-black 
     font-semibold rounded-lg
    
  `,
  checkcontainer: tw`flex-row mt-2 items-center`,
  termscheckbox: tw`text-black text-xs flex-wrap mt-2 items-center`,
  checktext: tw`items-center text-black font-bold underline`,
  privecytext: tw`items-center mt-2`,
  textstyling: tw`text-black text-xs font-bold underline`



});