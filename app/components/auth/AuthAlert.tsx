// components/auth/AuthAlert.tsx
import React from 'react';

const alertStyles = {
  danger: "p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-400",
  success: "p-3 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-gray-800 dark:text-green-400",
  warning: "p-3 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-yellow-400", 

  // Add other types like warning or info if needed
};

const alertTitles = {
  danger: "Erreur !",
  success: "Succès !",
    warning: "Avertissement !",
}

type AuthAlertProps = {
  type: keyof typeof alertStyles;
  message: string;
};

const AuthAlert: React.FC<AuthAlertProps> = ({ type, message }) => {
  if (!type || !message) return null;

  const style = alertStyles[type] || alertStyles.danger;
  const title = alertTitles[type] || alertTitles.danger;

  return (
    <div className={style} role="alert">
      <span className="font-semibold">{title}</span> {message}
    </div>
  );
};

export default AuthAlert;