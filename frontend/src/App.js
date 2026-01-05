import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [css, setCss] = useState('');
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [styleSheetId, setStyleSheetId] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      // Enable console monitoring and get stylesheet
      socket.send(JSON.stringify({ method: 'Runtime.enable' }));
      socket.send(JSON.stringify({ method: 'CSS.enable' }));
      socket.send(JSON.stringify({ method: 'getStyleSheetId' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        setConsoleMessages((prevMessages) => [
          ...prevMessages,
          data.params.args.map((arg) => arg.value).join(' '),
        ]);
      } else if (data.styleSheetId) {
        setStyleSheetId(data.styleSheetId);
      } else if (data.method === 'CSS.setStylesheetText') {
        setCss(data.params.text);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleCssChange = (e) => {
    const newCss = e.target.value;
    setCss(newCss);
    if (ws && styleSheetId) {
      ws.send(
        JSON.stringify({
          method: 'CSS.setStylesheetText',
          params: {
            styleSheetId: styleSheetId,
            text: newCss,
          },
        })
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cross-Browser DevTools</h1>
        <div className="main-content">
          <div className="css-editor">
            <h2>CSS Editor</h2>
            <textarea
              value={css}
              onChange={handleCssChange}
              placeholder="Enter CSS here"
            />
          </div>
          <div className="console">
            <h2>Console</h2>
            <div className="console-messages">
              {consoleMessages.map((msg, index) => (
                <div key={index} className="console-message">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
