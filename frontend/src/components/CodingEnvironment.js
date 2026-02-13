import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

export default function CodingEnvironment() {
  const navigate = useNavigate();

  const [code, setCode] = useState(
    '# Welcome to Nexora Coding Environment\n' +
    '# Select language and write code below\n\n' +
    'print("Hello, Nexora! 🚀")\n' +
    'print(2 + 2)'
  );

  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [loadingPyodide, setLoadingPyodide] = useState(false);

  // Load Pyodide once when Python is selected
 useEffect(() => {
  if (language === 'python' && !pyodide) {
    setLoadingPyodide(true);

    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
    script.onload = async () => {
      try {
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
        });
        setPyodide(py);
      } catch (err) {
        setError("Failed to initialize Python runtime.");
      }
      setLoadingPyodide(false);
    };

    script.onerror = () => {
      setError("Failed to load Python runtime.");
      setLoadingPyodide(false);
    };

    document.body.appendChild(script);
  }
}, [language, pyodide]);


  const runCode = () => {
    setOutput([]);
    setError('');

    if (language === 'javascript') {
      try {
        const logs = [];
        const fakeConsole = {
          log: (...args) => {
            const line = args.map(arg =>
              typeof arg === 'object' && arg !== null
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            ).join(' ');
            logs.push({ type: 'log', content: line });
          }
        };

        const func = new Function('console', code);
        func(fakeConsole);

        setOutput(logs);
      } catch (err) {
        setError(err.message || 'JavaScript execution failed');
      }
    } else if (language === 'python') {
      if (!pyodide) {
        setError('Python runtime is still loading... please wait.');
        return;
      }

      try {
        pyodide.globals.set('nexora_output', pyodide.globals.get('list')());
        pyodide.runPython(`
          def nexora_print(*args, sep=' ', end='\\n'):
              line = sep.join(map(str, args)) + end
              nexora_output.append(line)
          __builtins__.print = nexora_print
        `);

        pyodide.runPython(`
          def input(prompt=''):
              from js import prompt as js_prompt
              return js_prompt(prompt) or ''
        `);

        pyodide.runPython(code);

        const pyOutputList = pyodide.globals.get('nexora_output');
        const lines = pyOutputList.map(line => ({
          type: 'log',
          content: line
        }));

        setOutput(lines.length > 0 ? lines : [{ type: 'log', content: '(no output)' }]);
      } catch (err) {
        setError(err.message || 'Python execution failed');
      }
    } else {
      setError(`Running ${language} is not supported yet.`);
    }
  };

  const clearOutput = () => {
    setOutput([]);
    setError('');
  };

  const copyOutput = () => {
    const text = output.map(line => line.content).join('\n');
    navigator.clipboard.writeText(text);
    alert('Output copied to clipboard!');
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Simple blue top bar - consistent with app theme */}
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

      {/* Spacer to prevent content overlap */}
      <div style={{ height: '70px' }} />

      {/* Main content */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            color: '#011024',
            fontSize: '2.5rem',
            fontWeight: 700,
            margin: 0
          }}>
            Nexora Live Coding
          </h1>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                if (e.target.value === 'python') {
                  setCode('# Python example\nprint("Hello Nexora!")\nprint(2 + 2)');
                } else if (e.target.value === 'javascript') {
                  setCode('// JavaScript example\nconsole.log("Hello Nexora! 🚀");\nconsole.log(2 + 2);');
                } else {
                  setCode(`// ${e.target.value} support coming soon...`);
                }
              }}
              style={{
                padding: '0.75rem 1rem',
                background: '#011024',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++ (editor only)</option>
              <option value="java">Java (editor only)</option>
            </select>

            <button
              onClick={runCode}
              disabled={loadingPyodide && language === 'python'}
              style={{
                padding: '0.75rem 1.5rem',
                background: loadingPyodide && language === 'python' ? '#6b7280' : '#011024',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: loadingPyodide && language === 'python' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loadingPyodide && language === 'python' ? 'Loading Python...' : 'Run Code'}
            </button>

            <button
              onClick={clearOutput}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Editor Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          marginBottom: '2rem',
          border: '1px solid #e8c441'
        }}>
          <Editor
            height="65vh"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
            }}
          />
        </div>

        {/* Output Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8c441'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            background: '#011024',
            color: '#e8c441',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
              Output
            </h3>

            {output.length > 0 && (
              <button
                onClick={copyOutput}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid #e8c441',
                  color: '#e8c441',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Copy Output
              </button>
            )}
          </div>

          <div style={{
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '1rem',
            background: '#0f172a',
            color: '#e2e8f0',
            minHeight: '200px',
            maxHeight: '400px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {output.length === 0 && !error ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                Run your code to see output here...
              </p>
            ) : (
              output.map((line, i) => (
                <div key={i} style={{ marginBottom: '0.25rem' }}>
                  {line.content}
                </div>
              ))
            )}

            {error && (
              <div style={{ color: '#f87171', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Info text */}
        <p style={{
          marginTop: '2rem',
          color: '#6b7280',
          textAlign: 'center',
          fontSize: '0.95rem'
        }}>
          JavaScript & Python run fully in your browser.  
          C++/Java editor support only for now — execution coming soon!
        </p>
      </div>
    </div>
  );
}