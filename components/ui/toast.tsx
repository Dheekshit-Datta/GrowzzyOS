import * as React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const Toast = ({ title, description, variant = 'info', duration = 3000 }: ToastProps) => {
  React.useEffect(() => {
    if (title || description) {
      const timer = setTimeout(() => {
        // Auto-hide toast
      }, duration);

      return () => clearTimeout(timer);
    };

    return (
      <div className="fixed top-4 right-4 z-50 flex items-start space-x-2 max-w-sm">
        <div
          className={`
            p-4 rounded-lg shadow-lg border
            ${variant === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
            ${variant === 'error' ? 'bg-red-50 border-red-200 text-red-800' : ''}
            ${variant === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : ''}
            ${variant === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
            ${!variant ? 'bg-gray-50 border-gray-200 text-gray-800' : ''}
          `}
        >
          <div className="flex items-start space-x-2">
            {variant === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {variant === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
            {variant === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
            {variant === 'info' && <AlertCircle className="h-5 w-5 text-blue-600" />}
            <div className="flex-1">
              {title && <h4 className="font-semibold">{title}</h4>}
              {description && <p className="text-sm mt-1">{description}</p>}
            </div>
          </div>
        </div>
      </div>
    );
};

export const showToast = (message: string, variant: ToastProps['variant'] = 'info') => {
  // Create a toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(toastContainer);
  }

  const toast = React.createElement(Toast, {
    title: message,
    variant,
    duration: 3000
  });

  // Clear the container and add the new toast
  toastContainer.innerHTML = '';
  toastContainer.appendChild(toast);

  // Auto-remove the toast after duration
  setTimeout(() => {
    if (document.getElementById('toast-container')) {
      document.body.removeChild(toastContainer);
    }
  }, 3000);
};
