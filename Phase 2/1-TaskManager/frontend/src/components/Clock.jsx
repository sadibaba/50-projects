import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);


  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();


  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6; 
  const secondAngle = seconds * 6; 


  const digitalHours = hours % 12 || 12;
  const ampm = hours >= 12 ? "pm" : "am";
  const dateString = time.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-row items-center justify-center py-6 bg-[#ecf0f3] rounded-2xl shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] w-[400px] mx-auto gap-6">
      <div className="relative w-36 h-36 rounded-full bg-white border-[6px] border-[#d1d5db] shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]">
       
        <div
          className="absolute w-[3px] h-[45px] bg-gray-800 top-[19px] left-[63.5px] origin-[50%_100%] rounded"
          style={{ transform: `rotate(${hourAngle}deg)` }}
        ></div>

        <div
          className="absolute w-[2px] h-[55px] bg-gray-600 top-[7px] left-[63.5px] origin-[50%_100%] rounded"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        ></div>

        <div
          className="absolute w-[1px] h-[60px] bg-red-500 top-[2px] left-[63.5px] origin-[50%_100%] rounded"
          style={{ transform: `rotate(${secondAngle}deg)` }}
        ></div>
      </div>

      <div className="flex flex-col items-center justify-center min-w-[100px]">
        <p className="text-xl font-semibold text-gray-800">
          {digitalHours}
          {ampm}
        </p>
        <p className="text-sm text-gray-500">{dateString}</p>
      </div>
    </div>
  );
}
