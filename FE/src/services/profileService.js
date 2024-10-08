import restClient from "./restClient";

export function changePassword({ email, password, newPassword,login }) {
  return restClient({
    url: "api/user/changepassword",
    method: "POST",
    data: {
      email: email,
      password: password,
      newPassword: newPassword,
      loginProvider:login
    },
  });
}
export function getUser(id) {
  return restClient({
    url: `api/user/getuser/${id}`,
    method: "GET",
  });
}

export function updateUser(formData) {
  return restClient({
    url: `api/user/updateuser`,
    method: "PUT",
    data:formData 
  });
}
