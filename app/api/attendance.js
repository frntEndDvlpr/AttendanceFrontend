import apiClient from "./client";

const endPoint = "/api/attendance-logs/";

// Load the attendance log from the server API
const getAttendanceLogs = () => apiClient.get(endPoint);

// Adding an attendance to the server API
const addAttendanceLogs = (attendance, onUploadProgress) => {
  const data = new FormData();
  data.append("employee", attendance.employee); // employee_id
  data.append("att_date_time", attendance.att_date_time);
  data.append("location", attendance.location);
  data.append("selfie", {
    uri: attendance.selfie.uri,
    type: "image/jpeg",
    name: "selfie.jpg",
  });

  // Debug: log FormData keys and values
  for (let pair of data.entries()) {
    console.log(pair[0] + ": " + JSON.stringify(pair[1]));
  }

  return apiClient.post(endPoint, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      onUploadProgress(progress);
    },
  });
};

// Updating an attendance in the server API
const updateAttendanceLogs = (id, attendanceData, onUploadProgress) => {
  const data = new FormData();
  data.append("employee", attendanceData.employee); // employee_id
  // Use the date string directly, no need to reformat it
  data.append("att_date_time", attendanceData.att_date_time);
  data.append("location", JSON.stringify(attendanceData.location));
  if (attendanceData.selfie.uri) {
    data.append("selfie", {
      uri: attendanceData.selfie.uri,
      type: attendanceData.selfie.type,
      name: attendanceData.selfie.name,
    });
  } else {
    console.error("Selfie URI is null");
  }

  return apiClient.put(`${endPoint}${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      const progress = event.loaded / event.total;
      onUploadProgress(progress);
    },
  });
};

// Deleting an employee from the server API
//const deleteAttendanceLog = (id) => apiClient.delete(`${endPoint}${id}/`);

export default {
  getAttendanceLogs,
  addAttendanceLogs,
  updateAttendanceLogs,
  //deleteAttendanceLog,
};
