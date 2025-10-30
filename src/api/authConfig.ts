import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { Settings } from "react-native-fbsdk-next";

export const initFacebookSDK = () => {
  // Settings.initializeSDK();
};

export const initGoogleSignin = () => {
  GoogleSignin.configure({
    webClientId: "875954896141-8n7lkuc1mplg1rn3ih1p86numbqj4g5e.apps.googleusercontent.com",
     // androidClientId:
      //   '875954896141-d47ep6oaaq09psipe8n8j0oc0dseeaco.apps.googleusercontent.com',
      iosClientId:
        '875954896141-8sju6m8kvtqf4njc4456ujp1hpam6l0s.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    offlineAccess: true,
  });
};
