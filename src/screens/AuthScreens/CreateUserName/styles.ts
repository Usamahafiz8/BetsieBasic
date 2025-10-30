import { StyleSheet } from 'react-native';

import { Colors } from '../../../constant/Colors';
import { Fonts } from '../../../constant/Fonts';
import tw from '../../../lib/tailwind';

export const signupEmailScreenStyles = StyleSheet.create({
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
    // color: Colors.gray900,
  },

  
  inputGroup: tw`mb-6 gap-4`,
  backToSignInText: tw`
    text-center 
    text-base 
    text-gray-600 
    mt-4 
  `,
  backToSignInLink: tw`
     font-bold
    underline
  `,
});