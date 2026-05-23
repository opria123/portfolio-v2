// This file is used as a dedicated portal root for modals rendered outside the main app tree.
import { useEffect } from 'react';

export function ensureModalRoot() {
  useEffect(() => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }, []);
}
