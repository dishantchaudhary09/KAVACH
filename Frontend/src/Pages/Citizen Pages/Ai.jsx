
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import {
  Bot,
  Send,
  User,
  ShieldCheck,
  AlertTriangle,
  CloudRain,
  Map,
  Trash2,
  Sparkles,
  RefreshCw,
  Siren,
  CheckCircle2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const CitizenAIAssistant = () => {
  const darkMode = useSelector(
    (state) => state.theme?.darkMode || false
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: `### 👋 Hello!

I'm your **AI Safety Assistant**. I can help you with:

- 🌋 Landslide safety
- 🌧️ Rainfall and flood risks
- 🛣️ Road conditions
- 🚨 Emergency preparedness
- 🗺️ Understanding landslide risk
- 🏠 What to do during a disaster

**How can I help you stay safe today?**`,
    },
  ]);

  const messagesEndRef = useRef(null);

  // =========================================================
  // DARK MODE
  // =========================================================

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("accessToken")
    );
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async (text = message) => {
    const userMessage = String(text || "").trim();

    if (!userMessage || loading) return;

    const userMessageObject = {
      id: Date.now(),
      sender: "user",
      text: userMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessageObject,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = getToken();

      const headers = {
        "Content-Type": "application/json",
      };

      // Token available ho to send karo
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from AI server."
        );
      }

      console.log("🤖 AI RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to get AI response."
        );
      }

      const aiResponse =
        data.response ||
        data.reply ||
        data.message ||
        data.data?.response ||
        data.data?.reply;

      if (
        !aiResponse ||
        typeof aiResponse !== "string"
      ) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("❌ AI CHAT ERROR:", error);

      let errorMessage =
        "Unable to connect to the AI service.";

      if (
        error.message?.includes("Failed to fetch")
      ) {
        errorMessage = `### ⚠️ Connection Error

I couldn't connect to the AI server.

Please make sure:

- 🟢 Backend server is running
- 🔌 Backend is running on **port 3000**
- 🌐 API URL is correct
- 🔄 Try again in a few seconds`;
      } else if (error.message) {
        errorMessage = `### ⚠️ AI Assistant Error

${error.message}

Please try again.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: errorMessage,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // CLEAR CHAT
  // =========================================================

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: `### 🧹 Chat Cleared

Your conversation has been cleared.

I'm ready to help you with **landslide safety, rainfall, road hazards and emergency preparedness.**

**What would you like to know?**`,
      },
    ]);
  };

  // =========================================================
  // RETRY
  // =========================================================

  const retryLastMessage = () => {
    if (loading) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.sender === "user");

    if (lastUserMessage) {
      sendMessage(lastUserMessage.text);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07140f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-5">

            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  darkMode
                    ? "bg-green-500/10"
                    : "bg-green-50"
                }`}
              >
                <Bot className="h-5 w-5 text-green-500" />
              </div>

              <span className="text-sm font-semibold text-green-500">
                AI SAFETY ASSISTANT
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  AI Safety Assistant
                </h1>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Get intelligent safety guidance about
                  landslides, rainfall and road hazards.
                </p>
              </div>

              <button
                onClick={clearChat}
                className={`flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/10"
                    : "border-slate-200 bg-white hover:bg-slate-100"
                }`}
              >
                <Trash2 size={15} />
                Clear Chat
              </button>

            </div>
          </div>

          {/* =================================================
              CHAT CARD
          ================================================= */}

          <div
            className={`overflow-hidden rounded-2xl border shadow-xl ${
              darkMode
                ? "border-white/10 bg-[#0c2119]"
                : "border-slate-200 bg-white"
            }`}
          >

            {/* =================================================
                AI HEADER
            ================================================= */}

            <div
              className={`flex items-center gap-3 border-b p-4 ${
                darkMode
                  ? "border-white/10"
                  : "border-slate-200"
              }`}
            >

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg">
                  <Bot size={23} />
                </div>

                <span
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 ${
                    darkMode
                      ? "border-[#0c2119]"
                      : "border-white"
                  } bg-green-500`}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-bold">
                  Landslide Safety AI
                </h2>

                <div className="mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <span
                    className={`text-[10px] ${
                      darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    AI Powered • Ready to help
                  </span>
                </div>
              </div>

              <Sparkles
                className="hidden text-green-500 sm:block"
                size={19}
              />

            </div>

            {/* =================================================
                CHAT BODY
            ================================================= */}

            <div
              className={`h-[480px] overflow-y-auto p-4 sm:p-6 ${
                darkMode
                  ? "scrollbar-thumb-slate-700"
                  : ""
              }`}
            >

              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  darkMode={darkMode}
                  onRetry={retryLastMessage}
                />
              ))}

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (
                <div className="mt-5 flex items-start gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      darkMode
                        ? "bg-green-500/10"
                        : "bg-green-50"
                    } text-green-500`}
                  >
                    <Bot size={18} />
                  </div>

                  <div
                    className={`rounded-2xl rounded-tl-none px-4 py-3 ${
                      darkMode
                        ? "bg-white/[0.06]"
                        : "bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-1">

                      <span className="h-2 w-2 animate-bounce rounded-full bg-green-500" />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-green-500"
                        style={{
                          animationDelay: "0.15s",
                        }}
                      />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-green-500"
                        style={{
                          animationDelay: "0.3s",
                        }}
                      />

                    </div>
                  </div>

                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* =================================================
                SUGGESTIONS
            ================================================= */}

            <div
              className={`border-t px-4 pt-4 ${
                darkMode
                  ? "border-white/10"
                  : "border-slate-200"
              }`}
            >

              <div className="mb-2 flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-green-500"
                />

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Suggested Questions
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-3">

                <Suggestion
                  icon={<AlertTriangle />}
                  text="What should I do during a landslide?"
                  onClick={sendMessage}
                  darkMode={darkMode}
                />

                <Suggestion
                  icon={<CloudRain />}
                  text="Is heavy rainfall dangerous?"
                  onClick={sendMessage}
                  darkMode={darkMode}
                />

                <Suggestion
                  icon={<Map />}
                  text="How is landslide risk calculated?"
                  onClick={sendMessage}
                  darkMode={darkMode}
                />

                <Suggestion
                  icon={<ShieldCheck />}
                  text="How can I stay safe?"
                  onClick={sendMessage}
                  darkMode={darkMode}
                />

                <Suggestion
                  icon={<Siren />}
                  text="What should I do in an emergency?"
                  onClick={sendMessage}
                  darkMode={darkMode}
                />

              </div>
            </div>

            {/* =================================================
                INPUT
            ================================================= */}

            <div className="p-4">

              <div
                className={`flex items-end gap-2 rounded-xl border p-2 ${
                  darkMode
                    ? "border-white/10 bg-[#07140f]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
                  placeholder="Ask something about landslide safety..."
                  className={`max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none ${
                    darkMode
                      ? "text-white placeholder:text-slate-600"
                      : "text-slate-900 placeholder:text-slate-400"
                  }`}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={
                    !message.trim() || loading
                  }
                  aria-label="Send message"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                    message.trim() && !loading
                      ? "bg-green-600 text-white shadow-md hover:bg-green-700"
                      : darkMode
                        ? "bg-white/5 text-slate-600"
                        : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Send size={17} />
                </button>

              </div>

              <div className="mt-2 flex items-center justify-center gap-1 text-center">
                <ShieldCheck
                  size={11}
                  className="text-slate-500"
                />

                <p className="text-[10px] text-slate-500">
                  AI responses are for guidance only. In an
                  emergency, follow local authority instructions.
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// =============================================================
// CHAT MESSAGE
// =============================================================

const ChatMessage = ({
  message,
  darkMode,
  onRetry,
}) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser
          ? "mt-5 justify-end"
          : "mt-5 justify-start"
      }`}
    >

      {/* AI ICON */}

      {!isUser && (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            darkMode
              ? "bg-green-500/10"
              : "bg-green-50"
          } text-green-500`}
        >
          <Bot size={18} />
        </div>
      )}

      {/* MESSAGE */}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
          isUser
            ? "rounded-tr-none bg-green-600 text-white"
            : darkMode
              ? "rounded-tl-none border border-white/5 bg-white/[0.05] text-slate-200"
              : "rounded-tl-none border border-slate-100 bg-slate-50 text-slate-700"
        }`}
      >

        {isUser ? (
          <p className="whitespace-pre-wrap leading-6">
            {message.text}
          </p>
        ) : (
          <div
            className={`ai-markdown ${
              darkMode
                ? "text-slate-200"
                : "text-slate-700"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{

                h1: ({ children }) => (
                  <h1 className="mb-3 mt-1 text-lg font-bold text-green-500">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="mb-2 mt-4 text-base font-bold text-green-500">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="mb-2 mt-3 text-sm font-bold text-green-500">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-3 leading-6 last:mb-0">
                    {children}
                  </p>
                ),

                strong: ({ children }) => (
                  <strong className="font-bold text-green-500">
                    {children}
                  </strong>
                ),

                em: ({ children }) => (
                  <em className="italic">
                    {children}
                  </em>
                ),

                ul: ({ children }) => (
                  <ul className="mb-3 ml-5 list-disc space-y-1.5">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="mb-3 ml-5 list-decimal space-y-1.5">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li className="pl-1 leading-6">
                    {children}
                  </li>
                ),

                blockquote: ({ children }) => (
                  <blockquote
                    className={`my-3 border-l-4 border-green-500 pl-3 italic ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    {children}
                  </blockquote>
                ),

                hr: () => (
                  <hr
                    className={`my-4 ${
                      darkMode
                        ? "border-white/10"
                        : "border-slate-200"
                    }`}
                  />
                ),

                code: ({ children }) => (
                  <code
                    className={`rounded px-1.5 py-0.5 text-xs ${
                      darkMode
                        ? "bg-black/30 text-green-400"
                        : "bg-slate-200 text-green-700"
                    }`}
                  >
                    {children}
                  </code>
                ),

                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-green-500 underline underline-offset-2 hover:text-green-600"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>

            {/* SUCCESS INDICATOR */}

            {!message.error && (
              <div
                className={`mt-3 flex items-center gap-1 text-[9px] ${
                  darkMode
                    ? "text-slate-600"
                    : "text-slate-400"
                }`}
              >
                <CheckCircle2 size={10} />
                AI generated response
              </div>
            )}

            {/* RETRY */}

            {message.error && (
              <button
                onClick={onRetry}
                className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      {/* USER ICON */}

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

// =============================================================
// SUGGESTION
// =============================================================

const Suggestion = ({
  icon,
  text,
  onClick,
  darkMode,
}) => {
  return (
    <button
      onClick={() => onClick(text)}
      className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
        darkMode
          ? "border-white/10 bg-white/[0.03] text-slate-400 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-green-500 hover:bg-green-500/10 hover:text-green-600"
      }`}
    >
      <span className="text-green-500">
        {React.cloneElement(icon, {
          size: 14,
        })}
      </span>

      {text}
    </button>
  );
};

export default CitizenAIAssistant;

