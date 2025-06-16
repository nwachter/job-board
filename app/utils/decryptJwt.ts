// import { jwtDecode } from 'jwt-decode';
import { getUserInfo } from "../services/auth";
import jwt from "jsonwebtoken";

export const decryptToken = () => {
  try {
    //Get cookie named "token"
    const tokenFromCookie = document.cookie.split("; ").find(row => row.startsWith("token="));
    // if (tokenFromCookie !== undefined) {
    //     console.log("Cookie : ", tokenFromCookie);
    // }
    // const tokenFromLS = localStorage.getItem(tokenKey);
    const token = tokenFromCookie ? tokenFromCookie.split("=")[1] : null;

    if (!token) {
      return null;
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret");
    // const decodedData = jwtDecode(token);
    return decodedData;
  } catch (error) {
    console.error("Failed to decrypt token:", error);
    return null;
  }
};

export const checkConnectionAndGetInfo = async () => {
  let userData;
  const isConnected = (await localStorage.getItem("isConnected")) === "true";
  if (isConnected) {
    userData = await getUserInfo();
  } else userData = false;

  return userData;
};
