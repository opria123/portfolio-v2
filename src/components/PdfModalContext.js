import { createContext, useContext } from 'react';

export const PdfModalContext = createContext({
  showPdf: false,
  setShowPdf: () => {},
});

export function usePdfModal() {
  return useContext(PdfModalContext);
}
