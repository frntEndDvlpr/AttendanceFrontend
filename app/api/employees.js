import apiClient from "./client";

const endPoint = "api/employees/";

const getEmployees = () => apiClient.get(endPoint);

const getEmployeesProfile = () => apiClient.get(endPoint + "me/");

const getEmployeeById = (userId) => apiClient.get(`${endPoint}${userId}/`);

const buildFormData = (employee) => {
  const data = new FormData();

  Object.entries(employee).forEach(([key, value]) => {
    //if (key === "photo") return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        data.append(key, v.toString());
      });
    } else if (key === "user_id" && typeof value === "number") {
      data.append(key, value.toString());
    } else if (value !== null && value !== undefined) {
      data.append(key, value);
    }
  });

  if (employee.photo && typeof employee.photo === "string") {
    const photoUri = employee.photo;
    const photoName = photoUri.split("/").pop();
    const photoType = `image/${photoName.split(".").pop()}`;

    data.append("photo", {
      uri: photoUri,
      name: photoName,
      type: photoType,
    });
  }

  return data;
};

const addEmployee = (employee, onUploadProgress) => {
  const data = buildFormData(employee);

  return apiClient.post(endPoint, data, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) =>
      onUploadProgress && onUploadProgress(event.loaded / event.total),
  });
};

const updateEmployee = (id, employee, onUploadProgress) => {
  const data = buildFormData(employee);

  return apiClient.patch(`${endPoint}${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) =>
      onUploadProgress && onUploadProgress(event.loaded / event.total),
  });
};

const deleteEmployee = (id, onUploadProgress) =>
  apiClient.delete(`${endPoint}${id}/`, {
    onUploadProgress: (event) =>
      onUploadProgress && onUploadProgress(event.loaded / event.total),
  });

export default {
  getEmployees,
  getEmployeeById,
  getEmployeesProfile,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
