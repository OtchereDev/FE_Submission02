// import { baseUrl, loginEndpoint, refreshEndpoint } from "../config/endpoints";

class Authentication {
  constructor() {}

  async login(username, password) {
    const request = await fetch(`${baseUrl}${loginEndpoint}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    try {
      const data = await request.json();

      if (request.ok) {
        const { access_token, refresh_token } = data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        return {
          status: true,
          msg: "Successfully Logged in",
        };
      } else {
        const { msg } = data;
        return {
          status: false,
          msg,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: error.message || "An unexpcted error occurred",
      };
    }
  }

  async refreshToken() {
    localStorage.removeItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!refresh_token?.length) {
      return {
        status: false,
        msg: "",
      };
    }
    const request = await fetch(`${baseUrl}${refreshEndpoint}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${refresh_token}`,
      },
    });

    try {
      const data = await request.json();

      if (request.ok) {
        const { access_token } = data;
        localStorage.setItem("access_token", access_token);
        return {
          status: true,
          msg: "Successfully refreshed tokens",
        };
      } else {
        const { msg } = data;
        localStorage.removeItem("access_token");
        return {
          status: false,
          msg,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: error.message || "An unexpcted error occurred",
      };
    }
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    location.href = "/login.html";

    return {
      status: true,
      msg: " Successfully logged out",
    };
  }

  checkAuthenticated() {
    const access_token = localStorage.getItem("access_token");
    if (!access_token?.length) {
      location.href = "/login.html";
      return;
    } else return;
  }

  getAccessToken() {
    return localStorage.getItem("access_token");
  }
}
