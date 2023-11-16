import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
  
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playBeep();
      setTimeout(() => {
        switchTimer();
      }, 1000);
    }
  
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, timerLabel, breakLength, sessionLength]);
  
  const switchTimer = () => {
    const newLabel = timerLabel === 'Session' ? 'Break' : 'Session';
    const newTime = newLabel === 'Session' ? sessionLength * 60 : breakLength * 60;
    setTimerLabel(newLabel);
    setTimeLeft(newTime);
  }
  

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    resetBeep();
  };

  const resetBeep = () => {
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  }

  const changeLength = (type, amount) => {
    if (type === 'break') {
      setBreakLength((currentLength) => Math.min(Math.max(1, currentLength + amount), 60));
    } else {
      setSessionLength((currentLength) => {
        const newLength = Math.min(Math.max(1, currentLength + amount), 60);
        if (!isRunning && timerLabel === 'Session') {
          setTimeLeft(newLength * 60);
        }
        return newLength;
      });
    }
  };
  

  const playBeep = () => {
    const beep = document.getElementById('beep');
    beep.play();
  };

  return (
    <div id="app-container">
      <div id="break-label">Break Length</div>
      <button id="break-decrement" onClick={() => changeLength('break', -1)}>-</button>
      <span id="break-length">{breakLength}</span>
      <button id="break-increment" onClick={() => changeLength('break', 1)}>+</button>

      <div id="session-label">Session Length</div>
      <button id="session-decrement" onClick={() => changeLength('session', -1)}>-</button>
      <span id="session-length">{sessionLength}</span>
      <button id="session-increment" onClick={() => changeLength('session', 1)}>+</button>

      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>
      <button id="start_stop" onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={resetTimer}>Reset</button>

      <audio id="beep" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" preload="auto"></audio>
      <div id="footer">
        Made by <a href='https://hckdnl.github.io/25_5_clock/' target='_blank' rel='noopener noreferrer'>hckdnl</a>
      </div>
    </div>
  );
}

export default App;
