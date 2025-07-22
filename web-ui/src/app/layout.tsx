"use client";
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import ThemeToggle from '../components/ThemeToggle';
import '../app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(
    (typeof window !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')) || 'dark'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode);
    }
  }, [mode]);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
      },
    }), [mode]);

  const toggleTheme = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Unified Trading Platform
              </Typography>
              <ThemeToggle mode={mode} toggleTheme={toggleTheme} />
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 2 }}>
        {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
