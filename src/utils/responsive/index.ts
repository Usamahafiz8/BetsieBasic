import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const responsive = {
  // width & height
  wp,
  hp,

  // font sizes
  font: {
    small: wp("3.5%"),   // small text
    medium: wp("4.2%"),  // default
    large: wp("5%"),     // bigger
    xlarge: wp("6%"),    // headings
  },

  // spacing
  spacing: {
    s: wp("2%"),
    m: wp("4%"),
    l: wp("6%"),
  },

  // radius
  radius: {
    small: wp("2%"),
    medium: wp("3%"),
    large: wp("5%"),
  },
};
