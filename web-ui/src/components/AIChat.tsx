"use client";
import { useState } from 'react';
import { Box, TextField, Button, List, ListItem, Typography, Paper } from '@mui/material';

export default function AIChat() {
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: true, text: input }]);
    // TODO: Replace with real backend call
    setTimeout(() => {
      setMessages(msgs => [...msgs, { user: false, text: 'AI: This is a sample response.' }]);
    }, 500);
    setInput('');
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
      <Box display="flex" gap={1} mt={2}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          fullWidth
          placeholder="Ask GAIA or the ML system..."
        />
        <Button onClick={sendMessage} variant="contained">Send</Button>
      </Box>
    </Paper>
  );
} 