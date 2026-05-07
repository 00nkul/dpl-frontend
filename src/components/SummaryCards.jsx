import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const cards = [
  { key: 'total_products', label: 'Total Products', icon: Inventory2Icon, gradient: 'linear-gradient(135deg,#1976d2,#42a5f5)' },
  { key: 'total_categories', label: 'Categories', icon: CategoryIcon, gradient: 'linear-gradient(135deg,#7b1fa2,#ba68c8)' },
  { key: 'total_reviews', label: 'Total Reviews', icon: RateReviewIcon, gradient: 'linear-gradient(135deg,#2e7d32,#66bb6a)' },
  { key: 'avg_rating', label: 'Avg Rating', icon: StarRoundedIcon, gradient: 'linear-gradient(135deg,#e65100,#ffa726)', suffix: '/ 5' },
  { key: 'avg_discount', label: 'Avg Discount', icon: LocalOfferIcon, gradient: 'linear-gradient(135deg,#c62828,#ef5350)', suffix: '%' },
];

export default function SummaryCards() {
  const { summary, loading } = useSelector((s) => s.analytics);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map(({ key, label, icon: Icon, gradient, suffix }) => (
        <Grid item xs={12} sm={6} md={2.4} key={key}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 3 },
            }}
          >
            <Box
              sx={{
                background: gradient,
                borderRadius: 2,
                p: 1.2,
                display: 'flex',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Icon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
                {label}
              </Typography>
              {loading ? (
                <Skeleton width={64} height={30} />
              ) : (
                <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {summary ? (summary[key] ?? '—') : '—'}
                  {suffix && summary?.[key] ? (
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      {suffix}
                    </Typography>
                  ) : null}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
