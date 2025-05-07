import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification as StellarNotification } from '@stellar/design-system';
import './NotificationProvider.css'; // Import CSS for sliding effect

type NotificationType = 'primary' | 'secondary' | 'success' | 'error' | 'warning';
interface Notification {
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType) => {
    const newNotification = { message, type, isVisible: true };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification === newNotification ? { ...notification, isVisible: false } : notification
        )
      );
    }, 2500); // Start transition out after 2.5 seconds

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => 
        !(notification.message === newNotification.message && 
          notification.type === newNotification.type)
      ));
    }, 5000); // Remove after 5 seconds
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`notification ${notification.isVisible ? 'slide-in' : 'slide-out'}`}
          >
            <StellarNotification title={notification.message} variant={notification.type} />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};