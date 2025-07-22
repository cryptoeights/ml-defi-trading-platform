"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

export default function RealTimeDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    // TODO: Replace with real API call or WebSocket
    setStats({
      activeTrades: 3,
      pnl: 1200.5,
      mlModelStatus: 'Healthy',
      alerts: 1,
    });
  }, []);

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active Trades</Typography>
            <Typography>{stats.activeTrades ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">PnL</Typography>
            <Typography>${stats.pnl ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">ML Model</Typography>
            <Typography>{stats.mlModelStatus ?? 'Unknown'}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Alerts</Typography>
            <Typography>{stats.alerts ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
} 