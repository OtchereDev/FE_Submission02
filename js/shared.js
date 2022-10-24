const logoutBtn = document.getElementById("logoutBtn");

const Authy = new Authentication();

logoutBtn?.addEventListener("click", () => {
  Authy.logout();
});
