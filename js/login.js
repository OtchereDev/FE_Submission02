const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const Auth = new Authentication();

window.onload = () => {
  const access_token = localStorage.getItem("access_token");
  if (access_token?.length) {
    location.href = "/dashboard.html";
  }
};

loginBtn?.addEventListener("click", async () => {
  const username = usernameInput?.value;
  const password = passwordInput?.value;

  if (!username?.length) {
    usernameError.classList.remove("hidden");
  } else {
    usernameError.classList.add("hidden");
  }

  if (!password?.length) {
    passwordError.classList.remove("hidden");
  } else {
    passwordError.classList.add("hidden");
  }

  loginBtn.textContent = "Loading";
  loginBtn.disabled = true;
  loginError.classList.add("hidden");

  const { msg, status } = await Auth.login(username, password);

  if (status) {
    location.href = "/dashboard.html";
  } else {
    loginError.classList.remove("hidden");
    loginError.textContent = msg;
  }

  loginBtn.disabled = false;

  loginBtn.textContent = "Login";
});
