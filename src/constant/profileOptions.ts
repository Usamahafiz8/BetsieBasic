import Images from "./Images";


export const profileOptions = [
  { label: 'Your Account', icon: Images.account, route: 'AccountDetail' },
  { label: 'Support / Contact Us', icon: Images.support, route: 'Support' },
  { label: 'Terms & Conditions', icon: Images.tnc, route: 'Terms' },
  { label: 'Privacy Policy', icon: Images.privacy, route: 'Privacy' },
  { label: 'Log Out', icon: Images.logout, route: 'Logout', hasBorder: false },
];