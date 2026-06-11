import { useState } from 'react';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import {
  Download as DownloadIcon,
  Description as CsvIcon,
  GridOn as XlsxIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { API } from '../constants';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  resource: 'customers' | 'deals' | 'products';
};

export function ExportMenu({ resource }: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const { token } = useAuth();

  const download = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setAnchor(null);
    const url = `${API}/api/export/${resource}.${format}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `${resource}-${new Date().toISOString().slice(0, 10)}.${format}`;
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={e => setAnchor(e.currentTarget)}
        size="medium"
      >
        Exportar
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => download('csv')}>
          <ListItemIcon><CsvIcon fontSize="small" /></ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => download('xlsx')}>
          <ListItemIcon><XlsxIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Excel (.xlsx)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => download('pdf')}>
          <ListItemIcon><PdfIcon fontSize="small" /></ListItemIcon>
          <ListItemText>PDF</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
