import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";

dayjs.extend(duration);

export const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = dayjs(); 
      const target = dayjs(targetDate);
      const diff = target.diff(now);

      if (diff <= 0) {
        setTimeLeft('00:00:00');
      } else {
        const d = dayjs.duration(diff);
        const hours = String(d.hours()).padStart(2, "0");
        const minutes = String(d.minutes()).padStart(2, "0");
        const seconds = String(d.seconds()).padStart(2, '0'); // Get seconds
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    };

    updateTime(); // run immediately once
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};
