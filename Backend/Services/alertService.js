const sendAlert = async ({ riskLevel, riskScore, location, reason }) => {
  try {
    
    if (riskLevel !== "HIGH") {
      return {
        sent: false,
        message: "No alert required",
      };
    }

    const alert = {
      type: "LANDSLIDE_WARNING",
      severity: "HIGH",
      riskScore,
      location,
      message: `High landslide risk detected. ${reason}`,
      createdAt: new Date(),
    };

  
    console.log("ALERT:", alert);

    return {
      sent: true,
      alert,
    };
  } catch (error) {
    console.error("Alert Service Error:", error.message);
    throw new Error("Unable to send alert");
  }
};

export default sendAlert;
