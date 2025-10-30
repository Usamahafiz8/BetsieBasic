import { END_POINTS } from '../../api/END_POINTS';
import { apiRequest, useApiRequest } from '../../api/useApiRequest';
import { useBetsieStore } from '../useBetsieStore';

export const getUserById = async (id: number) => {
  const apiRequest = useApiRequest();
  // Fix: Get the setUser function from the store state
  const { setUser } = useBetsieStore.getState();

  const endpoint = {
    url: `${END_POINTS.GET_USERS.url}/${id}`,
    method: END_POINTS.GET_USERS.method,
  };

  const res = await apiRequest(endpoint);
  if (res && res.success !== false) {
    setUser(res);
    return res;
  } else {
    console.log('❌ Failed to fetch user:', res.message);
    return null;
  }
};

// 🔹 Update email
export const updateEmail = async (id: number, newEmail: string) => {
  const endpoint = {
    url: `${END_POINTS.UPDATE_EMAIL.url}/${id}/email`,
    method: END_POINTS.UPDATE_EMAIL.method,
  };

  return await apiRequest(endpoint, { newEmail });
};

// 🔹 Update profile picture
export const updateProfilePicture = async (id: number, file: any) => {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = {
    url: `${END_POINTS.GET_USERS.url}/${id}/profile-picture`,
    method: END_POINTS.GET_USERS.method,
  };

  return await apiRequest(endpoint, formData, 'multipart/form-data');
};
