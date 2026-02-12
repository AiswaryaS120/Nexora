import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain, MessageSquare, ChevronRight, CheckCircle } from 'lucide-react';

function InterviewPrep() {
  const [selectedTopic, setSelectedTopic] = useState('javascript');
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

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
        answer: 'A closure is a function that has access to variables in its outer (enclosing) function scope, even after the outer function has returned.'
      },
      {
        question: 'What is the difference between let, const, and var?',
        difficulty: 'Easy',
        answer: 'var is function-scoped, let and const are block-scoped. const cannot be reassigned.'
      },
      {
        question: 'Explain event delegation in JavaScript',
        difficulty: 'Medium',
        answer: 'Event delegation uses event bubbling to handle events at a higher level in the DOM than the element on which the event originated.'
      },
      {
        question: 'What are Promises and how do they work?',
        difficulty: 'Medium',
        answer: 'Promises are objects representing the eventual completion or failure of an asynchronous operation.'
      },
      {
        question: 'Explain the JavaScript Event Loop',
        difficulty: 'Hard',
        answer: 'The event loop is a mechanism that handles asynchronous callbacks by moving them from the callback queue to the call stack when the stack is empty.'
      }
    ],
    react: [
      {
        question: 'What are React Hooks? Explain useState and useEffect',
        difficulty: 'Medium',
        answer: 'Hooks are functions that let you use state and other React features in functional components.'
      },
      {
        question: 'What is the Virtual DOM and how does it work?',
        difficulty: 'Medium',
        answer: 'Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering by calculating the minimum changes needed.'
      },
      {
        question: 'Explain the difference between state and props',
        difficulty: 'Easy',
        answer: 'Props are passed from parent to child and are immutable. State is managed within a component and can be changed.'
      },
      {
        question: 'What are Higher Order Components (HOCs)?',
        difficulty: 'Hard',
        answer: 'HOCs are functions that take a component and return a new component with additional props or behavior.'
      },
      {
        question: 'Explain React Context API',
        difficulty: 'Medium',
        answer: 'Context provides a way to pass data through the component tree without having to pass props down manually at every level.'
      }
    ],
    python: [
      {
        question: 'Explain list comprehensions in Python',
        difficulty: 'Medium',
        answer: 'List comprehensions provide a concise way to create lists: [x*2 for x in range(10)]'
      },
      {
        question: 'What are decorators in Python?',
        difficulty: 'Hard',
        answer: 'Decorators are functions that modify the behavior of other functions or methods.'
      },
      {
        question: 'Difference between list and tuple',
        difficulty: 'Easy',
        answer: 'Lists are mutable (can be changed), tuples are immutable (cannot be changed).'
      },
      {
        question: 'Explain generators in Python',
        difficulty: 'Medium',
        answer: 'Generators are functions that return an iterator using yield, allowing lazy evaluation.'
      },
      {
        question: 'What is the Global Interpreter Lock (GIL)?',
        difficulty: 'Hard',
        answer: 'GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode at once.'
      }
    ],
    dsa: [
      {
        question: 'Implement binary search algorithm',
        difficulty: 'Medium',
        answer: 'Binary search divides the search space in half each iteration, requiring O(log n) time.'
      },
      {
        question: 'Reverse a linked list',
        difficulty: 'Easy',
        answer: 'Iterate through the list, reversing the pointers as you go.'
      },
      {
        question: 'Detect cycle in a linked list',
        difficulty: 'Medium',
        answer: 'Use Floyd\'s cycle detection algorithm (tortoise and hare).'
      },
      {
        question: 'Find the longest common subsequence',
        difficulty: 'Hard',
        answer: 'Use dynamic programming with a 2D table to build up the solution.'
      },
      {
        question: 'Implement merge sort',
        difficulty: 'Medium',
        answer: 'Divide array into halves, recursively sort them, then merge the sorted halves.'
      }
    ],
    aptitude: [
      {
        question: 'A can complete work in 10 days, B in 15 days. In how many days can they complete it together?',
        difficulty: 'Easy',
        answer: '6 days. Combined rate: 1/10 + 1/15 = 1/6'
      },
      {
        question: 'Find the probability of getting a sum of 7 when rolling two dice',
        difficulty: 'Medium',
        answer: '6/36 = 1/6. There are 6 ways to get 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)'
      },
      {
        question: 'How many ways can you arrange 5 people in a row?',
        difficulty: 'Easy',
        answer: '5! = 120 ways'
      },
      {
        question: 'A train travels 60 km/h for 2 hours, then 80 km/h for 3 hours. Find average speed.',
        difficulty: 'Medium',
        answer: 'Total distance / Total time = (120+240)/5 = 72 km/h'
      },
      {
        question: 'If profit is 20% of cost price, what is profit percentage of selling price?',
        difficulty: 'Hard',
        answer: '16.67%. If CP=100, profit=20, SP=120. Profit% of SP = 20/120 × 100'
      }
    ],
    behavioral: [
      {
        question: 'Tell me about yourself',
        difficulty: 'Easy',
        answer: 'Structure: Present (current role/study), Past (relevant experience), Future (career goals)'
      },
      {
        question: 'Describe a challenging project you worked on',
        difficulty: 'Medium',
        answer: 'Use STAR method: Situation, Task, Action, Result'
      },
      {
        question: 'How do you handle conflicts in a team?',
        difficulty: 'Medium',
        answer: 'Focus on communication, understanding perspectives, finding common ground'
      },
      {
        question: 'Where do you see yourself in 5 years?',
        difficulty: 'Easy',
        answer: 'Show growth mindset, alignment with company, realistic progression'
      },
      {
        question: 'Describe a time you failed and what you learned',
        difficulty: 'Hard',
        answer: 'Be honest, show reflection, emphasize learning and improvement'
      }
    ]
  };

  const toggleComplete = (index) => {
    const key = `${selectedTopic}-${index}`;
    setCompletedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const currentQuestions = questionBank[selectedTopic] || [];
  const completedCount = currentQuestions.filter((_, i) => 
    completedQuestions.has(`${selectedTopic}-${i}`)
  ).length;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'Hard': return 'var(--danger)';
      default: return 'var(--gray)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="interview-prep"
    >
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen size={32} />
          Interview Preparation
        </h1>
        <p className="page-subtitle">Practice common interview questions by topic</p>
      </div>

      <div className="grid grid-2">
        {/* Topics Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Topic</h2>
          </div>

          <div className="grid gap-2">
            {topics.map((topic) => (
              <motion.button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`card ${selectedTopic === topic.id ? 'active' : ''}`}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: selectedTopic === topic.id ? `2px solid ${topic.color}` : 'none',
                  background: selectedTopic === topic.id ? 
                    `linear-gradient(135deg, ${topic.color}15, ${topic.color}05)` : 
                    'white'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-between">
                  <div className="flex gap-2" style={{ alignItems: 'center' }}>
                    <topic.icon size={24} style={{ color: topic.color }} />
                    <span style={{ fontWeight: 600 }}>{topic.name}</span>
                  </div>
                  <ChevronRight 
                    size={20} 
                    style={{ 
                      color: selectedTopic === topic.id ? topic.color : 'var(--gray)',
                      opacity: selectedTopic === topic.id ? 1 : 0.3
                    }} 
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="card">
          <div className="card-header">
            <div className="flex-between">
              <h2 className="card-title">
                {topics.find(t => t.id === selectedTopic)?.name} Questions
              </h2>
              <span className="badge badge-success">
                {completedCount}/{currentQuestions.length} completed
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            {currentQuestions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
                style={{ padding: '1rem' }}
              >
                <div className="flex-between mb-2">
                  <div className="flex gap-2" style={{ alignItems: 'center', flex: 1 }}>
                    <button
                      onClick={() => toggleComplete(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <CheckCircle
                        size={24}
                        style={{
                          color: completedQuestions.has(`${selectedTopic}-${index}`) ? 
                            'var(--success)' : 
                            'var(--gray-light)',
                          fill: completedQuestions.has(`${selectedTopic}-${index}`) ? 
                            'var(--success)' : 
                            'transparent'
                        }}
                      />
                    </button>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                        {q.question}
                      </h4>
                      <span 
                        className="badge"
                        style={{
                          background: `${getDifficultyColor(q.difficulty)}15`,
                          color: getDifficultyColor(q.difficulty)
                        }}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    color: 'var(--primary)',
                    userSelect: 'none'
                  }}>
                    Show Answer
                  </summary>
                  <p style={{ 
                    marginTop: '0.75rem', 
                    padding: '0.75rem', 
                    background: 'var(--gray-light)', 
                    borderRadius: '0.5rem',
                    color: 'var(--dark)'
                  }}>
                    {q.answer}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InterviewPrep;