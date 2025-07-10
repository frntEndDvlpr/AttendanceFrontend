import apiClient from "./client";

const endPoint = "auth/users/";

const getUsers = () => apiClient.get(endPoint);

const getMe = (token) => {
  // If token is provided, use it to fetch user details
  if (token) {
    return apiClient.get("auth/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};

const adduser = (user, onUploadProgress) => {
  const data = new FormData();
  data.append("username", user.name);
  data.append("email", user.email);
  data.append("password", user.password);
  data.append("employee", user.employee);

  // Only append image if it exists
  if (user.imageUri) {
    const uriParts = user.imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    data.append("profile_image", {
      uri: user.imageUri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
  }

  return apiClient.post(endPoint, data, {
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      if (onUploadProgress) onUploadProgress(progress);
    },
  });
};

const updateUser = (id, user, onUploadProgress) => {
  const data = new FormData();

  // Add fields that are allowed to update
  if (user.name) data.append("username", user.name);
  if (user.email) data.append("email", user.email);
  if (user.password) data.append("password", user.password);
  if (user.employee) data.append("employee", user.employee);

  // Only include is_staff during update
  if (typeof user.is_staff === "boolean") {
    data.append("is_staff", user.is_staff ? "true" : "false");
  }

  // Do NOT send imageUri or image data

  return apiClient.put(`${endPoint}${id}/`, data, {
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      if (onUploadProgress) onUploadProgress(progress);
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Function to log in a user by sending username and password to the server API
const login = (username, password) =>
  apiClient.post("token/", { username, password });

// Function to refresh the token using the refresh token
const refreshToken = (refresh) =>
  apiClient.post("/token/refresh/", { refresh });

// Deleting a user from the server API
const deleteUser = (id) => apiClient.delete(endPoint + id + "/");

export default {
  login,
  adduser,
  getUsers,
  deleteUser,
  refreshToken,
  updateUser,
  getMe,
};
