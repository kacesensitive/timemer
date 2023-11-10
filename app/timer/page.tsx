"use client";
import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

const TimerPage: React.FC = () => {
    const [time, setTime] = useState<number>(parseInt(window.localStorage.getItem('time') || '0'));
    const [timerOn, setTimerOn] = useState<boolean>(window.localStorage.getItem('timerOn') === 'true');
    const [isCountdown, setIsCountdown] = useState<boolean>(window.localStorage.getItem('isCountdown') === 'true');
    const [colorHex, setColorHex] = useState<string>(window.localStorage.getItem('colorHex') || "#0000ff");
    const [textColorHex, setTextColorHex] = useState<string>(window.localStorage.getItem('textColorHex') || "#000000");
    const [opacity, setOpacity] = useState<number>(parseFloat(window.localStorage.getItem('opacity') || '1'));

    useEffect(() => {
        window.localStorage.setItem('time', time.toString());
    }, [time]);

    useEffect(() => {
        window.localStorage.setItem('timerOn', timerOn.toString());
    }, [timerOn]);

    useEffect(() => {
        window.localStorage.setItem('isCountdown', isCountdown.toString());
    }, [isCountdown]);

    useEffect(() => {
        window.localStorage.setItem('colorHex', colorHex);
    }, [colorHex]);

    useEffect(() => {
        window.localStorage.setItem('textColorHex', textColorHex);
    }, [textColorHex]);

    useEffect(() => {
        window.localStorage.setItem('opacity', opacity.toString());
    }, [opacity]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (timerOn) {
            interval = setInterval(() => {
                console.log("Timer on: " + time + " " + isCountdown);
                setTime(prevTime => isCountdown ? Math.max(prevTime - 10, 0) : prevTime + 10);
            }, 10);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerOn, isCountdown]);

    useEffect(() => {
        const listeners = [
            { event: 'start-clicked', handler: () => { setIsCountdown(false); setTimerOn(true); } },
            { event: 'stop-clicked', handler: () => setTimerOn(false) },
            { event: 'reset-clicked', handler: () => setTime(0) },
            {
                event: 'set-time-clicked', handler: (time: any) => {
                    console.log(time);
                    setTime(time.payload.timeMilliseconds)
                }
            },
            {
                event: 'start-countdown-clicked', handler: () => {
                    console.log("Start countdown clicked: ");
                    setIsCountdown(true);
                    setTimerOn(true);
                }
            },
            {
                event: 'change-color-clicked', handler: (color: any) => {
                    console.log("Change color clicked: " + color);
                    setColorHex(color.payload.color);
                }
            },
            {
                event: 'opacity-changed', handler: (opacity: any) => {
                    console.log("Opacity changed: " + opacity);
                    setOpacity(opacity.payload.opacity);
                }
            },
            {
                event: 'text-color-changed', handler: (textColor: any) => {
                    console.log("Text color changed: " + textColor);
                    setTextColorHex(textColor.payload.textColor);
                }
            }
        ];

        listeners.forEach(({ event, handler }) => {
            listen(event, handler);
        });

    }, []);

    return (
        <div data-tauri-drag-region className="h-screen flex justify-center items-center">
            <div data-tauri-drag-region style={{ backgroundColor: colorHex, opacity: opacity, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
            <div data-tauri-drag-region className="w-full text-center relative">
                <div data-tauri-drag-region style={{ color: textColorHex }} className="timer text-6xl md:text-9xl lg:text-[10vw] select-none font-mono">
                    <span data-tauri-drag-region>{("0" + Math.floor(time / 3600000)).slice(-2)}:</span>
                    <span data-tauri-drag-region>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                    <span data-tauri-drag-region>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                    <span data-tauri-drag-region>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                </div>
            </div>
        </div>
    );
}

export default TimerPage;
