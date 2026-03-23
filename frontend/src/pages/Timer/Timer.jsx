import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import TimerDisplay from "./sections/TimerDisplay";
import TimerControls from "./sections/TimerControls";
import TimerModes from "./sections/TimerModes";
import ProgressBar from "./sections/ProgressBar";

export default function Timer() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("focus");
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const intervalRef = useRef(null);

  const durations = {
    focus: 25 * 60,
    break: 5 * 60,
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);

            if (mode === "focus") {
              setSessions((s) => s + 1);
              setMode("break");
              return durations.break;
            } else {
              setMode("focus");
              return durations.focus;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTime(durations[newMode]);
    setIsRunning(false);
  };

  return (
    <div className="main-background min-h-screen flex items-center justify-center relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-[#52466B] text-white px-4 py-2 rounded-xl hover:scale-105 transition"
      >
        ← Back
      </button>

      {/* Timer Card */}
      <div className="bg-[#3D3555] w-full max-w-2xl rounded-3xl p-10 text-center border border-[#9B7EDE33]">
        <TimerModes mode={mode} switchMode={switchMode} />

        <TimerDisplay time={time} mode={mode} />

        <ProgressBar time={time} duration={durations[mode]} />

        <TimerControls
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          setTime={setTime}
          duration={durations[mode]}
        />

        <p className="mt-6 text-violet-300 text-sm">Sessions completed today</p>
        <p className="text-xl text-violet-400">{sessions}</p>
      </div>
    </div>
  );
}
