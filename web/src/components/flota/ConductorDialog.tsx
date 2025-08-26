'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { rut: string }) => void; // Se conecta luego al endpoint real
};

function normalizaRut(input: string) {
  const clean = input.replace(/[^0-9kK]/g, '').toUpperCase();
  if (!clean) return '';
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${withDots}-${dv}`;
}

export default function ConductorDialog({ open, onClose, onSubmit }: Props) {
  const [rut, setRut] = React.useState('');
  const [err, setErr] = React.useState('');

  const submit = () => {
    if (!rut) { setErr('RUT es obligatorio'); return; }
    setErr('');
    onSubmit({ rut: rut.toUpperCase() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nuevo Conductor (por RUT)</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: .5 }}>
          <Grid item xs={12}>
            <TextField
              label="RUT *"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e)=> setRut(normalizaRut(e.target.value))}
              fullWidth
              error={!!err}
              helperText={err || 'Alta por RUT. El resto del perfil lo completa el usuario en “Mi Perfil”.'}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="outlined" onClick={submit}>Guardar y agregar otro</Button>
        <Button variant="contained" onClick={()=>{ submit(); onClose(); }}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
