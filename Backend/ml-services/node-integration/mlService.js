import axios from "axios";

const predictRisk = async (features) => {
  const baseUrl = process.env.ML_SERVICE_URL;

  if (!baseUrl) {
    throw new Error("ML_SERVICE_URL is not configured");
  }

  const response = await axios.post(
    `${baseUrl.replace(/\/$/, "")}/predict`,
    features,
    {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export default predictRisk;
