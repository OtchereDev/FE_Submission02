class Orders {
  constructor() {
    this.auth = new Authentication();
  }

  async getOrdersData(page = 1, search = "") {
    const access_token = this.auth.getAccessToken();
    const request = await fetch(`${baseUrl}${ordersEndpoint(page, search)}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`,
      },
    });

    try {
      const data = await request.json();

      if (request.status == 422 || request.status == 401) {
        const { status } = await this.auth.refreshToken();

        const access_token = this.auth.getAccessToken();

        if (status) {
          const request = await fetch(
            `${baseUrl}${ordersEndpoint(page, search)}`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${access_token}`,
              },
            }
          );

          const data = await request.json();

          return {
            status: true,
            data,
          };
        } else {
          this.auth.logout();
        }
      }

      if (request.ok) {
        return {
          status: true,
          data,
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
}
