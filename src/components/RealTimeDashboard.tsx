"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';

export default function RealTimeDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        if (isMounted) setStats(data);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return null;

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