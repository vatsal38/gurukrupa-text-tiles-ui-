import React from "react";
import jwtDecode from "jwt-decode";

class AuthServices {
  logOut = async () => {
    localStorage.clear();
    this.setToken(null);
  };

  isAuthTokenValid = (accessToken: any) => {
    if (!accessToken) {
      return false;
    }
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }
    return true;
  };

  handleAuthentication = () => {
    const accessToken: any = this.getAccessToken();
    if (!accessToken) {
      return "noAccessToken";
    }
    if (this.isAuthTokenValid(accessToken)) {
      this.setToken(accessToken);
      return "Authenticated";
    }
    return "notValidToken";
  };

  setToken = (accessToken: any) => {
    if (accessToken) {
      localStorage.setItem("userToken", accessToken);
    } else return null;
  };

  isAboutToExpire = () => {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return false;
    }
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    const fiveMin = 1 * 60;

    if (decoded.exp < currentTime + fiveMin) {
      return true;
    }
    return false;
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("userToken");
    if (accessToken !== null && accessToken.trim() !== "") {
      if (accessToken.trim().startsWith("Bearer")) {
        return accessToken;
      } else {
        return `Bearer ${accessToken}`;
      }
    } else {
      return null;
    }
  };

  getDecodedAccessToken = () => {
    const accessToken: any = this.getAccessToken();
    const isAuthTokenValid = this.isAuthTokenValid(accessToken);
    if (isAuthTokenValid) {
      const decoded = jwtDecode(accessToken);
      return decoded;
    }
    return false;
  };

  getUserIdFromToken = () => {
    const accessToken: any = this.getAccessToken();
    const isAuthTokenValid = this.isAuthTokenValid(accessToken);
    if (isAuthTokenValid) {
      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.id;
      return userId;
    }
    return false;
  };
}

export default new AuthServices();
