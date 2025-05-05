import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification as StellarNotification } from '@stellar/design-system';

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
    }, 2500); // Start fade-out after 2.5 seconds

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => 
        !(notification.message === newNotification.message && 
          notification.type === newNotification.type)
      ));
    }, 3000); // Remove after 3 seconds
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        {notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              opacity: notification.isVisible ? 1 : 0,
              transition: 'opacity 0.5s ease',
              marginBottom: '10px',
            }}
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