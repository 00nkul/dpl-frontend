import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  ThemeProvider, createTheme, CssBaseline, Container,
  AppBar, Toolbar, Typography, Box,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { fetchAnalytics } from './store/analyticsSlice';
import { fetchCategories } from './store/productsSlice';
import FileUpload from './components/FileUpload';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import ProductsTable from './components/ProductsTable';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f0f2f5' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAnalytics());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1.5, p: 0.8, display: 'flex' }}>
            <BarChartIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              Product Review Analytics
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              Dashboard
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', py: 3 }}>
        <Container maxWidth="xl">
          <FileUpload />
          <SummaryCards />
          <Charts />
          <ProductsTable />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
