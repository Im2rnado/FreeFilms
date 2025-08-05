import React, { useEffect, useState } from 'react';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 7000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification">
            <h4>{message}</h4>
        </div>
    );
};

export default Notification;