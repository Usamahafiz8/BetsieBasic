declare module 'react-native-push-notification' {
  export interface PushNotificationObject {
    channelId?: string;
    id?: string | number;
    title?: string;
    message: string;
    playSound?: boolean;
    soundName?: string;
    smallIcon?: string;
    [key: string]: any; // fallback for extra props
  }

  export interface PushNotificationChannelObject {
    channelId: string;
    channelName: string;
    channelDescription?: string;
    soundName?: string;
    importance?: number;
    vibrate?: boolean;
  }

  export interface PushNotificationOptions {
    onNotification?: (notification: any) => void;
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  export default class PushNotification {
    static configure(options: PushNotificationOptions): void;
    static createChannel(
      channel: PushNotificationChannelObject,
      callback: (created: boolean) => void
    ): void;
    static localNotification(notification: PushNotificationObject): void;
  }
}
