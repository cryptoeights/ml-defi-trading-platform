"use client";
import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, Typography, Paper, CircularProgress, Alert } from '@mui/material';

export default function AIChat() {
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: true, text: input }]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) throw new Error('Failed to get AI response');
      const data = await res.json();
      setMessages(msgs => [...msgs, { user: false, text: data.reply }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>AI Chat (GAIA)</Typography>
      <List sx={{ maxHeight: 200, overflow: 'auto' }}>
        {messages.map((msg, i) => (
          <ListItem key={i} sx={{ justifyContent: msg.user ? 'flex-end' : 'flex-start' }}>
            <Box bgcolor={msg.user ? 'primary.main' : 'grey.300'} color={msg.user ? 'white' : 'black'} px={2} py={1} borderRadius={2}>
              {msg.text}
            </Box>
          </ListItem>
        ))}
      </List>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box display="flex" gap={1} mt={2}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          fullWidth
          placeholder="Ask GAIA or the ML system..."
          disabled={loading}
        />
        <Button onClick={sendMessage} variant="contained" disabled={loading}>Send</Button>
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Box>
    </Paper>
  );
} 