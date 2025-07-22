"use client";
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggle({ mode, toggleTheme }: { mode: string, toggleTheme: () => void }) {
  return (
    <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
} 