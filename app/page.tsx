"use client";
import { Button } from '@/components/ui/button';
import { emit } from '@tauri-apps/api/event';
import React, { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { IoPlay, IoStop, IoRefresh } from 'react-icons/io5';
import { MdOutlineTimer } from 'react-icons/md';

interface TimerControlProps {
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onSetTime: (time: number) => void;
}

const TimerControlPanel: React.FC<TimerControlProps> = () => {
  const [inputTime, setInputTime] = useState<string>(window.localStorage.getItem('inputTime') || '');
  const [color, setColor] = useState<string>(window.localStorage.getItem('color') || "#0000ff");
  const [textColor, setTextColor] = useState<string>(window.localStorage.getItem('textColor') || "#000000");

  useEffect(() => {
    window.localStorage.setItem('inputTime', inputTime);
  }, [inputTime]);

  useEffect(() => {
    window.localStorage.setItem('color', color);
  }, [color]);

  useEffect(() => {
    window.localStorage.setItem('textColor', textColor);
  }, [textColor]);

  function onStartClick() {
    console.log("Start clicked: ");
    emit("start-clicked");
  }

  function onStopClicked() {
    console.log("Stop clicked: ");
    emit("stop-clicked");
  }

  function onResetClicked() {
    console.log("Reset clicked: ");
    emit("reset-clicked");
  }

  function onSetTimeClicked(time: string): any {
    const [hours = '0', minutes = '0', seconds = '0', milliseconds = '0'] = time.split(':');
    const totalMilliseconds = (parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000 + parseInt(milliseconds);
    console.log("Set Time clicked: " + time + " " + totalMilliseconds);
    emit("set-time-clicked", { timeString: time, timeMilliseconds: totalMilliseconds });
  }

  function onStartCountdownClicked() {
    console.log("Start countdown clicked: ");
    emit("start-countdown-clicked");
  }

  function onChangeColor() {
    console.log("Change color clicked: " + color);
    emit("change-color-clicked", { color });
  }

  function onTextColorChange() {
    console.log("Text color changed: " + textColor);
    emit("text-color-changed", { textColor });
  }

  function onOpacityChange(opacity: number) {
    console.log("Opacity changed: " + opacity);
    emit("opacity-changed", { opacity });
  }

  return (
    <section className="container mx-auto flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex gap-2 justify-center">
        <Button className="flex items-center justify-center rounded p-2 bg-green-500" onClick={onStartClick}>
          <IoPlay className="text-white" size={24} />
          <span className="ml-2 text-white">Start</span>
        </Button>
        <Button className="flex items-center justify-center rounded p-2 bg-red-500" onClick={onStopClicked}>
          <IoStop className="text-white" size={24} />
          <span className="ml-2 text-white">Stop</span>
        </Button>
        <Button className="flex items-center justify-center rounded p-2 bg-blue-500" onClick={onResetClicked}>
          <IoRefresh className="text-white" size={24} />
          <span className="ml-2 text-white">Reset</span>
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <label className="flex items-center gap-2">
          <MdOutlineTimer size={24} />
          <input
            className="border-2 border-gray-300 rounded-md text-center"
            type="text"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            placeholder="Set Time (HH:MM:SS:MS)"
          />
        </label>
        <Button className="mt-2" onClick={() => onSetTimeClicked(inputTime)}>Set Time</Button>
      </div>
      <Button className="max-w-sm" onClick={onStartCountdownClicked}>Countdown</Button>
      <div className="flex items-center">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="color-picker w-8 h-8 border-2 border-gray-300 rounded-md mr-2 cursor-pointer"
          style={{ appearance: 'none' }}
        />
        <Button className="max-w-sm" onClick={onChangeColor}>Change Background Color</Button>
      </div>
      <div className="flex items-center">
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="color-picker w-8 h-8 border-2 border-gray-300 rounded-md mr-2 cursor-pointer"
          style={{ appearance: 'none' }}
        />
        <Button className="max-w-sm" onClick={onTextColorChange}>Change Text Color</Button>
      </div>
      <h3 className="text-lg">Opacity</h3>
      <Slider className="max-w-sm" defaultValue={[1]} max={1} step={0.01} onValueChange={(e: [number]) => onOpacityChange(e[0])} />
    </section>
  );
};

export default TimerControlPanel;
