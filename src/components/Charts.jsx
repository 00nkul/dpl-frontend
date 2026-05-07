import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';

const COLORS = [
  '#1976d2','#9c27b0','#2e7d32','#ed6c02','#d32f2f',
  '#0288d1','#7b1fa2','#388e3c','#f57c00','#c62828',
  '#0097a7','#558b2f','#6a1b9a','#1565c0','#ad1457',
];

function ChartCard({ title, children, loading, height = 380 }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        {title}
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" sx={{ flex: 1, borderRadius: 1 }} />
      ) : (
        <Box sx={{ flex: 1 }}>{children}</Box>
      )}
    </Paper>
  );
}

const truncateLabel = (label, max = 13) =>
  label && label.length > max ? label.slice(0, max) + '…' : label;

const CustomTooltip = ({ active, payload, label, valueName }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }} elevation={3}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {valueName}: {payload[0].value}
      </Typography>
    </Paper>
  );
};

export default function Charts() {
  const { productsPerCategory, topReviewed, discountDistribution, categoryAvgRating, loading } =
    useSelector((s) => s.analytics);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Products per Category */}
      <Grid item xs={12} md={6}>
        <ChartCard title="Products per Category" loading={loading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productsPerCategory} margin={{ top: 4, right: 10, left: -15, bottom: 55 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="category"
                tickFormatter={(v) => truncateLabel(v, 13)}
                angle={-40}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: '#666' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#666' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip valueName="Products" />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {productsPerCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      {/* Top Reviewed Products */}
      <Grid item xs={12} md={6}>
        <ChartCard title="Top Reviewed Products" loading={loading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topReviewed} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#666' }} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="product_name"
                type="category"
                width={140}
                tick={{ fontSize: 11, fill: '#555' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => truncateLabel(v, 22)}
              />
              <Tooltip content={<CustomTooltip valueName="Reviews" />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="review_count" name="Reviews" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {topReviewed.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
                <LabelList dataKey="review_count" position="right" style={{ fontSize: 11, fill: '#555' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      {/* Discount Distribution Histogram */}
      <Grid item xs={12} md={6}>
        <ChartCard title="Discount Distribution" loading={loading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={discountDistribution} margin={{ top: 4, right: 10, left: -15, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#666' }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#666' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip valueName="Products" />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} maxBarSize={44}>
                {discountDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
                <LabelList dataKey="count" position="top" style={{ fontSize: 11, fill: '#555' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      {/* Category-wise Average Rating */}
      <Grid item xs={12} md={6}>
        <ChartCard title="Category-wise Average Rating (Top 15)" loading={loading} height={440}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryAvgRating} layout="vertical" margin={{ top: 4, right: 50, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis
                type="number"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: '#666' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={145}
                tick={{ fontSize: 11, fill: '#555' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => truncateLabel(v, 22)}
              />
              <Tooltip content={<CustomTooltip valueName="Avg Rating" />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="avg_rating" name="Avg Rating" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {categoryAvgRating.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
                <LabelList dataKey="avg_rating" position="right" style={{ fontSize: 11, fill: '#555', fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Grid>
  );
}
