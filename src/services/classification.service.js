import axios from "axios";

const fastApiBaseURL = "http://127.0.0.1:8000";

export async function classifyEstablishment(name, description) {
  try {
    const response = await axios.post(`${fastApiBaseURL}/classify`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error classifying establishment:",
      error.response?.data || error.message
    );
    throw new Error("Failed to classify establishment");
  }
}
