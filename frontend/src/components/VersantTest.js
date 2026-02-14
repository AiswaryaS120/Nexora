import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mic,
  Play,
  Square,
  CheckCircle,
  RefreshCw,
  Volume2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function VersantTest() {
  const navigate = useNavigate();

  const [section, setSection] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [timer, setTimer] = useState(15 * 60);
  const [showResult, setShowResult] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [recordedText, setRecordedText] = useState("");

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  /* ---------------- SECTIONS ---------------- */

  const sections = [
    "Reading Aloud",
    "Repeat Sentences",
    "Sentence Builds",
    "Vocabulary",
    "Sentence Completion",
    "Short Answer",
    "Typing"
  ];

  const sectionData = {
    0: [
      "The sun rises in the east every morning.",
      "Technology is changing our lives rapidly."
    ],
    1: [
      "Innovation drives progress in the modern world.",
      "Practice daily to master new skills."
    ],
    2: [
      {
        words: ["Delhi", "is", "the", "capital", "of", "India"],
        correct: "Delhi is the capital of India"
      }
    ],
    3: [
      {
        q: "Synonym of 'Vivid'",
        options: ["Dull", "Bright", "Boring", "Faint"]
      }
    ],
    4: [
      {
        q: "Water boils at _ degrees Celsius.",
        options: ["0", "50", "100", "212"]
      }
    ],
    5: ["Describe your favorite food in 2-3 sentences."],
    6:
      "Type this passage accurately: Effective communication is important for career growth."
  };

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- SPEECH ---------------- */

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }
  }, []);

  // Reset audio state when moving to next question
  useEffect(() => {
    setHasPlayedAudio(false);
    setRecordedText("");
  }, [section, currentItem]);

  const startRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      toast.error("Speech recognition not supported");
      return;
    }

    setIsRecording(true);
    setRecordedText("");
    
    try {
      rec.start();
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
    }

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setRecordedText(transcript);
      setUserResponses((prev) => ({
        ...prev,
        [`${section}-${currentItem}`]: transcript
      }));
      setIsRecording(false);
    };

    rec.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsRecording(false);
      toast.error("Recording failed. Please try again.");
    };

    rec.onend = () => setIsRecording(false);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setHasPlayedAudio(true);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    synthRef.current.cancel(); // Cancel any ongoing speech
    synthRef.current.speak(utterance);
  };

  /* ---------------- NAVIGATION ---------------- */

  const handleNext = () => {
    const maxItems = Array.isArray(sectionData[section])
      ? sectionData[section].length
      : 1;

    if (currentItem < maxItems - 1) {
      setCurrentItem(currentItem + 1);
    } else if (section < sections.length - 1) {
      setSection(section + 1);
      setCurrentItem(0);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const currentContent = Array.isArray(sectionData[section])
    ? sectionData[section][currentItem]
    : sectionData[section];

  /* ---------------- UI ---------------- */

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* Top Bar */}
      <div
        style={{
          background: "#011024",
          color: "#ffffff",
          padding: "1.2rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            border: "1px solid #ffffff",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontSize: "0.95rem"
          }}
        >
          ← Exit Test
        </button>

        <div style={{ 
          fontSize: "1.4rem", 
          fontWeight: 700,
          letterSpacing: "0.5px"
        }}>
          {formatTime()}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        background: "#f5f5f5", 
        height: "8px",
        position: "relative"
      }}>
        <div style={{
          background: "#FDB913",
          height: "100%",
          width: `${((section + 1) / sections.length) * 100}%`,
          transition: "width 0.3s ease"
        }} />
      </div>

      <div style={{ padding: "3rem 2rem", maxWidth: "850px", margin: "auto" }}>
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`${section}-${currentItem}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "3rem",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                }}
              >
                {/* Section Title */}
                <div style={{
                  background: "#011024",
                  color: "#ffffff",
                  padding: "1rem 1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  display: "inline-block",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }}>
                  Section {section + 1}: {sections[section]}
                </div>

                {/* Question Number */}
                <div style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  marginBottom: "1.5rem",
                  fontWeight: 500
                }}>
                  Question {currentItem + 1} of {Array.isArray(sectionData[section]) ? sectionData[section].length : 1}
                </div>

                {/* SECTION 0: Reading Aloud - Show text immediately */}
                {section === 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: "1.4rem",
                        marginBottom: "2.5rem",
                        color: "#1a1a1a",
                        lineHeight: "1.8",
                        padding: "1.5rem",
                        background: "#f9f9f9",
                        borderLeft: "4px solid #011024",
                        borderRadius: "6px"
                      }}
                    >
                      {currentContent}
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                      <p style={{ 
                        color: "#666", 
                        marginBottom: "1rem",
                        fontSize: "0.95rem"
                      }}>
                        Click the button below and read the text aloud:
                      </p>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{
                          padding: "1rem 2.5rem",
                          background: isRecording ? "#dc2626" : "#FDB913",
                          color: isRecording ? "#ffffff" : "#1a1a1a",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "all 0.2s"
                        }}
                      >
                        <Mic size={20} />
                        {isRecording ? "Recording..." : "Start Recording"}
                      </button>

                      {recordedText && (
                        <div style={{
                          marginTop: "1.5rem",
                          padding: "1rem",
                          background: "#e8f5e9",
                          borderRadius: "6px",
                          border: "1px solid #4caf50"
                        }}>
                          <div style={{ 
                            fontSize: "0.85rem", 
                            color: "#2e7d32",
                            fontWeight: 600,
                            marginBottom: "0.5rem"
                          }}>
                            Your Recording:
                          </div>
                          <div style={{ color: "#1a1a1a" }}>
                            {recordedText}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SECTION 1: Repeat Sentences - Audio first, then recording */}
                {section === 1 && (
                  <div>
                    {!hasPlayedAudio ? (
                      <div style={{ textAlign: "center", padding: "3rem 0" }}>
                        <div style={{
                          fontSize: "1.2rem",
                          color: "#666",
                          marginBottom: "2rem"
                        }}>
                          Click the button below to listen to the sentence
                        </div>
                        <button
                          onClick={() => speakText(currentContent)}
                          disabled={isPlaying}
                          style={{
                            padding: "1.2rem 3rem",
                            background: "#011024",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            cursor: isPlaying ? "not-allowed" : "pointer",
                            fontSize: "1.1rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            boxShadow: "0 4px 12px rgba(0,82,165,0.3)",
                            opacity: isPlaying ? 0.7 : 1,
                            transition: "all 0.2s"
                          }}
                        >
                          {isPlaying ? (
                            <>
                              <Volume2 size={24} />
                              Playing...
                            </>
                          ) : (
                            <>
                              <Play size={24} />
                              Play Audio
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{
                          padding: "1.5rem",
                          background: "#e3f2fd",
                          borderRadius: "6px",
                          marginBottom: "2rem",
                          textAlign: "center",
                          color: "#011024",
                          fontWeight: 500
                        }}>
                          Now repeat what you heard
                        </div>

                        <div style={{ textAlign: "center" }}>
                          <button
                            onClick={() => speakText(currentContent)}
                            disabled={isPlaying}
                            style={{
                              padding: "0.7rem 1.5rem",
                              background: "#ffffff",
                              color: "#011024",
                              border: "2px solid #011024",
                              borderRadius: "6px",
                              fontWeight: 600,
                              cursor: isPlaying ? "not-allowed" : "pointer",
                              marginRight: "1rem",
                              marginBottom: "1.5rem",
                              fontSize: "0.9rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.5rem"
                            }}
                          >
                            <Volume2 size={18} />
                            {isPlaying ? "Playing..." : "Replay"}
                          </button>

                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            style={{
                              padding: "1rem 2.5rem",
                              background: isRecording ? "#dc2626" : "#FDB913",
                              color: isRecording ? "#ffffff" : "#1a1a1a",
                              border: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontSize: "1rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                          >
                            <Mic size={20} />
                            {isRecording ? "Recording..." : "Start Recording"}
                          </button>
                        </div>

                        {recordedText && (
                          <div style={{
                            marginTop: "2rem",
                            padding: "1rem",
                            background: "#e8f5e9",
                            borderRadius: "6px",
                            border: "1px solid #4caf50"
                          }}>
                            <div style={{ 
                              fontSize: "0.85rem", 
                              color: "#2e7d32",
                              fontWeight: 600,
                              marginBottom: "0.5rem"
                            }}>
                              Your Recording:
                            </div>
                            <div style={{ color: "#1a1a1a" }}>
                              {recordedText}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 2: Sentence Builds */}
                {section === 2 && (
                  <>
                    <div style={{
                      fontSize: "1.1rem",
                      color: "#666",
                      marginBottom: "1.5rem"
                    }}>
                      Arrange the words to form a correct sentence:
                    </div>
                    <div style={{ marginBottom: "2rem" }}>
                      {currentContent.words.map((word, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#011024",
                            color: "white",
                            padding: "0.7rem 1.2rem",
                            marginRight: "0.6rem",
                            marginBottom: "0.6rem",
                            borderRadius: "6px",
                            display: "inline-block",
                            fontSize: "1rem",
                            fontWeight: 500,
                            boxShadow: "0 2px 6px rgba(0,82,165,0.2)"
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Type the correct sentence here..."
                      style={{
                        width: "100%",
                        padding: "1rem 1.2rem",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#011024"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </>
                )}

                {/* SECTION 3 & 4: MCQ */}
                {(section === 3 || section === 4) && (
                  <>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        marginBottom: "2rem",
                        color: "#1a1a1a",
                        fontWeight: 500
                      }}
                    >
                      {currentContent.q}
                    </div>
                    
                    {currentContent.options.map((opt, i) => (
                      <button
                        key={i}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "1.1rem 1.5rem",
                          marginBottom: "1rem",
                          background: "#ffffff",
                          border: "2px solid #e0e0e0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          textAlign: "left",
                          transition: "all 0.2s",
                          fontWeight: 500
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = "#011024";
                          e.target.style.background = "#f5f9ff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.background = "#ffffff";
                        }}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </>
                )}

                {/* SECTION 5: Short Answer - Audio prompt with recording */}
                {section === 5 && (
                  <div>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        marginBottom: "2rem",
                        color: "#1a1a1a",
                        padding: "1.5rem",
                        background: "#f9f9f9",
                        borderLeft: "4px solid #011024",
                        borderRadius: "6px",
                        lineHeight: "1.6"
                      }}
                    >
                      {currentContent}
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                      <p style={{ 
                        color: "#666", 
                        marginBottom: "1rem",
                        fontSize: "0.95rem"
                      }}>
                        Record your answer (2-3 sentences):
                      </p>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{
                          padding: "1rem 2.5rem",
                          background: isRecording ? "#dc2626" : "#FDB913",
                          color: isRecording ? "#ffffff" : "#1a1a1a",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                      >
                        <Mic size={20} />
                        {isRecording ? "Recording..." : "Start Recording"}
                      </button>

                      {recordedText && (
                        <div style={{
                          marginTop: "1.5rem",
                          padding: "1rem",
                          background: "#e8f5e9",
                          borderRadius: "6px",
                          border: "1px solid #4caf50"
                        }}>
                          <div style={{ 
                            fontSize: "0.85rem", 
                            color: "#2e7d32",
                            fontWeight: 600,
                            marginBottom: "0.5rem"
                          }}>
                            Your Recording:
                          </div>
                          <div style={{ color: "#1a1a1a" }}>
                            {recordedText}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SECTION 6: Typing */}
                {section === 6 && (
                  <>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        marginBottom: "1.5rem",
                        color: "#666"
                      }}
                    >
                      Type the following passage accurately:
                    </div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        marginBottom: "2rem",
                        color: "#1a1a1a",
                        padding: "1.5rem",
                        background: "#f9f9f9",
                        borderRadius: "6px",
                        lineHeight: "1.8"
                      }}
                    >
                      {currentContent.replace("Type this passage accurately: ", "")}
                    </div>
                    <textarea
                      rows="6"
                      placeholder="Start typing here..."
                      style={{
                        width: "100%",
                        padding: "1rem 1.2rem",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        outline: "none",
                        resize: "vertical",
                        lineHeight: "1.6"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#0052A5"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </>
                )}

                {/* NEXT BUTTON */}
                <div style={{ marginTop: "3rem", textAlign: "right" }}>
                  <button
                    onClick={handleNext}
                    style={{
                      padding: "1rem 3rem",
                      background: "#FDB913",
                      color: "#1a1a1a",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "1.05rem",
                      boxShadow: "0 4px 12px rgba(253,185,19,0.3)",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(253,185,19,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 12px rgba(253,185,19,0.3)";
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "4rem 2rem" }}
            >
              <div style={{
                background: "#ffffff",
                padding: "3rem",
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                maxWidth: "500px",
                margin: "auto"
              }}>
                <CheckCircle size={64} color="#4caf50" style={{ marginBottom: "1.5rem" }} />
                <h2 style={{ 
                  color: "#1a1a1a",
                  marginBottom: "1rem",
                  fontSize: "2rem"
                }}>
                  Test Completed!
                </h2>
                <p style={{ color: "#666", marginBottom: "2rem" }}>
                  Your responses have been recorded successfully.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: "1rem",
                    padding: "1rem 2.5rem",
                    background: "#011024",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "#011024"
                  }}
                >
                  <RefreshCw size={20} /> Restart Test
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VersantTest;