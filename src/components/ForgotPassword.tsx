import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../axios';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    if (!email) return;

    setLoading(true);
    setError('');
    try {
      await axios.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Помилка сервера. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setSent(false);
    setError('');
    setLoading(false);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { backgroundImage: 'none' } } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Відновлення паролю</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {sent ? (
            <Alert severity="success">
              Якщо обліковий запис з такою адресою існує, ми надіслали лист з посиланням для відновлення паролю.
            </Alert>
          ) : (
            <>
              <DialogContentText>
                Введіть електронну адресу вашого облікового запису і ми надішлемо посилання для відновлення паролю.
              </DialogContentText>
              <OutlinedInput
                autoFocus
                required
                margin="dense"
                id="forgot-email"
                name="email"
                placeholder="your@email.com"
                type="email"
                fullWidth
                disabled={loading}
              />
              {error && <Alert severity="error">{error}</Alert>}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={onClose}>{sent ? 'Закрити' : 'Скасувати'}</Button>
          {!sent && (
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Надіслати'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
