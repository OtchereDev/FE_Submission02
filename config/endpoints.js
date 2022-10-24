const baseUrl = "https://freddy.codesubmit.io/";

const loginEndpoint = "login";
const refreshEndpoint = "refresh";
const dashboardEndpoint = "dashboard";
const ordersEndpoint = (page = 1, search = "") =>
  `orders?page=${page}&q=${search}`;
