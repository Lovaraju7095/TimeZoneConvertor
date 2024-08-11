// TimeZoneDisplay/index.js or TimeZoneDisplay.js
import React from 'react';
import moment from 'moment-timezone';

const TimeZoneDisplay = ({ timeZone, currentTime, onDelete }) => {
  const time = currentTime.tz(timeZone).format('YYYY-MM-DD HH:mm:ss');

  return (
    <div>
      <span>{timeZone}: {time}</span>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default TimeZoneDisplay; // Ensure this is a default export
