import React from 'react';

const NotificationCard = ({ iconLeft, message, dateTime, iconRight }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="text-green-500 mr-4">
          {iconLeft}
        </div>
        <div>
          <div className="text-white font-medium">{message}</div>
          <div className="text-gray-400 text-sm">{dateTime}</div>
        </div>
      </div>

      <div className="text-green-500">
        {iconRight}
      </div>
    </div>
  );
};

export default NotificationCard;
