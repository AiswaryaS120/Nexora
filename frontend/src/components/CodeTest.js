import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Code, Play, Check, X } from 'lucide-react';

/* ------------------ Mistake Saver ------------------ */
const saveMistake = (mistakeData) => {
  const mistakes = JSON.parse(localStorage.getItem('hirehub_mistakes') || '[]');

  const newMistake = {
    id: Date.now() + Math.random(),
    date: new Date().toISOString(),
    reviewed: false,
    ...mistakeData
  };

  mistakes.push(newMistake);
  localStorage.setItem('hirehub_mistakes', JSON.stringify(mistakes));
};

/* ------------------ Question Data ------------------ */
const categories = [
  {
    name: "Array",
    questions: [
      {
        id: 1,
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        language: "javascript",
        template: `function twoSum(nums, target) {
  // Your code here
  
}`,
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] }
        ]
      },
      {
        id: 2,
        title: "Reverse String",
        description: "Write a function that reverses a string.",
        language: "python",
        template: `def reverse_string(s):
    # Your code here
    return ''`,
        testCases: [
          { input: ["hello"], expected: "olleh" },
          { input: ["world"], expected: "dlrow" },
          { input: [""], expected: "" }
        ]
      }
    ]
  },
  {
    name: "Data Structures",
    questions: [
      {
        id: 3,
        title: "Palindrome Number",
        description: "Determine whether an integer is a palindrome.",
        language: "javascript",
        template: `function isPalindrome(x) {
  // Your code here
  
}`,
        testCases: [
          { input: [121], expected: true },
          { input: [10], expected: false },
          { input: [-121], expected: false }
        ]
      },
      {
        id: 4,
        title: "Fibonacci Sequence",
        description: "Generate Fibonacci sequence up to n terms.",
        language: "python",
        template: `def fibonacci(n):
    # Your code here
    return []`,
        testCases: [
          { input: [5], expected: [0, 1, 1, 2, 3] },
          { input: [1], expected: [0] },
          { input: [0], expected: [] }
        ]
      }
    ]
  }
];

export default function CodeTest() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------ Load Pyodide ------------------ */
  useEffect(() => {
    if (selectedLanguage === 'python' && !pyodide) {
      const load = async () => {
        try {
          const script = document.createElement('script');
          script.src =
            "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
          script.async = true;
          document.body.appendChild(script);

          script.onload = async () => {
            const py = await window.loadPyodide({
              indexURL:
                "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
            });
            setPyodide(py);
            toast.success("Python runtime loaded!");
          };
        } catch {
          toast.error("Failed to load Python runtime");
        }
      };
      load();
    }
  }, [selectedLanguage, pyodide]);

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedProblem(null);
  };

  const selectProblem = (problem) => {
    setSelectedProblem(problem);
    setSelectedLanguage(problem.language);
    setCode(problem.template.trim());
    setTestResults([]);
    setOutput('');
  };

  /* ------------------ Run Code ------------------ */
  const runCode = async () => {
    if (!selectedProblem) return;

    setLoading(true);
    setTestResults([]);
    setOutput('');

    try {
      if (selectedLanguage === 'javascript') {
        const funcMatch =
          selectedProblem.template.match(/function\s+(\w+)/);
        const funcName = funcMatch ? funcMatch[1] : null;
        if (!funcName) throw new Error("Function name not detected");

        const results = selectedProblem.testCases.map((tc, i) => {
          try {
            const testCode = `
              ${code}
              const input = ${JSON.stringify(tc.input)};
              ${funcName}(...input);
            `;
            const result = eval(testCode);
            const passed =
              JSON.stringify(result) ===
              JSON.stringify(tc.expected);

            return {
              testNumber: i + 1,
              output: JSON.stringify(result),
              passed
            };
          } catch (err) {
            return {
              testNumber: i + 1,
              output: "Error: " + err.message,
              passed: false
            };
          }
        });

        setTestResults(results);
        const passedCount =
          results.filter(r => r.passed).length;

        setOutput(`${passedCount}/${results.length} tests passed`);

        if (passedCount !== results.length) {
          saveMistake({
            type: "coding",
            topic: selectedProblem.title,
            question: selectedProblem.description,
            code
          });
        }
      }

      else if (selectedLanguage === 'python') {
        if (!pyodide) {
          toast.error("Python runtime not loaded");
          return;
        }

        const funcMatch =
          selectedProblem.template.match(/def\s+(\w+)/);
        const funcName = funcMatch ? funcMatch[1] : null;
        if (!funcName) throw new Error("Function name not detected");

        const results = [];

        for (let i = 0; i < selectedProblem.testCases.length; i++) {
          const tc = selectedProblem.testCases[i];
          try {
            await pyodide.runPythonAsync(code);
            const inputArgs = tc.input
              .map(arg =>
                typeof arg === 'string'
                  ? `"${arg}"`
                  : arg
              )
              .join(', ');

            const result = await pyodide.runPythonAsync(
              `${funcName}(${inputArgs})`
            );

            const passed =
              JSON.stringify(result) ===
              JSON.stringify(tc.expected);

            results.push({
              testNumber: i + 1,
              output: JSON.stringify(result),
              passed
            });
          } catch (err) {
            results.push({
              testNumber: i + 1,
              output: "Error: " + err.message,
              passed: false
            });
          }
        }

        setTestResults(results);
        const passedCount =
          results.filter(r => r.passed).length;

        setOutput(`${passedCount}/${results.length} tests passed`);
      }

    } catch (err) {
      setOutput("Execution error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        background: "#011024",
        padding: "40px 60px",
        color: "white"
      }}
    >
      <h1 style={{
        fontSize: "38px",
        color: "#e8c441",
        textAlign: "center",
        marginBottom: "40px"
      }}>
        Code Test Environment
      </h1>

      {/* CATEGORY VIEW */}
      {!selectedCategory && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "25px"
        }}>
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => selectCategory(cat)}
              style={{
                background: "#012040",
                padding: "30px",
                borderRadius: "12px",
                border: "1px solid #e8c441",
                cursor: "pointer"
              }}
            >
              <Code size={30} color="#e8c441" />
              <h2>{cat.name}</h2>
              <p>{cat.questions.length} problems</p>
            </div>
          ))}
        </div>
      )}

      {/* PROBLEM VIEW */}
      {selectedCategory && !selectedProblem && (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{ color: "#e8c441", marginBottom: "20px" }}
          >
            ← Back
          </button>

          {selectedCategory.questions.map(problem => (
            <div
              key={problem.id}
              onClick={() => selectProblem(problem)}
              style={{
                background: "#012040",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #e8c441",
                marginBottom: "15px",
                cursor: "pointer"
              }}
            >
              {problem.title}
            </div>
          ))}
        </div>
      )}

      {/* EDITOR VIEW */}
      {selectedProblem && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px"
        }}>
          <div>
            <h2 style={{ color: "#e8c441" }}>
              {selectedProblem.title}
            </h2>

            {/* LANGUAGE SELECTOR */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ marginRight: "10px" }}>
                Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) =>
                  setSelectedLanguage(e.target.value)
                }
                style={{
                  padding: "6px 10px",
                  background: "#012040",
                  color: "white",
                  border: "1px solid #e8c441"
                }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <Editor
              height="400px"
              language={selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
            />

            <button
              onClick={runCode}
              disabled={loading}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#e8c441",
                color: "#011024",
                borderRadius: "6px",
                fontWeight: "bold"
              }}
            >
              {loading ? "Running..." : "Run Tests"}
            </button>

            <p style={{ marginTop: "15px", color: "#e8c441" }}>
              {output}
            </p>
          </div>

          <div>
            {testResults.map((r, i) => (
              <div key={i}
                style={{
                  border: r.passed
                    ? "1px solid green"
                    : "1px solid red",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "6px"
                }}
              >
                {r.passed ? <Check size={16}/> : <X size={16}/>}
                Test {r.testNumber} — {r.output}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
