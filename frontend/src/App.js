import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cpu, TerminalSquare, Zap, SlidersHorizontal } from 'lucide-react';
import './App.css';

// 1. Matrix Background (Now accepts dynamic opacity)
const MatrixBackground = ({ opacity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrixChars = '01'.split(''); 
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(0, 255, 65, 0.15)'; 
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 1, opacity: opacity }} />;
};

// 2. Main Application
function App() {
  const [data, setData] = useState({ vibration: 100, heat: 85, pressure: 110 });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0.15); // Default to subtle hacker mode

  // Custom handler to clear the terminal if data changes
  const handleSensorChange = (field, value) => {
    setData({ ...data, [field]: value });
    setResult(""); // System Reset effect
  };

  const runAnalysis = async () => {
    setLoading(true);
    setResult(""); 
    try {
      const response = await axios.post('https://plant-agent-backend.onrender.com/analyze', data);
      setResult(response.data.response);
    } catch (error) {
      setResult("sys_err: uplink_severed");
    }
    setLoading(false);
  };

  return (
    <>
      <MatrixBackground opacity={bgOpacity} />
      
      <div className="dashboard-container">
        
        <header className="sys-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Cpu size={32} color="var(--data-color)" />
            <h1 className="sys-title">AUTONOMOUS_PLANT_CORE // V3.3</h1>
          </div>
          <span className="sys-status">SYS.STATE: {loading ? 'ANALYZING' : 'READY'}</span>
        </header>

        <div className="grid-layout">
          
          {/* Left Column: Controls & Telemetry */}
          <div className="telemetry-panel">
            
            {/* NEW: Contrast Controls */}
            <div className="controls-panel">
              <label>
                <span><SlidersHorizontal size={14} style={{marginRight: '8px', verticalAlign:'middle'}}/> CONTRAST_CONTROLS</span>
                <span>[{parseFloat(bgOpacity).toFixed(2)}]</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={bgOpacity} 
                onChange={(e) => setBgOpacity(e.target.value)} 
              />
            </div>

            <div className="sensor-group">
              <label>[ VIBRATION_HZ ]</label>
              <input 
                type="number" 
                className="sensor-input"
                value={data.vibration} 
                onChange={(e) => handleSensorChange('vibration', e.target.value)} 
              />
            </div>
            
            <div className="sensor-group">
              <label>[ HEAT_C ]</label>
              <input 
                type="number" 
                className="sensor-input"
                value={data.heat} 
                onChange={(e) => handleSensorChange('heat', e.target.value)} 
              />
            </div>

            <div className="sensor-group">
              <label>[ PRESSURE_PSI ]</label>
              <input 
                type="number" 
                className="sensor-input"
                value={data.pressure} 
                onChange={(e) => handleSensorChange('pressure', e.target.value)} 
              />
            </div>

            <button className="btn-execute" onClick={runAnalysis} disabled={loading}>
              {loading ? '[ PROCESSING... ]' : '[ EXECUTE_DIAGNOSTICS ]'}
            </button>
          </div>

          {/* Right Column: Console Output Panel */}
          <div className="output-panel">
            <div className="output-header">
              root@plant-ai:~# ./analyze_telemetry --target=motor
            </div>
            <div className="log-text">
              {result}
              <span className="blinking-cursor"></span>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default App;