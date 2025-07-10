import apiClient from "./client";

const endPoint = "api/company/";

// Getting employees from the server API
const getCompanys = () => apiClient.get(endPoint);

// Adding an company to the server API
const addCompany = (company, onUploadProgress) => {
  const data = new FormData();
  data.append("name", company.name);
  data.append("email", company.email);
  data.append("phone", company.phone);

  //console.log("Sending data to server:", data);

  return apiClient.post(endPoint, data, {
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      onUploadProgress(progress);
    },
  });
};

// Updating an employee in the server API
const updateCompany = (id, company, onUploadProgress) => {
  const data = new FormData();
  data.append("name", company.name);
  data.append("email", company.email);
  data.append("phone", company.phone);

  return apiClient.put(`${endPoint}${id}/`, data, {
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      onUploadProgress(progress);
    },
  });
};

// Deleting an employee from the server API
const deleteCompany = (id) => apiClient.delete(endPoint + id + "/");

export default {
  getCompanys,
  addCompany,
  updateCompany,
  deleteCompany,
};
