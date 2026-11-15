import React, { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { checkCurrentReminder, SCHEDULED_REMINDERS } from '../utils/nurseSchedule';

export const ToastReminder = () => {
  const { showToast } = useToast();
  const lastTriggeredRef = useRef(null);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentMinuteKey = `${now.getHours()}:${now.getMinutes()}`;

      if (lastTriggeredRef.current === currentMinuteKey) {
        return;
      }

      const activeReminder = checkCurrentReminder(now);
      if (activeReminder) {
        lastTriggeredRef.current = currentMinuteKey;
        showToast({
          title: `🔔 ${activeReminder.title} (${activeReminder.badge})`,
          message: activeReminder.message,
          type: 'reminder',
          duration: 9000,
          sound: true,
        });
      }
    };

    // Run check immediately, then every 20 seconds
    checkSchedule();
    const interval = setInterval(checkSchedule, 20000);

    return () => clearInterval(interval);
  }, [showToast]);

  return null;
};

export default ToastReminder;
