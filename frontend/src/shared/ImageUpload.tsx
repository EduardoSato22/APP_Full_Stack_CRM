import { useRef, useState } from 'react';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { CloudUpload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../constants';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Imagem' }: Props) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande (máx 5 MB)');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao enviar imagem');
      }

      const { url } = await res.json();
      onChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const imgSrc = value
    ? (value.startsWith('/uploads/') ? `${API}${value}` : value)
    : null;

  return (
    <Box>
      {imgSrc ? (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box
            component="img"
            src={imgSrc}
            alt={label}
            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider', display: 'block' }}
          />
          <IconButton
            size="small"
            onClick={() => onChange('')}
            sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 0.25 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer',
            minHeight: 72,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            '&:hover': { borderColor: uploading ? 'divider' : 'primary.main', bgcolor: uploading ? 'transparent' : 'action.hover' },
          }}
        >
          {uploading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <UploadIcon color="action" />
              <Typography variant="caption" color="text.secondary">
                {label} — clique ou arraste
              </Typography>
            </>
          )}
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="error" display="block" mt={0.5}>
          {error}
        </Typography>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </Box>
  );
}
