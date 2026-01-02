export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastProps {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss?: () => void;
}
