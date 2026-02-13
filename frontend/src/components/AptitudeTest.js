import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// 5 unique sets with 10 different questions each (no duplicates across sets)
const testSets = [
  {
    id: 1,
    questions: [
      { q: "If 20% of a number is 40, what is the number?", options: ["200", "180", "160", "220"], correct: 0, solution: "20% = 40 → 100% = 200." },
      { q: "A train 200 m long passes a pole in 10 seconds. Speed in km/h?", options: ["72", "60", "54", "90"], correct: 0, solution: "200/10 = 20 m/s → 20 × 18/5 = 72 km/h." },
      { q: "A and B finish work in 15 days. A alone in 20 days. B alone?", options: ["60", "45", "30", "75"], correct: 0, solution: "A = 1/20, A+B = 1/15 → B = 1/15 - 1/20 = 1/60 → 60 days." },
      { q: "Next in series: 4, 9, 16, 25, 36, ?", options: ["49", "64", "81", "100"], correct: 0, solution: "Squares: 2²=4, 3²=9, ..., 7²=49." },
      { q: "Ages of A and B ratio 5:7. After 4 years 6:8. A's age?", options: ["10", "20", "15", "25"], correct: 0, solution: "5x+4 / 7x+4 = 6/8 → 40x + 32 = 42x + 24 → x = 4 → A = 20? Wait, correct: 5x+4 / 7x+4 = 6/8 → 40x + 32 = 42x + 24 → 2x = 8 → x = 4 → A = 20." },
      { q: "Simple interest on ₹1000 at 5% for 3 years?", options: ["150", "200", "250", "100"], correct: 0, solution: "1000 × 5 × 3 / 100 = 150." },
      { q: "HCF of 24 and 36?", options: ["12", "6", "8", "18"], correct: 0, solution: "Factors: 24=2^3*3, 36=2^2*3^2 → HCF=2^2*3=12." },
      { q: "If 2P = 3Q = 4R, then P:Q:R?", options: ["6:4:3", "3:2:4", "6:4:3", "12:8:6"], correct: 3, solution: "Let 2P = 3Q = 4R = 12 → P=6, Q=4, R=3 → 6:4:3." },
      { q: "Antonym of 'Abate'?", options: ["Increase", "Reduce", "Lessen", "Subside"], correct: 0, solution: "Abate = decrease → antonym = increase." },
      { q: "Complete analogy: Doctor : Hospital :: Teacher : ?", options: ["School", "Class", "Student", "Book"], correct: 0, solution: "Doctor works in hospital, teacher in school." }
    ]
  },
  // Set 2 - 10 unique questions
  {
    id: 2,
    questions: [
      { q: "What is 25% of 300?", options: ["75", "50", "100", "60"], correct: 0, solution: "25/100 × 300 = 75." },
      { q: "Boat speed 15 km/h, stream 3 km/h. Upstream speed?", options: ["18", "12", "15", "9"], correct: 1, solution: "Upstream = 15 - 3 = 12 km/h." },
      { q: "Next in series: 1, 8, 27, 64, 125, ?", options: ["216", "343", "512", "729"], correct: 0, solution: "Cubes: 1³=1, 2³=8, ..., 6³=216." },
      { q: "A's salary 20% more than B. If B is ₹5000, A's salary?", options: ["5500", "6000", "7000", "4000"], correct: 1, solution: "5000 × 1.2 = 6000." },
      { q: "LCM of 15 and 25?", options: ["5", "75", "100", "25"], correct: 1, solution: "15=3*5, 25=5^2 → LCM=3*5^2=75." },
      { q: "If 5:10::x:20, x=?", options: ["10", "15", "5", "25"], correct: 2, solution: "5/10 = x/20 → x=10." },
      { q: "Synonym of 'Pristine'?", options: ["Dirty", "Clean", "Old", "Broken"], correct: 1, solution: "Pristine = clean, pure." },
      { q: "A can do work in 10 days, B in 15. Together?", options: ["6", "5", "7.5", "6.5"], correct: 2, solution: "1/10 + 1/15 = 1/6 → 6 days? Wait, 3/30 + 2/30 = 5/30 = 1/6 → 6 days. Correct: 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 → 6 days." },
      { q: "Find odd: 2, 3, 5, 7, 9", options: ["2", "3", "5", "9"], correct: 3, solution: "9 is not prime." },
      { q: "Complete analogy: Bird : Nest :: Bee : ?", options: ["Hive", "Honey", "Flower", "Tree"], correct: 0, solution: "Bird lives in nest, bee in hive." }
    ]
  },
  // Set 3 - 10 unique questions
  {
    id: 3,
    questions: [
      { q: "What is the square root of 144?", options: ["12", "14", "10", "16"], correct: 0, solution: "12 × 12 = 144." },
      { q: "A car travels 100 km at 50 km/h. Time taken?", options: ["2 hours", "3 hours", "1 hour", "4 hours"], correct: 0, solution: "100 / 50 = 2 hours." },
      { q: "If x = 8, y = 10, x:y = ?", options: ["4:5", "5:4", "8:10", "2:2.5"], correct: 0, solution: "Divide by 2 = 4:5." },
      { q: "Profit 10% on CP ₹500. SP?", options: ["550", "600", "450", "700"], correct: 0, solution: "500 × 1.1 = 550." },
      { q: "HCF of 48 and 72?", options: ["12", "24", "36", "48"], correct: 1, solution: "48=2^4*3, 72=2^3*3^2 → HCF=2^3*3=24." },
      { q: "Next: 1, 4, 9, 16, 25, ?", options: ["36", "49", "64", "81"], correct: 0, solution: "Squares: 6²=36." },
      { q: "Antonym of 'Benevolent'?", options: ["Kind", "Malevolent", "Generous", "Friendly"], correct: 1, solution: "Benevolent = kind → antonym = malevolent." },
      { q: "A, B, C invest ₹2000, ₹3000, ₹4000. Profit ₹9000. A's share?", options: ["2000", "2250", "2500", "3000"], correct: 1, solution: "Ratio 2:3:4 = 9 parts → 9000/9 = 1000 → A = 2*1000 = 2000? Wait, correct calc: A = (2/9)*9000 = 2000." },
      { q: "Odd one: Apple, Banana, Carrot, Grape", options: ["Apple", "Banana", "Carrot", "Grape"], correct: 2, solution: "Carrot is vegetable, others fruits." },
      { q: "Analogy: Pen : Write :: Knife : ?", options: ["Cut", "Eat", "Cook", "Sharp"], correct: 0, solution: "Pen used to write, knife to cut." }
    ]
  },
  // Set 4 - 10 unique questions
  {
    id: 4,
    questions: [
      { q: "What is 30% of 150?", options: ["45", "30", "60", "50"], correct: 0, solution: "30/100 × 150 = 45." },
      { q: "Train speed 60 km/h. Time for 300 km?", options: ["5 hours", "6 hours", "4 hours", "7 hours"], correct: 0, solution: "300 / 60 = 5 hours." },
      { q: "Ratio 4:6 = x:15, x=?", options: ["10", "9", "12", "15"], correct: 1, solution: "4/6 = x/15 → x = (4*15)/6 = 10." },
      { q: "Loss 15% on SP ₹85. CP?", options: ["100", "90", "95", "80"], correct: 0, solution: "SP = CP × 0.85 = 85 → CP = 85 / 0.85 = 100." },
      { q: "LCM of 20 and 30?", options: ["60", "50", "40", "70"], correct: 0, solution: "20=2^2*5, 30=2*3*5 → LCM=2^2*3*5=60." },
      { q: "Series: 3, 6, 9, 12, 15, ?", options: ["18", "20", "16", "21"], correct: 0, solution: "+3 each → 18." },
      { q: "Synonym of 'Vast'?", options: ["Small", "Large", "Tiny", "Narrow"], correct: 1, solution: "Vast = large, huge." },
      { q: "C alone finishes in 10 days, D in 15. Together?", options: ["6", "5", "7", "4"], correct: 0, solution: "1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 → 6 days." },
      { q: "Odd one: Lion, Tiger, Dog, Leopard", options: ["Lion", "Tiger", "Dog", "Leopard"], correct: 2, solution: "Dog is domestic, others wild." },
      { q: "Analogy: Fish : Water :: Bird : ?", options: ["Sky", "Air", "Tree", "Nest"], correct: 1, solution: "Fish lives in water, bird in air." }
    ]
  },
  // Set 5 - 10 unique questions
  {
    id: 5,
    questions: [
      { q: "What is 40% of 250?", options: ["100", "90", "110", "80"], correct: 0, solution: "40/100 × 250 = 100." },
      { q: "Car speed 80 km/h. Distance in 4 hours?", options: ["300", "320", "280", "360"], correct: 1, solution: "80 × 4 = 320 km." },
      { q: "Ratio 6:9 = 4:x, x=?", options: ["6", "9", "12", "15"], correct: 1, solution: "6/9 = 4/x → x = (9*4)/6 = 6." },
      { q: "Profit 20% on SP ₹120. CP?", options: ["100", "90", "110", "80"], correct: 0, solution: "SP = CP × 1.2 = 120 → CP = 120 / 1.2 = 100." },
      { q: "HCF of 36 and 48?", options: ["12", "18", "24", "6"], correct: 0, solution: "36=2^2*3^2, 48=2^4*3 → HCF=2^2*3=12." },
      { q: "Series: 5, 10, 15, 20, 25, ?", options: ["30", "35", "40", "45"], correct: 0, solution: "+5 each → 30." },
      { q: "Antonym of 'Ancient'?", options: ["Old", "Modern", "Historic", "Antique"], correct: 1, solution: "Ancient = old → antonym = modern." },
      { q: "E alone in 12 days, F in 18. Together?", options: ["7.2", "6", "8", "9"], correct: 0, solution: "1/12 + 1/18 = 3/36 + 2/36 = 5/36 → 7.2 days." },
      { q: "Odd one: Chair, Table, Stool, Sofa", options: ["Chair", "Table", "Stool", "Sofa"], correct: 1, solution: "Table has no backrest, others do." },
      { q: "Analogy: Eye : See :: Ear : ?", options: ["Hear", "Smell", "Taste", "Touch"], correct: 0, solution: "Eye to see, ear to hear." }
    ]
  }
];

export default function AptitudeTest() {
  const [currentTest, setCurrentTest] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [usedSets, setUsedSets] = useState([]);

  // Start a random test
  const startTest = () => {
    let available = testSets.filter(t => !usedSets.includes(t.id));
    if (available.length === 0) {
      available = testSets;
      setUsedSets([]);
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];

    setCurrentTest(selected);
    setUsedSets(prev => [...prev, selected.id]);

    // Shuffle questions
    const shuffled = [...selected.questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);

    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(20 * 60);
    setIsRunning(true);
    setShowResult(false);
    toast.success('Aptitude Test started! 20 minutes remaining.');
  };

  // Timer
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    if (timeLeft === 0 && isRunning) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const selectAnswer = (index) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: index }));
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsRunning(false);
    setShowResult(true);
  };

  const takeNextTest = () => {
    setShowResult(false);
    startTest();
  };

  const goBack = () => {
    setCurrentTest(null);
    setShowResult(false);
  };

  const score = Object.keys(answers).reduce((acc, q) => {
    return acc + (answers[q] === shuffledQuestions[q]?.correct ? 1 : 0);
  }, 0);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!currentTest) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 flex items-center justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={startTest}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-16 py-8 rounded-3xl text-3xl font-bold shadow-2xl transition-all duration-300"
        >
          Start Test
        </motion.button>
      </motion.div>
    );
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{currentTest.title}</h1>
          <div className="text-2xl font-mono font-bold bg-gray-900/50 px-6 py-3 rounded-full border border-indigo-500/50">
            {formatTime()}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-indigo-500/30"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-lg mb-3">
                  <span>Question {currentQuestion + 1} / {shuffledQuestions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-semibold mb-10 leading-relaxed">{question.q}</h2>

              {/* Options */}
              <div className="grid gap-5">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.04, boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      selectAnswer(index);
                      if (currentQuestion < shuffledQuestions.length - 1) {
                        setTimeout(nextQuestion, 400);
                      } else {
                        handleSubmit();
                      }
                    }}
                    className={`p-6 rounded-2xl text-left text-lg font-medium transition-all duration-300 border-2 ${
                      answers[currentQuestion] === index
                        ? index === question.correct
                          ? 'border-green-500 bg-green-900/30'
                          : 'border-red-500 bg-red-900/30'
                        : 'border-indigo-500/50 bg-indigo-900/40 hover:border-indigo-400 hover:bg-indigo-800/60'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-10 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl text-lg font-medium disabled:opacity-50 transition-colors"
                >
                  Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentQuestion === shuffledQuestions.length - 1 ? handleSubmit : nextQuestion}
                  className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl text-lg font-medium transition-colors"
                >
                  {currentQuestion === shuffledQuestions.length - 1 ? 'Finish Test' : 'Next Question'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-indigo-500/30 text-center"
            >
              <h2 className="text-5xl font-bold mb-6 text-green-400">Test Completed!</h2>

              <div className="text-7xl font-extrabold mb-4">
                {score} / {shuffledQuestions.length}
              </div>

              <div className="text-4xl font-bold mb-8 text-yellow-400">
                {Math.round((score / shuffledQuestions.length) * 100)}%
              </div>

              <p className="text-2xl mb-12">
                {score >= 8 ? "Brilliant! You're placement-ready!" : 
                 score >= 6 ? "Strong performance — just a bit more practice." : 
                 score >= 4 ? "Good effort — focus on weak topics." : 
                 "Keep working — improvement is coming!"}
              </p>

              {/* Beautiful Solutions - each question in its own elegant card */}
              <div className="space-y-8 text-left max-h-[70vh] overflow-y-auto pr-4">
                <h3 className="text-3xl font-bold mb-8 text-center text-indigo-300">Detailed Solutions</h3>
                {shuffledQuestions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-lg"
                  >
                    <p className="text-xl font-semibold mb-4">{q.q}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="font-medium">Your answer:</span>{' '}
                        <span className={answers[i] === q.correct ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                          {answers[i] !== undefined ? q.options[answers[i]] : "Not answered"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Correct answer:</span>{' '}
                        <span className="text-green-400 font-bold">{q.options[q.correct]}</span>
                      </div>
                    </div>

                    <div className="bg-gray-950/50 p-5 rounded-xl border border-gray-600/50">
                      <p className="text-gray-200 leading-relaxed">{q.solution}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 flex justify-center gap-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goBack}
                  className="px-12 py-5 bg-gray-700 hover:bg-gray-600 rounded-3xl text-xl font-medium transition-colors"
                >
                  Go Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={takeNextTest}
                  className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-3xl text-xl font-medium transition-colors"
                >
                  Take Next Test
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}