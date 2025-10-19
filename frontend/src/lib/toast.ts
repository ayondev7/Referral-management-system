import toast, { ToastOptions } from 'react-hot-toast';

const defaultInfoStyle: React.CSSProperties = {
  background: '#ffffff',
  color: '#0f172a',
  borderRadius: '0.75rem',
  padding: '1rem',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
  border: '1px solid #cbd5e1',
};

export function infoToast(message: string, opts?: ToastOptions) {
  return toast(message, {
    icon: 'ℹ️',
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#ffffff',
    },
    style: defaultInfoStyle,
    duration: opts?.duration ?? 3000,
    ...opts,
  });
}

export default toast;
