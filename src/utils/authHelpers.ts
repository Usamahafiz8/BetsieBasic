import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import {
//   AccessToken,
//   LoginManager,
//   Profile,
//   Settings,
// } from 'react-native-fbsdk-next';

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo.data;
  } catch (error) {
    console.log('Google Sign-In error:', error);
    throw error;
  }
};

// export const facebookSignIn = async () => {
//   try {
//     const result = await LoginManager.logInWithPermissions([
//       'public_profile',
//       'email',
//     ]);
//     if (result.isCancelled) throw 'User cancelled Facebook login';

//     const data = await AccessToken.getCurrentAccessToken();
//     if (!data) throw 'Failed to get Facebook access token';

//     const profile = await Profile.getCurrentProfile();
//     console.log('🚀 ~ signInWithFacebook ~ profile:', profile);
//     return {
//       token: data.accessToken.toString(),
//       profile,
//     };
//   } catch (error) {
//     console.error('Facebook Sign-In error:', error);
//     throw error;
//   }
// };
