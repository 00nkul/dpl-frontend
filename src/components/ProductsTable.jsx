import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setFilters, setPage, setPageSize, setSort } from '../store/productsSlice';
import {
  Box, Paper, Typography, TextField, MenuItem, Select, FormControl,
  InputLabel, InputAdornment, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, Rating, Stack, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const COLUMNS = [
  { id: 'product_name', label: 'Product Name', sortable: true, minWidth: 220 },
  { id: 'category', label: 'Category', sortable: true, minWidth: 140 },
  { id: 'discounted_price', label: 'Price', sortable: true, align: 'right' },
  { id: 'actual_price', label: 'MRP', sortable: true, align: 'right' },
  { id: 'discount_percentage', label: 'Discount', sortable: true, align: 'center' },
  { id: 'rating', label: 'Rating', sortable: true, align: 'center', minWidth: 160 },
  { id: 'rating_count', label: 'Ratings', sortable: true, align: 'right' },
  { id: 'review_count', label: 'Reviews', sortable: false, align: 'right' },
];

const DISCOUNT_COLORS = (v) => {
  if (v >= 60) return 'error';
  if (v >= 30) return 'warning';
  return 'success';
};

export default function ProductsTable() {
  const dispatch = useDispatch();
  const { items, pagination, categories, filters, sortBy, sortOrder, loading, error } =
    useSelector((s) => s.products);

  const load = useCallback(() => {
    dispatch(
      fetchProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, pagination.page, pagination.limit, filters, sortBy, sortOrder]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const handleFilterChange = (key) => (e) => dispatch(setFilters({ [key]: e.target.value }));

  const handleSort = (col) => {
    if (sortBy === col) {
      dispatch(setSort({ sortBy: col, sortOrder: sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
    } else {
      dispatch(setSort({ sortBy: col, sortOrder: 'ASC' }));
    }
  };

  const hasFilters = filters.search || filters.category || filters.minRating || filters.maxRating || filters.minReviews;
  const truncate = (str, n = 60) => str && str.length > n ? str.slice(0, n) + '…' : str;

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>Products</Typography>
        <Typography variant="body2" color="text.secondary">
          {pagination.total.toLocaleString()} total
        </Typography>
      </Box>

      <Divider />

      {/* Filters */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50' }}>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
          <FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />

          <TextField
            size="small"
            placeholder="Search product name…"
            value={filters.search}
            onChange={handleFilterChange('search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 210, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2 } }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={handleFilterChange('category')}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Min Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={filters.minRating}
            onChange={handleFilterChange('minRating')}
            sx={{ width: 100, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2 } }}
          />
          <TextField
            size="small"
            label="Max Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={filters.maxRating}
            onChange={handleFilterChange('maxRating')}
            sx={{ width: 100, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2 } }}
          />

          <TextField
            size="small"
            label="Min Reviews"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            value={filters.minReviews}
            onChange={handleFilterChange('minReviews')}
            sx={{ width: 110, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 2 } }}
          />

          {hasFilters && (
            <Chip
              label="Clear filters"
              onDelete={() => dispatch(setFilters({ search: '', category: '', minRating: '', maxRating: '', minReviews: '' }))}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      </Box>

      <Divider />

      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    minWidth: col.minWidth,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    bgcolor: 'grey.50',
                    color: 'text.secondary',
                    py: 1.5,
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder.toLowerCase() : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading products…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No products found</Typography>
                  {hasFilters && (
                    <Typography variant="caption" color="text.disabled">
                      Try adjusting your filters
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              items.map((row, idx) => (
                <TableRow
                  key={row.product_id}
                  hover
                  sx={{ bgcolor: idx % 2 === 0 ? 'white' : 'grey.50' }}
                >
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography variant="body2" fontWeight={500} title={row.product_name} noWrap sx={{ maxWidth: 250 }}>
                      {truncate(row.product_name, 60)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {row.category ? (
                      <Chip
                        label={truncate(row.category, 25)}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                        title={row.category}
                      />
                    ) : '—'}
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {row.discounted_price != null
                        ? `₹${Number(row.discounted_price).toLocaleString('en-IN')}`
                        : '—'}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: '0.75rem' }}>
                      {row.actual_price != null
                        ? `₹${Number(row.actual_price).toLocaleString('en-IN')}`
                        : '—'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {row.discount_percentage != null ? (
                      <Chip
                        label={`${row.discount_percentage}%`}
                        size="small"
                        color={DISCOUNT_COLORS(row.discount_percentage)}
                        sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                      />
                    ) : '—'}
                  </TableCell>

                  <TableCell align="center">
                    {row.rating != null ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Rating value={Number(row.rating)} precision={0.1} readOnly size="small" />
                        <Typography variant="caption" fontWeight={600}>{row.rating}</Typography>
                      </Box>
                    ) : '—'}
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2">
                      {row.rating_count != null ? Number(row.rating_count).toLocaleString('en-IN') : '—'}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Chip
                      label={row.review_count ?? 0}
                      size="small"
                      variant={Number(row.review_count) > 0 ? 'filled' : 'outlined'}
                      color={Number(row.review_count) > 0 ? 'primary' : 'default'}
                      sx={{ fontSize: '0.7rem', height: 22 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider />

      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page - 1}
        rowsPerPage={pagination.limit}
        onPageChange={(_, p) => dispatch(setPage(p + 1))}
        onRowsPerPageChange={(e) => dispatch(setPageSize(parseInt(e.target.value)))}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{ borderTop: 'none' }}
      />
    </Paper>
  );
}
