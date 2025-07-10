import apiClient from "./client";

const endPoint = "/api/correction-requests/";

// Load the correction requests list from the server API
const getCorrectionRequests = () => apiClient.get(endPoint);

// Add a new correction request
const addCorrectionRequest = (correctionRequest, onUploadProgress) => {
  const data = new FormData();
  data.append("employee", correctionRequest.employee); // employee_id
  data.append("reason", correctionRequest.reason);
  data.append("punch_type", correctionRequest.punch_type);
  data.append("date", correctionRequest.date); // ✅ corrected key from "dtae" to "date"
  data.append("corrected_time", correctionRequest.corrected_time);

  return apiClient.post(endPoint, data, {
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      if (onUploadProgress) onUploadProgress(progress);
    },
  });
};

// Update an existing correction request
const updateCorrectionRequest = (
  id,
  correctionRequestData,
  onUploadProgress,
) => {
  const data = new FormData();
  data.append("employee", correctionRequestData.employee); // employee_id
  data.append("reason", correctionRequestData.reason);
  data.append("punch_type", correctionRequestData.punch_type);
  data.append("date", correctionRequestData.date); // ✅ use consistent key
  data.append("corrected_time", correctionRequestData.corrected_time);

  return apiClient.put(`${endPoint}${id}/`, data, {
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      if (onUploadProgress) onUploadProgress(progress);
    },
  });
};

const reviewCorrectionRequest = (id, decision) =>
  apiClient.post(`/api/correction-requests/${id}/review/`, { decision });

// Delete a correction request
const deleteCorrectionRequest = (id) => {
  return apiClient.delete(`${endPoint}${id}/`);
};

export default {
  getCorrectionRequests,
  addCorrectionRequest,
  updateCorrectionRequest,
  deleteCorrectionRequest,
  reviewCorrectionRequest,
};
