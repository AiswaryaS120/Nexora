import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodingEnvironment() {
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
      import('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js')
        .then(async () => {
          const py = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
          });
          setPyodide(py);
          setLoadingPyodide(false);
        })
        .catch(err => {
          setError('Failed to load Python runtime. Try again later.');
          setLoadingPyodide(false);
        });
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
        // Custom print (already good)
        pyodide.globals.set('nexora_output', pyodide.globals.get('list')());
        pyodide.runPython(`
          def nexora_print(*args, sep=' ', end='\\n'):
              line = sep.join(map(str, args)) + end
              nexora_output.append(line)
          __builtins__.print = nexora_print
        `);

        // Add fake input using browser prompt
        pyodide.runPython(`
          def input(prompt=''):
              from js import prompt as js_prompt
              return js_prompt(prompt) or ''
        `);

        // Run user's code
        pyodide.runPython(code);

        // Get output - fixed version (no .toJs() call)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-400">
            Nexora Live Coding
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
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
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++ (editor only)</option>
              <option value="java">Java (editor only)</option>
            </select>

            <button
              onClick={runCode}
              disabled={loadingPyodide && language === 'python'}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                loadingPyodide && language === 'python'
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loadingPyodide && language === 'python' ? 'Loading Python...' : 'Run Code'}
            </button>

            <button
              onClick={clearOutput}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="border border-gray-700 rounded-xl overflow-hidden shadow-2xl mb-6">
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

        {/* Beautiful Output Box - Now looks like OnlineGDB / Replit */}
        <div className="bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#252526] border-b border-[#333]">
            <h3 className="text-base font-medium text-[#00ff9d]">
              Output
            </h3>
            {output.length > 0 && (
              <button
                onClick={copyOutput}
                className="text-gray-400 hover:text-[#00ff9d] text-sm flex items-center gap-1"
              >
                Copy
              </button>
            )}
          </div>

          {/* Output content - scrollable, monospace, clean */}
          <div 
            className="p-5 font-mono text-sm leading-6 max-h-96 overflow-y-auto bg-[#0d1117]"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          >
            {output.length === 0 && !error ? (
              <p className="text-gray-500 italic">
                Run your code to see output here...
              </p>
            ) : (
              output.map((line, i) => (
                <div key={i} className="mb-0.5 text-[#d4d4d4]">
                  {line.content}
                </div>
              ))
            )}

            {error && (
              <div className="text-red-400 font-medium whitespace-pre-wrap mt-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <p className="mt-6 text-gray-400 text-sm text-center">
          JavaScript & Python run fully in your browser (no server needed).  
          C++/Java editor support only for now — execution coming soon!
        </p>
      </div>
    </div>
  );
}