import { useEffect, useState } from "react";

export default function OrderProgress({
  startTime,
  endTime,
}: {
  startTime: number;
  endTime: number;
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const totalDuration = endTime - startTime;
  const elapsedTime = currentTime - startTime;
  const percentageElapsed = (elapsedTime / totalDuration) * 100;

  return (
    <div style={{ maxWidth: "30rem" }}>
      <div className="timeline" style={{ border: "1px solid blue" }}>
        <div
          className="timeline-progress"
          style={{
            width: `${percentageElapsed}%`,
            minHeight: "1rem",
            color: "white",
            backgroundColor: "#fafafa",
          }}
        ></div>
      </div>
      <div className="timeline-timestamps">
        <div className="start-time">
          Start Time: {new Date(startTime).toLocaleString()} End Time:{" "}
          {new Date(endTime).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
