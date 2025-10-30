import { baseUrl } from "../baseUrl";
import { Endpoint } from "../types";

export const END_POINTS: Record<string, Endpoint> = {


GET_NOTIFICATIONS: {
  method: "GET",
  url: `${baseUrl}/notifications`,
},


  GET_ALL_USERS: {
    method: "GET",
    url: `${{baseUrl}}/users`,
  },

  GET_USER_BY_ID: {
  method: "GET",
  url: `${baseUrl}/users/:id`, // :id will be replaced dynamically
},

  REFRESHTOKEN: {
    method: "POST",
    url: `${baseUrl}/users/refresh-token`,
  },

  LOGIN: {
    method: "POST",
    url: `${baseUrl}/users/login`, 
  },

  GOOGLE_LOGIN: {
    method: "POST",
    url: `${baseUrl}/users/google-login`,
  },

  REGISTER: {
    method: "POST",
    url: `${baseUrl}/users/register`,    
  },

 PLAYERNAME: {
    method: "PATCH",
    url: `${baseUrl}/users/:id/player-name`, // placeholder
  },

  RESET_PASSWORD: {
    method: "POST",
    url: `${baseUrl}/users/reset-password`
  },

  UPDATE_EMAIL: {
    method: "PUT",
    url: `${baseUrl}/users/:id/email`,
  },

  PASSWORD_RESET_REQUEST: {
    method: "POST",
    url: `${baseUrl}/users/request-password-reset`,
  },

  CREATE_BET:{
    method: "POST",
    url: `${baseUrl}/bets/create`
  },






//******************
  LOGIN_EMAIL: { method: "POST", url: `${baseUrl}/users/login` },
  LOGIN_GOOGLE: { method: "POST", url: `${baseUrl}/users/google-login` },
  
  REGISTER_USER: { method: "POST", url: `${baseUrl}/users/register` },
  REGISTER_USER_BASIC: { method: "POST", url: `${baseUrl}/users/register/basic` },
  REGISTER_PLAYERNAME: { method: "POST", url: `${baseUrl}/users/register/player-name` },
  SEARCH_USER_BY_EMAIL: { method: "GET", url: `${baseUrl}/users/search?email=:email` },
  SEARCH_USER_BY_ID: { method: "GET", url: `${baseUrl}/users/search?id=:id` },

  UPDATE_PLAYERNAME: { method: "PATCH", url: `${baseUrl}/users/:id/player-name` },
  UPDATE_PLAYERNAME_SECURE: { method: "PATCH", url: `${baseUrl}/users/:id/player-name/secure` },

  UPDATE_EMAIL_CREDENTIAL: { method: "PATCH", url: `${baseUrl}/users/:id/updateEmail` },
  UPDATE_PASSWORD: { method: "PATCH", url: `${baseUrl}/users/:id/updatePassword` },

  PROFILE_PICTURE: { method: "POST", url: `${baseUrl}/users/:id/profile-picture` },

  
  DELETE_USER_REQUEST: { method: "POST", url: `${baseUrl}/users/request-delete` },
  CONFIRM_DELETE_USER: { method: "GET", url: `${baseUrl}/users/confirm-delete?token=:token` },













 RESOLVE_BET: { method: "POST", url: `${baseUrl}/bets/resolve` }, // usually requires body { betId, winnerId }
  GET_BET_BY_ID: { method: "GET", url: `${baseUrl}/bets/:id` },
  GET_USER_BETS: { method: "GET", url: `${baseUrl}/bets/user/:userId` },

  // ---------------- FRIENDSHIP ----------------
  FRIEND_REQUEST: { method: "POST", url: `${baseUrl}/friendship/request` },
  FRIEND_ACCEPT: { method: "POST", url: `${baseUrl}/friendship/accept` },
  FRIEND_DECLINE: { method: "POST", url: `${baseUrl}/friendship/decline` },

  GET_PENDING_FRIENDS: { method: "GET", url: `${baseUrl}/friendship/pending/:id` },
  GET_FRIENDS: { method: "GET", url: `${baseUrl}/friendship/friends/:id` },

  DELETE_FRIEND: { method: "DELETE", url: `${baseUrl}/users/:id` },
  UNFRIEND: { method: "DELETE", url: `${baseUrl}/friendship/unfriend?userId=:userId&friendId=:friendId` },
  ADD_BY_PHONE: { method: "POST", url: `${baseUrl}/friendship/check-friends/:id` },
  FRIENDSHIP_ALL: { method: "GET", url: `${baseUrl}/friendship/all/:id` },

  // ---------------- CHAT ----------------
  SEND_MESSAGE: { method: "POST", url: `${baseUrl}/chat/send` },
  SEND_MEDIA_MESSAGE: { method: "POST", url: `${baseUrl}/chat/send` },

  CHAT_HISTORY: { 
    method: "GET", 
    url: `${baseUrl}/chat/messages/:receiverId?limit=:limit&offset=:offset` 
  },

  EDIT_MESSAGE: { method: "PUT", url: `${baseUrl}/chat/messages/:messageId` },
  DELETE_MESSAGE: { method: "DELETE", url: `${baseUrl}/chat/messages/:messageId` },

  // ---------------- ACTIVITY ----------------
  GET_ALL_LOGS: { method: "GET", url: `${baseUrl}/activity` },
  GET_LOGS_BY_USER: { method: "GET", url: `${baseUrl}/activity/by-user?userId=:id` },
    GET_LOGS_BY_DATE: { method: "GET", url: `${baseUrl}/activity/by-date?from=:from&to=:to` },
  // ... continue for all endpoints
};
