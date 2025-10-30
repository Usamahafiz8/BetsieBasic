// import * as Keychain from 'react-native-keychain';
// import { io, Socket } from 'socket.io-client';

// import { baseUrl } from '../api/baseUrl';

// let socket: Socket | null = null;

// export async function connectSocket(): Promise<Socket> {
//   //Retrieve the credentials
//   const token = await Keychain.getGenericPassword({
//     service: 'service_key',
//   });

//   if (!token) {
//     console.log('No credentials stored');
//     throw new Error('no token found. User must login first');
//   }

//   if (!socket) {
//     socket = io(baseUrl, {
//       auth: token,
//     });
//     //wait for connection

//     await new Promise(resolve => {
//       socket?.on('connect', () => {
//         console.log('Socket connected', socket?.id);
//         resolve(true);
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log('socket disconnected');
//     });
//   }
//   return socket;
// }

// export function getSocket(): Socket | null {
//   return socket;
// }

// export function disconnectSocket(): void {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }
