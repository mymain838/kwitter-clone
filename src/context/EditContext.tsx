import { createContext } from 'react';

export interface EditContextProps {
  edit: boolean;
  setEdit: (isEdit: boolean) => void;
}

export const EditContext = createContext<EditContextProps | null>(null);
