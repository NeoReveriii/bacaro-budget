import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  useEffect(() => {
    if (!toast) return;
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`bbm-toast ${toast.type} show`}>
      {toast.message}
    </div>
  );
}
