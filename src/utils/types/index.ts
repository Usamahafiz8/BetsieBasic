import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  AccountCreation: undefined;
  // CreateUserName: undefined;
  CreateUserName: { email: string; id?: string }; // 👈 added id
  SignupEmail: undefined;
  ResetPassword: undefined;
  CheckEmail: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  ForgotPasswordScreen: undefined;
  ChangePassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MyBetsScreen: undefined;
  CreateBet: undefined;
  profile: undefined;
  AccountDetail: undefined;
  ChangeUsername: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  UpdateSuccess: { title: string; subTitle: string; icon?: any };
  AddFriend: undefined;
  BetDetail: { betId: string };
  BetsResolve: undefined;
  ChooseDecisionMethod: undefined;
  DefineBet: undefined;
  ExecuteBetResolution: undefined;
  Winning: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  HomeStack: undefined;
  

};

export type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, 'SplashScreen'>;
export type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignInScreen'>;
export type AccountCreationProps = NativeStackScreenProps<AuthStackParamList, 'AccountCreation'>;
export type CreateUserNameProps = NativeStackScreenProps<AuthStackParamList, 'CreateUserName'>;

export type SignupEmailProps = NativeStackScreenProps<AuthStackParamList, 'SignupEmail'>;
export type ResetPasswordProps = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;
export type CheckEmailProps = NativeStackScreenProps<AuthStackParamList, 'CheckEmail'>;


export type TermsOfServiceProps = NativeStackScreenProps<AuthStackParamList, 'TermsOfService'>;
export type PrivacyPolicyPropss = NativeStackScreenProps<AuthStackParamList, 'PrivacyPolicy'>;
export type ForgotPasswordScreenpropss = NativeStackScreenProps<AuthStackParamList, 'ForgotPasswordScreen'>;
export type ChangePasswordprops = NativeStackScreenProps<AuthStackParamList, 'ChangePassword'>;



export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
export type MyBetsScreenprops = NativeStackScreenProps<HomeStackParamList, 'MyBetsScreen'>;
export type CreateBetprops = NativeStackScreenProps<HomeStackParamList, 'CreateBet'>;
export type AddFriendScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddFriend'>;
export type BetDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'BetDetail'>;
export type ChooseDecisionMethodPros = NativeStackScreenProps<HomeStackParamList, 'ChooseDecisionMethod'>;
export type DefineBetProps = NativeStackScreenProps<HomeStackParamList, 'DefineBet'>;
export type ExecuteBetResolutionScreenProps = NativeStackScreenProps<HomeStackParamList, 'ExecuteBetResolution'>;
export type WinningScreenProps = NativeStackScreenProps<HomeStackParamList, 'Winning'>;
export type BetsResolveProps = NativeStackNavigationProp<HomeStackParamList, "BetsResolve">;


type ProfileStackParamList = {
  ChangeUsername: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  BetHistory: undefined;
  FriendList: undefined;
};
export type AccountNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;