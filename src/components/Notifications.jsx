import React from 'react';

const Notifications = () => {
  return (
    <div className="mt-2 pl-1.5 pr-1.5 text-center rounded-sm flex items-center justify-between"
    style={{
            backgroundColor: '#163e73',
            color: 'white',
          }}>
        <span>Notifications</span>
        <i class="bi bi-chevron-down"></i>
    </div>
  );
};

export default Notifications;
