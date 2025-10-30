import axios from "axios";
import { useBetsieStore } from "../../store/useBetsieStore";
import { END_POINTS } from "../END_POINTS";

export default async function refreshTokenApi() {
  try {
    const { refreshToken } = useBetsieStore.getState();
    if (!refreshToken) return { success: false, message: "No refresh token" };

    const res = await axios.post(
      END_POINTS.REFRESHTOKEN.url,
      { token: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    const newTokenObj = res?.data?.token;

    if (newTokenObj?.token && newTokenObj?.refreshToken) {
      await useBetsieStore.getState().setTokens(newTokenObj.token, newTokenObj.refreshToken);
      return { success: true, tokens: { accessToken: newTokenObj.token, refreshToken: newTokenObj.refreshToken } };
    }

    return { success: false, message: "Refresh failed" };
  } catch (err: any) {
    console.error("RefreshToken error:", err?.response?.data || err);
    return { success: false, message: err?.response?.data?.message || "Refresh token failed" };
  }
}
