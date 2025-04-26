import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('https://boxie.app.n8n.cloud/webhook-test/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);  // <-- store whatever n8n returns
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Instagram Analyzer</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram URL..."
        style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
      />

      <button
        onClick={handleAnalyze}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
        disabled={!url || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

    {result && (
      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <h3>Analysis Result:</h3>
        {Array.isArray(result) ? (
          result.map((item, index) => {
            let parsedOutput;
            try {
              // Try parsing if it's a JSON string
              parsedOutput = JSON.parse(item.output);
            } catch (e) {
              // If parsing fails, treat it as normal text
              parsedOutput = item.output;
            }

            return (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h4>Result {index + 1}</h4>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {typeof parsedOutput === 'object'
                    ? JSON.stringify(parsedOutput, null, 2)
                    : parsedOutput}
                </pre>
              </div>
            );
          })
        ) : (
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    )}

    {result && (
      <div style={{ marginTop: '20px' }}>
        <button
          // onClick={handleGenerateReport}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Generate Report
        </button>
      </div>
    )}


    </div>
  );
}

export default App;
