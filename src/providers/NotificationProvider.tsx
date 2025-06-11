import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Notification as StellarNotification } from "@stellar/design-system";
import "./NotificationProvider.css"; // Import CSS for sliding effect

type NotificationType =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning";
interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType) => {
      const newNotification = {
        id: `${type}-${Date.now().toString()}`,
        message,
        type,
        isVisible: true,
      };
      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === newNotification.id
              ? { ...notification, isVisible: false }
              : notification,
          ),
        );
      }, 2500); // Start transition out after 2.5 seconds

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== newNotification.id),
        );
      }, 5000); // Remove after 5 seconds
    },
    [],
  );

  const contextValue = useMemo(() => ({ addNotification }), [addNotification]);

  return (
    <NotificationContext value={contextValue}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.isVisible ? "slide-in" : "slide-out"}`}
          >
            <StellarNotification
              title={notification.message}
              variant={notification.type}
            />
          </div>
        ))}
      </div>
    </NotificationContext>
  );
};

export { NotificationContext };
export type { NotificationContextType };
