import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mic, Volume2, Type, CheckCircle, ArrowRight, RefreshCw, Play, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VersantTest() {
  const navigate = useNavigate();

  const [section, setSection] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [scores, setScores] = useState({
    reading: 0,
    repeat: 0,
    builds: 0,
    vocab: 0,
    completion: 0,
    shortAnswer: 0,
    typing: 0
  });
  const [timer, setTimer] = useState(15 * 60);
  const [showResult, setShowResult] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const sections = [
    { name: 'Reading Aloud', icon: Volume2, color: '#e8c441' },
    { name: 'Repeat Sentences', icon: Mic, color: '#e8c441' },
    { name: 'Sentence Builds', icon: CheckCircle, color: '#e8c441' },
    { name: 'Vocabulary', icon: Type, color: '#e8c441' },
    { name: 'Sentence Completion', icon: ArrowRight, color: '#e8c441' },
    { name: 'Short Answer Questions', icon: Mic, color: '#e8c441' },
    { name: 'Typing', icon: Type, color: '#e8c441' }
  ];

  const sectionData = {
    0: [
      "The sun rises in the east every morning.",
      "Technology is changing our lives rapidly.",
      "Consistency leads to success in any field."
    ],
    1: [
      "Innovation drives progress in the modern world.",
      "Practice daily to master new skills.",
      "HireHub prepares students for better careers."
    ],
    2: [
      { words: ["Delhi", "is", "the", "capital", "of", "India"], correct: "Delhi is the capital of India" },
      { words: ["The", "moon", "revolves", "around", "the", "earth"], correct: "The moon revolves around the earth" }
    ],
    3: [
      { q: "Synonym of 'Vivid'", options: ["Dull", "Bright", "Boring", "Faint"], correct: 1 },
      { q: "Antonym of 'Abundant'", options: ["Plentiful", "Scarce", "Enough", "Rich"], correct: 1 }
    ],
    4: [
      { q: "The capital of France is ___.", options: ["Paris", "London", "Berlin", "Madrid"], correct: 0 },
      { q: "Water boils at ___ degrees Celsius.", options: ["0", "50", "100", "212"], correct: 2 }
    ],
    5: [
      "Describe your favorite food in 2-3 sentences.",
      "Explain why learning English is important."
    ],
    6: "Type this passage accurately and quickly: Effective communication is a key skill for success in interviews and workplaces. HireHub helps you build confidence through practice."
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      recognitionRef.current = rec;
    } else {
      toast.error('Speech recognition not supported in this browser');
    }

    // Timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const speakText = (text) => {
    if (synthRef.current && !isPlaying) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const startRecording = () => {
    const recognition = recognitionRef.current;
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
      
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim();
        setUserResponses(prev => ({ ...prev, [`${section}-${currentItem}`]: transcript }));
        setIsRecording(false);
        toast.success('✓ Response captured!');
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
        toast.error('Recording failed. Please try again.');
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleInputChange = (e) => {
    setUserResponses(prev => ({ ...prev, [`${section}-${currentItem}`]: e.target.value }));
  };

  const handleOptionSelect = (optionIndex) => {
    setUserResponses(prev => ({ ...prev, [`${section}-${currentItem}`]: optionIndex }));
  };

  const submitSection = () => {
    const key = `${section}-${currentItem}`;
    const response = userResponses[key];
    const currentData = Array.isArray(sectionData[section]) ? sectionData[section][currentItem] : sectionData[section];
    
    let points = 0;
    if (typeof response === 'string' && response.trim()) {
      points = 5;
    } else if (typeof response === 'number') {
      if (section === 3 || section === 4) {
        points = response === currentData.correct ? 10 : 0;
      }
    }

    const scoreKeys = ['reading', 'repeat', 'builds', 'vocab', 'completion', 'shortAnswer', 'typing'];
    setScores(prev => ({ ...prev, [scoreKeys[section]]: prev[scoreKeys[section]] + points }));

    const maxItems = Array.isArray(sectionData[section]) ? sectionData[section].length : 1;
    
    if (currentItem < maxItems - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      if (section < sections.length - 1) {
        setSection(section + 1);
        setCurrentItem(0);
      } else {
        setShowResult(true);
      }
    }
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((a, b) => a + b, 0);
  };

  const getTips = () => {
    const total = calculateTotalScore();
    if (total >= 55) return "Outstanding performance! You're ready for real Versant interviews.";
    if (total >= 40) return "Strong showing. Work on fluency and vocabulary for better scores.";
    if (total >= 25) return "Good effort. Practice speaking daily and focus on clear pronunciation.";
    return "Keep practicing — record yourself and compare with native speakers.";
  };

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const getCurrentContent = () => {
    const data = sectionData[section];
    if (Array.isArray(data)) return data[currentItem];
    return data;
  };

  const currentContent = getCurrentContent();

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Consistent blue top bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: '#011024',
        color: '#e8c441',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        fontWeight: 600,
        fontSize: '1.15rem'
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#e8c441',
            fontSize: '1.15rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Spacer */}
      <div style={{ height: '70px' }} />

      <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          color: '#011024',
          fontSize: '2.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Versant English Proficiency Test
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          15 minutes • 7 sections • AI-scored simulation
        </p>

        {/* Timer */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            background: '#011024',
            color: '#e8c441',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '2rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            {formatTime()}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e8c441'
              }}
            >
              {/* Section Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: '#011024',
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  margin: 0
                }}>
                  {React.createElement(sections[section].icon, { size: 32, color: '#e8c441' })}
                  {sections[section].name}
                </h2>

                <span style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Question {currentItem + 1} of{' '}
                  {Array.isArray(sectionData[section]) ? sectionData[section].length : 1}
                </span>
              </div>

              {/* Reading Aloud */}
              {section === 0 && (
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Read this sentence aloud clearly:
                  </p>
                  <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    color: '#011024',
                    marginBottom: '2rem'
                  }}>
                    {currentContent}
                  </div>
                </div>
              )}

              {/* Repeat Sentences */}
              {section === 1 && (
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Listen carefully and repeat the sentence exactly:
                  </p>
                  <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => speakText(currentContent)}
                        disabled={isPlaying}
                        style={{
                          padding: '1rem 2rem',
                          background: '#011024',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: 600,
                          cursor: isPlaying ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem',
                          margin: '0 auto 1.5rem'
                        }}
                      >
                        {isPlaying ? <Square size={20} /> : <Play size={20} />}
                        {isPlaying ? 'Playing...' : 'Play Audio'}
                      </button>

                      {userResponses[`${section}-${currentItem}`] && (
                        <div style={{
                          marginTop: '1.5rem',
                          padding: '1rem',
                          background: '#f1f5f9',
                          borderRadius: '8px',
                          border: '1px solid #e8c441'
                        }}>
                          <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            Your response:
                          </p>
                          <p style={{ color: '#011024', fontWeight: 500 }}>
                            {userResponses[`${section}-${currentItem}`]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sentence Builds */}
              {section === 2 && (
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Arrange these words to form a correct sentence:
                  </p>
                  <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.8rem',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      {currentContent.words.map((word, i) => (
                        <span key={i} style={{
                          padding: '0.75rem 1.25rem',
                          background: '#011024',
                          color: 'white',
                          borderRadius: '8px',
                          fontWeight: 500
                        }}>
                          {word}
                        </span>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={userResponses[`${section}-${currentItem}`] || ''}
                      onChange={handleInputChange}
                      placeholder="Type the correct sentence here..."
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'white',
                        border: '2px solid #e8c441',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        color: '#011024'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Vocab & Sentence Completion */}
              {(section === 3 || section === 4) && (
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Select the correct answer:
                  </p>
                  <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                  }}>
                    <p style={{
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      color: '#011024',
                      textAlign: 'center',
                      marginBottom: '2rem'
                    }}>
                      {currentContent.q}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '1rem'
                    }}>
                      {currentContent.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(index)}
                          style={{
                            padding: '1rem',
                            background: userResponses[`${section}-${currentItem}`] === index
                              ? '#e8c441'
                              : '#f1f5f9',
                            color: userResponses[`${section}-${currentItem}`] === index
                              ? '#011024'
                              : '#374151',
                            border: '2px solid #e8c441',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Short Answer */}
              {section === 5 && (
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Listen to the question and answer by speaking:
                  </p>
                  <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => speakText(currentContent)}
                        disabled={isPlaying}
                        style={{
                          padding: '1rem 2rem',
                          background: '#011024',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: 600,
                          cursor: isPlaying ? 'not-allowed' : 'pointer',
                          marginBottom: '1.5rem'
                        }}
                      >
                        {isPlaying ? <Square size={20} /> : <Play size={20} />}
                        {isPlaying ? 'Playing...' : 'Hear Question'}
                      </button>

                      {userResponses[`${section}-${currentItem}`] && (
                        <div style={{
                          padding: '1rem',
                          background: '#f1f5f9',
                          borderRadius: '8px',
                          border: '1px solid #e8c441'
                        }}>
                          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Your answer:</p>
                          <p style={{ color: '#011024', fontWeight: 500 }}>
                            {userResponses[`${section}-${currentItem}`]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Typing */}
              {section === 6 && (
                <div>
                  <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Type this passage accurately:
                  </p>
                  <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ fontSize: '1.2rem', color: '#011024', lineHeight: 1.6 }}>
                      {currentContent}
                    </p>
                  </div>

                  <textarea
                    value={userResponses[`${section}-${currentItem}`] || ''}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Start typing here..."
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'white',
                      border: '2px solid #e8c441',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      color: '#011024',
                      resize: 'vertical'
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.5rem',
                marginTop: '2.5rem'
              }}>
                {(section === 0 || section === 1 || section === 5) && (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    style={{
                      padding: '1rem 2rem',
                      background: isRecording ? '#dc2626' : '#011024',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Mic size={20} />
                    {isRecording ? 'Stop Recording' : 'Start Speaking'}
                  </button>
                )}

                <button
                  onClick={submitSection}
                  style={{
                    padding: '1rem 2.5rem',
                    background: '#011024',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <CheckCircle size={20} />
                  {currentItem < (Array.isArray(sectionData[section]) ? sectionData[section].length : 1) - 1
                    ? 'Next Question'
                    : section < sections.length - 1
                    ? 'Next Section'
                    : 'Finish Test'}
                </button>
              </div>

              {/* Progress */}
              <div style={{ marginTop: '3rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  color: '#6b7280'
                }}>
                  <span>Section {section + 1} of {sections.length}</span>
                  <span>
                    {Math.round(((section + currentItem / 10) / sections.length) * 100)}% Complete
                  </span>
                </div>
                <div style={{
                  height: '10px',
                  background: '#e5e7eb',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${((section + currentItem / 10) / sections.length) * 100}%`,
                    background: '#e8c441',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '3rem 2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid #e8c441',
                textAlign: 'center'
              }}
            >
              <h2 style={{
                color: '#011024',
                fontSize: '3rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}>
                Test Completed!
              </h2>

              <div style={{
                fontSize: '4.5rem',
                fontWeight: 800,
                color: '#011024',
                marginBottom: '1rem'
              }}>
                {calculateTotalScore()} / 70
              </div>

              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#e8c441',
                marginBottom: '2rem'
              }}>
                {Math.round((calculateTotalScore() / 70) * 100)}%
              </div>

              <p style={{
                color: '#4b5563',
                fontSize: '1.3rem',
                marginBottom: '2.5rem',
                lineHeight: 1.5
              }}>
                {getTips()}
              </p>

              <button
                onClick={() => {
                  setSection(0);
                  setCurrentItem(0);
                  setTimer(15 * 60);
                  setShowResult(false);
                  setUserResponses({});
                  setScores({
                    reading: 0,
                    repeat: 0,
                    builds: 0,
                    vocab: 0,
                    completion: 0,
                    shortAnswer: 0,
                    typing: 0
                  });
                }}
                style={{
                  padding: '1.2rem 3rem',
                  background: '#011024',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}
              >
                <RefreshCw size={24} />
                Restart Test
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}