/* eslint-disable no-unused-vars */
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendIcon, AttachIcon, RobotIcon } from "../../comp/ui/Icons";
import Body from "../../comp/layout/Body";
import Message from "./Message/Message";
import Features from "./FeatureSection/Features";
import TypingIndicator from "./TypingIndicator/TypingIndicator";
import Suggestions from "./Suggestions/Suggestions";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content:
        "Hello! I'm your AI study assistant. I can help you with scheduling, study tips, subject questions, and more. How can I help you today?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showDocPreview, setShowDocPreview] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setShowDocPreview(true);
    setIsExpanded(true); // Auto-expand modal when file is uploaded

    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-preview files, just set a placeholder
      setFilePreview(true);
    }
  }, []);

  const sendMessage = useCallback((text) => {
    const content = (text || input).trim();
    if (!content) return;

    setIsExpanded(true);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content, time: getTime() },
    ]);
    setIsTyping(true);

    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content: "That's a great question! I'm here to help you study more effectively. In a real integration, this response would come from an AI backend via WebSocket or REST API.",
          time: getTime(),
        },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleKey = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });
  }, [messages, isTyping]);

  return (
    <Body>
        <div className={`${!isExpanded ?'pb-10 px-3':''}`}>

      {/* Background blur overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            style={{ backdropFilter: "blur(8px)" }}
          />
        )}
      </AnimatePresence>

      {/* Main container */}
      <motion.div
        className="flex flex-col h-screen w-full px-4 sm:px-5 pb-0 pt-3 sm:pt-5 font-Inter max-w-4xl mx-auto"
        animate={isExpanded ? { scale: 0.9, opacity: 0.6 } : { scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5"
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #9B7EDE 0%, #7C5FBD 100%)'
            }}
            className="w-9 sm:w-11 h-9 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-900/40 flex-shrink-0"
          >
            <RobotIcon />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">AI Study Assistant</h1>
            <div className="flex flex-row items-center gap-2 mt-1">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                style={{
                  color: '#B8A7E5'
                }}
                className="text-xs font-Inter text-violet-400 truncate"
              >
                Online
              </span>
            </div>
          </div>
        </motion.div>

        {/* Chat box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col bg-[#3D3555] border border-[#9B7EDE33] rounded-2xl sm:rounded-3xl rounded-b-none overflow-hidden min-h-0"
        >
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-6 flex flex-col gap-3 sm:gap-5 min-h-0 w-full
            [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#52466B] [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
            <div ref={messagesEndRef} className="w-full" />
          </div>

          {/* Suggestions - Show on all devices now */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-3 sm:px-5 pt-2 sm:pt-3 pb-2 border-t border-violet-900/20"
              >
                <p className="text-[9px] sm:text-[10px] uppercase text-gray-500/80 tracking-widest mb-1.5 sm:mb-2">
                  Suggestions
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Suggestions sendMessage={sendMessage} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input - Fixed positioning */}
          <div className="flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-3 border-t border-[#52466B] bg-[#3D3555]">
            {/* Attachment button row - visible on mobile/tablet only */}
            <div className="flex sm:hidden gap-2 items-center mb-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#52466B'
                }}
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
              >
                <AttachIcon />
              </motion.button>
              <span className="text-xs text-gray-400">Attach file</span>
            </div>

            {/* Main input row */}
            <div className="flex items-end gap-1.5 sm:gap-2">
              {/* Attachment button - hidden on mobile/tablet, visible on desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#52466B'
                }}
                onClick={() => fileInputRef.current?.click()}
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
              >
                <AttachIcon />
              </motion.button>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,image/*"
                className="hidden"
              />

              <div className="flex-1 relative flex items-end min-w-0">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything..."
                  className="w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[#52466B] text-sm text-white placeholder-[#858585] resize-none outline-none transition-all leading-5 font-[Inter]"
                  style={{ minHeight: 36, maxHeight: 100 }}
                  spellCheck="false"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{ background: '#9B7EDE' }}
                className="w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-900/40 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer transition-opacity"
              >
                <SendIcon />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Feature cards - Hide on mobile, show only on tablet+ */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: "auto" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex flex-col lg:flex-row mt-6 lg:mt-0 gap-4 py-4"
            >
              <Features />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Expanded chat modal - FULL SCREEN */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              className="w-full h-full sm:max-w-7xl flex flex-col bg-[#3D3555] border border-[#9B7EDE33] rounded-none sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5  bg-[#3D3555]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div
                    style={{
                      background: 'linear-gradient(180deg, #9B7EDE 0%, #7C5FBD 100%)'
                    }}
                    className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  >
                    <RobotIcon />
                  </div>
                  <h2 className="text-sm sm:text-lg font-semibold text-white truncate">AI Study Assistant</h2>
                  {uploadedFile && (
                    <span className="text-xs text-violet-400 ml-2 px-2 sm:px-3 py-1 bg-violet-900/20 rounded-full truncate max-w-[120px] sm:max-w-none">
                      📎 {uploadedFile.name.length > 15 ? uploadedFile.name.substring(0, 12) + '...' : uploadedFile.name}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsExpanded(false);
                    setUploadedFile(null);
                    setFilePreview(null);
                  }}
                  className="text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 ml-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>

              {/* Main content area - split view when file is uploaded */}
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden w-full">

                {/* Chat section */}
                <motion.div
                  layout
                  className={`flex flex-col overflow-hidden ${uploadedFile && filePreview && showDocPreview ? 'w-full sm:w-1/2 border-b sm:border-b-0  border-violet-900/20' : 'w-full'}`}
                >
                  {/* Messages */}
                  <div
                    className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4 w-full min-h-0
                    [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#52466B] [&::-webkit-scrollbar-track]:bg-transparent"
                  >
                    {messages.map((msg) => (
                      <Message key={msg.id} msg={msg} />
                    ))}
                    <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
                    <div ref={messagesEndRef} className="w-full" />
                  </div>

                  {/* Input */}
                  <div className="flex flex-col gap-2 px-4 sm:px-8 py-3 sm:py-5 border-t border-violet-900/20 bg-[#3D3555]">
                    {/* Attachment button row - visible on mobile/tablet only */}
                    <div className="flex sm:hidden gap-2 items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ background: '#52466B' }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <AttachIcon />
                      </motion.button>
                      <span className="text-xs text-gray-400">Attach file</span>
                    </div>

                    {/* Main input row */}
                    <div className="flex items-end gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ background: '#52466B' }}
                        onClick={() => fileInputRef.current?.click()}
                        className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <AttachIcon />
                      </motion.button>

                      <div className="flex-1 relative flex items-end min-w-0">
                        <textarea
                          ref={inputRef}
                          rows={1}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKey}
                          placeholder="Ask anything..."
                          className="w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[#52466B] text-sm text-white placeholder-[#858585] resize-none outline-none transition-all leading-5 font-[Inter]"
                          style={{ minHeight: 40, maxHeight: 120 }}
                          autoFocus
                          spellCheck="false"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage()}
                        disabled={!input.trim()}
                        style={{ background: '#9B7EDE' }}
                        className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-900/40 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer transition-opacity"
                      >
                        <SendIcon />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* File preview section - appears when file is uploaded */}
                <AnimatePresence>
                  {uploadedFile && showDocPreview && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ 
                        opacity: 1, 
                        width: "50%"
                      }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="hidden sm:flex sm:w-1/2 flex-col overflow-hidden "
                    >
                      <div className="flex font-Inter items-center justify-between px-4 sm:px-6 py-3 sm:py-4  ">
                        <h3 className="text-sm font-semibold text-white truncate">Document Preview</h3>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowDocPreview(false);
                          }}
                          className="text-violet-400 hover:text-violet-300 transition-colors ml-2"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* Preview content */}
                      <div className="flex-1 overflow-auto p-3 sm:p-4 w-full">
                        {filePreview && typeof filePreview === "string" && uploadedFile.type === "application/pdf" ? (
                          <iframe
                            src={filePreview}
                            className="w-full h-full rounded-lg"
                            title="PDF Preview"
                          />
                        ) : filePreview && typeof filePreview === "string" && uploadedFile.type.startsWith("image/") ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-auto rounded-lg object-contain max-h-[600px] sm:max-h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-violet-400">
                            <div className="text-center">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                              </svg>
                              <p className="text-sm">Loading preview...</p>
                              <p className="text-xs opacity-75 mt-2">{uploadedFile.name}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

                  </div>
    </Body>
  );
}