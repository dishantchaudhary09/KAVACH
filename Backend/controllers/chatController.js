
import { getChatbotResponse } from "../Services/chatBotService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await getChatbotResponse(message);

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to process your request",
    });
  }
};

