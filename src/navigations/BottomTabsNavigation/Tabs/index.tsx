
import Images from '../../../constant/Images';

export const Tabs = [
  {
    iconName: Images.mybets,
    activeIcon: Images.betsielogo,
    inactiveIcon: Images.mybets,
    router: 'MyBets',//screen name
    name: 'MyBet',
    isShow: true,
  },
  {
    iconName: Images.friendlist,
    activeIcon: Images.friendlist,
    inactiveIcon: Images.friendlist_inactive,
    router: 'AddFriend',
    isShow: true,
    name: 'Friends',
  },
 
  {
    iconName: Images.create_active,
    activeIcon: Images.create_active,
    inactiveIcon: Images.create_inactive,
    router: 'DefineBet',
    isShow: true,
    name: 'Create',
  },
  {
    iconName: Images.notification,
    activeIcon: Images.notification,
    inactiveIcon: Images.notification_inactive,
    router: 'NotificationScreen',
    isShow: true,
    name: 'Notification',
  },
  
  {
    iconName: Images.setting_active,
    activeIcon: Images.setting_active,
    inactiveIcon: Images.setting_inactive,
    router: 'Profile',
    isShow: true,
    name: 'Setting',
  },
  
];
