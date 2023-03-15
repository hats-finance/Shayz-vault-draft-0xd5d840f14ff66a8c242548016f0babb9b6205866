import { useEffect } from "react";
import { INotification, NotificationType } from "../NotificationProvider";
import CloseIcon from "assets/icons/close.icon";
import { Colors } from "constants/constants";
import "./index.scss";

interface IProps {
  notification: INotification;
  removeNotification?: () => void;
}

const DISPLAY_DURATION = 5000;

export default function Notification({ notification, removeNotification }: IProps) {

  const notificationColor = notification.type === NotificationType.Success ?
    Colors.turquoise : notification.type === NotificationType.Error ?
      Colors.red : Colors.lightTurquoise;

  useEffect(() => {
    if (!removeNotification) return;
    const removeTimeout = setTimeout(() => removeNotification(), DISPLAY_DURATION);
    return () => {
      clearTimeout(removeTimeout);
    };
  }, [notification, removeNotification])

  return (
    <div className="notification-wrapper" style={{ backgroundColor: notificationColor }}>
      <div className="notification__content">{notification.content}</div>
      {removeNotification && <button className="dismiss-btn" onClick={removeNotification}><CloseIcon fill={Colors.black} /></button>}
    </div>
  )
}
