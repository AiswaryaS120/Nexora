import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  Brain,
  MessageSquare,
  CheckCircle,
  Mic,
  Square,
  RefreshCw
} from 'lucide-react';

function InterviewPrep() {
  const [selectedTopic, setSelectedTopic] = useState('javascript');
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [practiceMode, setPracticeMode] = useState(false);
  const [recordingStates, setRecordingStates] = useState({});
  const mediaRecorderRefs = useRef({});

  useEffect(() => {
    const saved = localStorage.getItem('interviewPrepCompleted');
    if (saved) setCompletedQuestions(new Set(JSON.parse(saved)));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'interviewPrepCompleted',
      JSON.stringify([...completedQuestions])
    );
  }, [completedQuestions]);

  const topics = [
    { id: 'javascript', name: 'JavaScript', icon: Code, color: '#f7df1e' },
    { id: 'react', name: 'React', icon: Code, color: '#61dafb' },
    { id: 'python', name: 'Python', icon: Code, color: '#3776ab' },
    { id: 'dsa', name: 'DSA', icon: Brain, color: '#ff6b6b' },
    { id: 'aptitude', name: 'Aptitude', icon: Brain, color: '#4ecdc4' },
    { id: 'behavioral', name: 'Behavioral', icon: MessageSquare, color: '#95e1d3' }
  ];

  const questionBank = {
    javascript: [
      {
        question: 'Explain closures in JavaScript with an example',
        difficulty: 'Medium',
        answer: 'A closure is a function that has access to variables in its outer (enclosing) function scope, even after the outer function has returned. Example: function outer() { let count = 0; return function inner() { count++; return count; }; } const counter = outer(); console.log(counter()); // 1'
      },
      {
        question: 'What is the difference between let, const, and var?',
        difficulty: 'Easy',
        answer: 'var is function-scoped and can be re-declared. let and const are block-scoped. const cannot be reassigned (but object properties can change). var is hoisted with undefined, let/const are hoisted but in TDZ.'
      },
      {
        question: 'Explain event delegation in JavaScript',
        difficulty: 'Medium',
        answer: 'Event delegation attaches a single event listener to a parent element instead of multiple listeners on children. It uses event bubbling to handle events efficiently. Example: document.querySelector("ul").addEventListener("click", (e) => { if (e.target.tagName === "LI") { ... } });'
      },
      {
        question: 'What are Promises and how do they handle async code?',
        difficulty: 'Medium',
        answer: 'Promises represent eventual completion/failure of async operations. They have .then(), .catch(), .finally(). Modern code prefers async/await on top of promises. Example: fetch(url).then(res => res.json()).catch(err => console.error(err));'
      },
      {
        question: 'Explain the Event Loop, Call Stack, Task Queue',
        difficulty: 'Hard',
        answer: 'Call Stack executes synchronous code. Async callbacks go to Web APIs → Task Queue (or Microtask Queue for promises). Event Loop pushes tasks from queue to stack when stack is empty. Microtasks (promises) run before macrotasks (setTimeout).'
      },
      {
        question: 'What is hoisting in JavaScript?',
        difficulty: 'Medium',
        answer: 'Hoisting moves variable and function declarations to the top of their scope during compilation. Only declarations are hoisted, not initializations. var is hoisted with undefined, functions fully hoisted.'
      }
    ],

    react: [
      {
        question: 'What are React Hooks? Explain useState and useEffect',
        difficulty: 'Medium',
        answer: 'Hooks let you use state and lifecycle features in functional components. useState returns [value, setter]. useEffect runs side effects after render — can replace componentDidMount/Update/Unmount. Cleanup function returned from useEffect runs before next run or unmount.'
      },
      {
        question: 'What is the Virtual DOM and how does reconciliation work?',
        difficulty: 'Medium',
        answer: 'Virtual DOM is a lightweight in-memory representation of real DOM. React computes diff (reconciliation) between old & new VDOM, then applies only minimal changes to real DOM for better performance.'
      },
      {
        question: 'Explain the difference between state and props',
        difficulty: 'Easy',
        answer: 'Props are read-only data passed from parent to child. State is internal, mutable data managed by the component itself (via useState/setState). Changing state triggers re-render.'
      },
      {
        question: 'What is prop drilling and how to avoid it?',
        difficulty: 'Medium',
        answer: 'Prop drilling = passing props through many levels of components. Avoid using Context API, Redux, Zustand, or component composition (children as prop).'
      },
      {
        question: 'Explain React.memo, useMemo, useCallback',
        difficulty: 'Hard',
        answer: 'React.memo prevents re-render if props shallow equal. useMemo memoizes expensive calculations. useCallback memoizes functions to prevent unnecessary child re-renders when passed as props.'
      }
    ],

    python: [
      {
        question: 'Explain list comprehensions with examples',
        difficulty: 'Medium',
        answer: 'Concise way to create lists. [x**2 for x in range(10) if x % 2 == 0] → squares of even numbers. Can include if/else: ["even" if x%2==0 else "odd" for x in range(5)]'
      },
      {
        question: 'What are decorators in Python? Give example',
        difficulty: 'Hard',
        answer: 'Functions that modify other functions/methods. @decorator def func(): ... Example: def timer(func): def wrapper(*args): start = time.time(); res = func(*args); print(time.time()-start); return res; return wrapper'
      },
      {
        question: 'Difference between list and tuple',
        difficulty: 'Easy',
        answer: 'Lists are mutable [1,2,3]; can append/change. Tuples are immutable (1,2,3); faster, hashable (can be dict keys).'
      },
      {
        question: 'What are generators and the yield keyword?',
        difficulty: 'Medium',
        answer: 'Generators produce values lazily using yield. They pause/resume execution. def gen(): yield 1; yield 2; for i in gen(): print(i)'
      },
      {
        question: 'Explain *args and **kwargs',
        difficulty: 'Medium',
        answer: '*args collects positional arguments into tuple. **kwargs collects keyword arguments into dict. def func(*args, **kwargs): print(args, kwargs)'
      }
    ],

    dsa: [
      {
        question: 'Explain binary search and its time complexity',
        difficulty: 'Medium',
        answer: 'Finds element in sorted array by repeatedly dividing search interval in half. O(log n) time. Requires sorted input.'
      },
      {
        question: 'Reverse a singly linked list',
        difficulty: 'Easy',
        answer: 'Iterate, keep prev pointer, reverse next pointers. Three pointers: prev, curr, next. Time O(n), Space O(1).'
      },
      {
        question: 'Detect cycle in linked list (Floyd’s algorithm)',
        difficulty: 'Medium',
        answer: 'Tortoise & hare: slow moves 1, fast moves 2. If they meet → cycle exists. Then reset slow to head, move both 1 step → meet at cycle start.'
      },
      {
        question: 'Implement merge sort (explain steps)',
        difficulty: 'Medium',
        answer: 'Divide array into two halves recursively → sort halves → merge sorted halves by comparing elements. O(n log n) time, O(n) space.'
      },
      {
        question: 'Find two numbers that add up to target (Two Sum)',
        difficulty: 'Easy',
        answer: 'Use hashmap: for each num, check if target-num exists in map. Add num → index. O(n) time, O(n) space.'
      }
    ],

    aptitude: [
      {
        question: 'A can do a work in 12 days, B in 18 days. Together how many days?',
        difficulty: 'Easy',
        answer: '1/12 + 1/18 = 5/36 → 36/5 = 7.2 days'
      },
      {
        question: 'Probability of getting sum 8 with two dice',
        difficulty: 'Medium',
        answer: 'Total outcomes 36. Favorable: (2,6)(3,5)(4,4)(5,3)(6,2) → 5 ways → 5/36'
      },
      {
        question: 'Number of ways to arrange 6 people in a circle',
        difficulty: 'Medium',
        answer: '(6-1)! = 5! = 120 (rotations considered same)'
      },
      {
        question: 'Train 150m long crosses a pole in 5 sec. Speed?',
        difficulty: 'Easy',
        answer: 'Speed = distance/time = 150 m / 5 s = 30 m/s = 108 km/h'
      },
      {
        question: 'If CP = ₹800, SP = ₹1000, profit % on SP?',
        difficulty: 'Hard',
        answer: 'Profit = 200, % on SP = (200/1000)×100 = 20%'
      }
    ],

    behavioral: [
      {
        question: 'Tell me about yourself',
        difficulty: 'Easy',
        answer: 'Keep it professional: current role/study → relevant experience → why this role/company → enthusiasm. 1–2 minutes max.'
      },
      {
        question: 'Describe a challenging project and how you handled it',
        difficulty: 'Medium',
        answer: 'Use STAR: Situation → Task → Action (your contribution) → Result (quantify if possible). Focus on problem-solving & teamwork.'
      },
      {
        question: 'How do you handle conflict in a team?',
        difficulty: 'Medium',
        answer: 'Listen to both sides → understand perspectives → find common goal → propose solution → follow up. Stay calm and professional.'
      },
      {
        question: 'Where do you see yourself in 5 years?',
        difficulty: 'Easy',
        answer: 'Show ambition aligned with company: growing in role → taking more responsibility → contributing to bigger goals. Avoid specific job titles.'
      },
      {
        question: 'Tell me about a time you failed and what you learned',
        difficulty: 'Hard',
        answer: 'Be honest but positive. Describe failure → what went wrong → actions taken → lessons → how you improved since then.'
      }
    ]
  };
  const currentQuestions = questionBank[selectedTopic] || [];

  const startRecording = async (index) => {
    const key = `${selectedTopic}-${index}`;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRefs.current[key] = mediaRecorder;

    const chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setRecordingStates(prev => ({
        ...prev,
        [key]: { isRecording: false, audioUrl: url }
      }));
    };

    mediaRecorder.start();
    setRecordingStates(prev => ({
      ...prev,
      [key]: { isRecording: true, audioUrl: null }
    }));
  };

  const stopRecording = (index) => {
    const key = `${selectedTopic}-${index}`;
    const recorder = mediaRecorderRefs.current[key];
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  };

  const clearRecording = (index) => {
    const key = `${selectedTopic}-${index}`;
    setRecordingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* TOP HEADER */}
      <div style={{
        background: '#011024',
        color: '#e8c441',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        <BookOpen size={24} style={{ marginRight: '10px' }} />
        Interview Preparation
      </div>

      {/* MODE TOGGLE */}
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <button
          onClick={() => setPracticeMode(false)}
          style={{
            marginRight: '1rem',
            padding: '0.6rem 1.2rem',
            background: !practiceMode ? '#011024' : 'white',
            color: !practiceMode ? 'white' : '#011024',
            border: '2px solid #011024',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          📖 Read Mode
        </button>

        <button
          onClick={() => setPracticeMode(true)}
          style={{
            padding: '0.6rem 1.2rem',
            background: practiceMode ? '#e8c441' : 'white',
            color: practiceMode ? '#011024' : '#e8c441',
            border: '2px solid #e8c441',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          🎤 Practice Mode
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '2rem'
      }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: '250px',
          background: '#011024',
          borderRadius: '10px',
          padding: '1rem',
          color: 'white'
        }}>
          {topics.map(topic => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              style={{
                padding: '0.8rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                borderRadius: '6px',
                background: selectedTopic === topic.id ? '#e8c441' : 'transparent',
                color: selectedTopic === topic.id ? '#011024' : 'white',
                fontWeight: '600'
              }}
            >
              {topic.name}
            </div>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1 }}>

          {currentQuestions.map((q, index) => {
            const key = `${selectedTopic}-${index}`;
            const recState = recordingStates[key] || {};

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                  border: '2px solid #e8c441'
                }}
              >
                <h3 style={{ color: '#011024' }}>{q.question}</h3>

                {practiceMode ? (
                  <>
                    {!recState.audioUrl ? (
                      <button
                        onClick={() =>
                          recState.isRecording
                            ? stopRecording(index)
                            : startRecording(index)
                        }
                        style={{
                          marginTop: '1rem',
                          padding: '0.6rem 1.2rem',
                          background: recState.isRecording
                            ? '#dc2626'
                            : '#011024',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px'
                        }}
                      >
                        {recState.isRecording
                          ? 'Stop Recording'
                          : 'Start Recording'}
                      </button>
                    ) : (
                      <>
                        <audio controls src={recState.audioUrl} style={{ marginTop: '1rem', width: '100%' }} />
                        <div style={{
                          marginTop: '1rem',
                          background: '#fef9c3',
                          padding: '1rem',
                          borderRadius: '6px'
                        }}>
                          <strong>Suggested Answer:</strong>
                          <p>{q.answer}</p>
                        </div>

                        <button
                          onClick={() => clearRecording(index)}
                          style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px'
                          }}
                        >
                          Re-record
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <details style={{ marginTop: '1rem' }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: '#011024'
                    }}>
                      Show Answer
                    </summary>
                    <p style={{
                      marginTop: '0.5rem',
                      background: '#fef9c3',
                      padding: '0.75rem',
                      borderRadius: '6px'
                    }}>
                      {q.answer}
                    </p>
                  </details>
                )}
              </motion.div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default InterviewPrep;
