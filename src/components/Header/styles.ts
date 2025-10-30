// import { StyleSheet } from 'react-native';
// import tw from 'twrnc';
// import { Fonts } from '../../constants/Fonts';
// import { Colors } from '../../constants/Colors';

// export const headerStyles = StyleSheet.create({
//   container: tw`w-full h-72 border-b border-gray-200`,

//   contentWrapper: tw`flex-row justify-between items-center px-4 pt-16`,

//   logoContainer: tw`flex-row items-center`,
//   logoIcon: tw`w-10 h-10 mr-2`,

//   logoText: {
//     fontFamily: Fonts.Funnelsemibold,
//     fontSize: 42.85,
//     fontWeight: '600',
//     letterSpacing: 0.08 * 62.85, // ~5px
//     color: Colors.darkStorke,
//   },

//   signInButton: tw`w-[100px] h-[40px] rounded-full overflow-hidden`,
//   signInButtonGradient: tw`flex-1 items-center justify-center`,
//   signInButtonText: tw`text-white font-semibold text-base`,
// });



import { StyleSheet } from 'react-native';

import { Colors } from '../../constant/Colors';
import { Fonts } from '../../constant/Fonts';
import tw from '../../lib/tailwind';

export const headerStyles = StyleSheet.create({
  container: tw`w-full h-72 border border-bordeers`,
  contentWrapper: tw`flex-row justify-between items-center px-4 pt-16`,
  
  backButton: tw`absolute top-1/2 left-4 -mt-4 p-2 rounded-full`,
  backIcon: tw`w-6 h-6`,
  
  logoContainer: tw`flex-row items-center`,
  logoIcon: tw`w-8 h-8 mr-2`,
  logoText: {
    fontFamily: Fonts.Funnelsemibold,
    fontSize: 42.85,
    fontWeight: '600',
    letterSpacing: 0.08 * 62.85,
    color: Colors.darkStorke,
  },
  signInButton: tw`w-[100px] h-[40px] rounded-[24px] overflow-hidden`,
  signInButtonGradient: tw`flex-1 items-center justify-center`,
  signInButtonText: tw`text-white font-semibold text-base`,
});