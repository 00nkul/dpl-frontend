import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, clearImportState } from '../store/importSlice';
import { fetchAnalytics } from '../store/analyticsSlice';
import { fetchProducts, fetchCategories } from '../store/productsSlice';
import api from '../services/api';
import {
  Box, Button, Typography, Alert, LinearProgress, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Stack, Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function FileUpload() {
  const dispatch = useDispatch();
  const { loading, result, error } = useSelector((s) => s.import);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      setFileName(file.name);
      dispatch(uploadFile(file)).then((action) => {
        if (uploadFile.fulfilled.match(action)) {
          dispatch(fetchAnalytics());
          dispatch(fetchCategories());
          dispatch(fetchProducts({ page: 1, limit: 10 }));
        }
      });
    },
    [dispatch]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDeleteAll = async () => {
    setDeleteLoading(true);
    setDeleteResult(null);
    try {
      const res = await api.delete('/data');
      setDeleteResult({ success: true, message: res.data.message });
      dispatch(fetchAnalytics());
      dispatch(fetchCategories());
      dispatch(fetchProducts({ page: 1, limit: 10 }));
    } catch (err) {
      setDeleteResult({ success: false, message: err.message });
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Import Data
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweepIcon />}
          onClick={() => setDeleteOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Delete All Data
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
        {/* Drop zone */}
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          component="label"
          sx={{
            flex: 1,
            border: '2px dashed',
            borderColor: dragging ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            bgcolor: dragging ? '#e3f2fd' : 'grey.50',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            '&:hover': { borderColor: 'primary.main', bgcolor: '#e3f2fd' },
          }}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <UploadFileIcon sx={{ fontSize: 36, color: dragging ? 'primary.main' : 'grey.400' }} />
          <Typography variant="body2" fontWeight={500} color={dragging ? 'primary.main' : 'text.secondary'}>
            {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            CSV / Excel · Max 10 MB
          </Typography>
        </Box>

        {/* Status panel */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
          {loading && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <InsertDriveFileIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                  {fileName}
                </Typography>
              </Stack>
              <LinearProgress sx={{ borderRadius: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Uploading and processing…
              </Typography>
            </Box>
          )}

          {result && !loading && (
            <Alert
              severity="success"
              icon={<CheckCircleOutlineIcon />}
              onClose={() => dispatch(clearImportState())}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Import complete
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                <Chip label={`Total: ${result.data?.total}`} size="small" variant="outlined" />
                <Chip label={`Imported: ${result.data?.imported}`} size="small" color="success" />
                {result.data?.skipped > 0 && (
                  <Chip label={`Skipped: ${result.data?.skipped}`} size="small" color="warning" />
                )}
              </Stack>
            </Alert>
          )}

          {error && !loading && (
            <Alert severity="error" onClose={() => dispatch(clearImportState())} sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {deleteResult && (
            <Alert
              severity={deleteResult.success ? 'info' : 'error'}
              onClose={() => setDeleteResult(null)}
              sx={{ borderRadius: 2 }}
            >
              {deleteResult.message}
            </Alert>
          )}

          {!loading && !result && !error && !deleteResult && (
            <Box sx={{ color: 'text.disabled', textAlign: 'center' }}>
              <Typography variant="body2">No file uploaded yet</Typography>
              <Typography variant="caption">Upload a CSV or Excel file to get started</Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onClose={() => !deleteLoading && setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>Delete All Data?</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>all products and reviews</strong> from the database. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteLoading} variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAll}
            color="error"
            variant="contained"
            size="small"
            disabled={deleteLoading}
            startIcon={<DeleteSweepIcon />}
          >
            {deleteLoading ? 'Deleting…' : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
