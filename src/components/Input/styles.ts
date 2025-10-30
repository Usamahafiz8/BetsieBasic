
import { StyleSheet } from 'react-native';

import { Colors } from '../../constant/Colors';
import tw from '../../lib/tailwind';

export const inputStyles = StyleSheet.create({
  container: tw`w-full mb-6`,
  inputWrapper: tw`
    w-full
    rounded-lg
    bg-white
    relative
  `,
  animatedLabel: {
    position: 'absolute',
    left: 12,
    zIndex: 10,
    paddingHorizontal: 4,
    backgroundColor: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    // color: Colors.gray500,
  },
  icon: tw`w-6 h-6 text-gray-400`,
  textInput: tw`
    flex-1
    text-base
    text-gray-900
    h-8
    py-0
    pr-2
    pl-4 // Adjust padding to avoid icon overlap
  `,
  // These styles create the partial gradient border
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  leftBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
