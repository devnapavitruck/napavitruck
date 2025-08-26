'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, IconButton, Tooltip
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

type OtroDoc = { nombre: string; archivo?: File | null; vence: string };
type Props = { open: boolean; onClose: () => void; onSubmit: (payload: FormData) => void; };

export default function TractoDialog({ open, onClose, onSubmit }: Props) {
  const [f, setF] = React.useState({
    patente:'', marca:'', modelo:'', anio:'',
    docRevisionArchivo: null as File | null, docRevisionVence: '',
    docSoapArchivo: null as File | null, docSoapVence: '',
    docPermisoArchivo: null as File | null, docPermisoVence: '',
    otros: [] as OtroDoc[], // máx 5
  });
  const [err, setErr] = React.useState<Record<string,string>>({});

  const set = (k:string, v:any)=> setF(s=>({ ...s, [k]: v }));
  const setOtro = (i:number, k:keyof OtroDoc, v:any)=> setF(s=>{
    const arr = [...s.otros]; arr[i] = { ...arr[i], [k]: v }; return { ...s, otros: arr };
  });
  const addOtro = ()=> setF(s => s.otros.length >= 5 ? s : ({ ...s, otros: [...s.otros, { nombre:'', archivo:null, vence:'' }] }));
  const delOtro = (i:number)=> setF(s => ({ ...s, otros: s.otros.filter((_,ix)=>ix!==i) }));

  const validate=()=>{
    const e:Record<string,string> = {};
    if (!f.patente) e.patente='Patente es obligatoria';
    if (f.anio && (+f.anio < 1980 || +f.anio > new Date().getFullYear()+1)) e.anio='Año inválido';
    setErr(e); return Object.keys(e).length===0;
  };

  const submit=()=>{
    if(!validate()) return;
    const formData = new FormData();
    formData.append('patente', f.patente.toUpperCase());
    if (f.marca) formData.append('marca', f.marca);
    if (f.modelo) formData.append('modelo', f.modelo);
    if (f.anio) formData.append('anio', String(+f.anio));

    if (f.docRevisionArchivo) formData.append('docRevisionArchivo', f.docRevisionArchivo);
    if (f.docRevisionVence) formData.append('docRevisionVence', f.docRevisionVence);
    if (f.docSoapArchivo) formData.append('docSoapArchivo', f.docSoapArchivo);
    if (f.docSoapVence) formData.append('docSoapVence', f.docSoapVence);
    if (f.docPermisoArchivo) formData.append('docPermisoArchivo', f.docPermisoArchivo);
    if (f.docPermisoVence) formData.append('docPermisoVence', f.docPermisoVence);

    f.otros.forEach((o,ix)=>{
      if (o.nombre) formData.append(`otros[${ix}][nombre]`, o.nombre);
      if (o.archivo) formData.append(`otros[${ix}][archivo]`, o.archivo);
      if (o.vence) formData.append(`otros[${ix}][vence]`, o.vence);
    });

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Nuevo Tracto Camión</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt:.5 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Patente *"
              value={f.patente}
              onChange={(e)=>set('patente', e.target.value.toUpperCase())}
              fullWidth
              error={!!err.patente} helperText={err.patente}
            />
          </Grid>
          <Grid item xs={12} md={4}><TextField label="Marca"  value={f.marca} onChange={(e)=>set('marca', e.target.value)} fullWidth/></Grid>
          <Grid item xs={12} md={4}><TextField label="Modelo" value={f.modelo} onChange={(e)=>set('modelo', e.target.value)} fullWidth/></Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Año"
              value={f.anio}
              onChange={(e)=>set('anio', e.target.value.replace(/\D/g,''))}
              fullWidth
              error={!!err.anio} helperText={err.anio}
            />
          </Grid>

          {/* Revisión Técnica */}
          <Grid item xs={12}><strong>Revisión Técnica</strong></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="file"
              fullWidth
              inputProps={{ accept:'.pdf,.jpg,.jpeg,.png' }}
              onChange={(e)=> {
                const file = (e.target as HTMLInputElement).files?.[0] ?? null;
                set('docRevisionArchivo', file);
              }}
              label="Archivo"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="date" label="Vence" fullWidth InputLabelProps={{shrink:true}}
              value={f.docRevisionVence}
              onChange={(e)=>set('docRevisionVence', e.target.value)}
            />
          </Grid>

          {/* Seguro Obligatorio */}
          <Grid item xs={12}><strong>Seguro Obligatorio (SOAP)</strong></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="file"
              fullWidth
              inputProps={{ accept:'.pdf,.jpg,.jpeg,.png' }}
              onChange={(e)=> {
                const file = (e.target as HTMLInputElement).files?.[0] ?? null;
                set('docSoapArchivo', file);
              }}
              label="Archivo"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="date" label="Vence" fullWidth InputLabelProps={{shrink:true}}
              value={f.docSoapVence}
              onChange={(e)=>set('docSoapVence', e.target.value)}
            />
          </Grid>

          {/* Permiso de Circulación */}
          <Grid item xs={12}><strong>Permiso de Circulación</strong></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="file"
              fullWidth
              inputProps={{ accept:'.pdf,.jpg,.jpeg,.png' }}
              onChange={(e)=> {
                const file = (e.target as HTMLInputElement).files?.[0] ?? null;
                set('docPermisoArchivo', file);
              }}
              label="Archivo"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="date" label="Vence" fullWidth InputLabelProps={{shrink:true}}
              value={f.docPermisoVence}
              onChange={(e)=>set('docPermisoVence', e.target.value)}
            />
          </Grid>

          {/* Otros (x5) */}
          <Grid item xs={12} sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <strong>Otros documentos (máx. 5)</strong>
            <Button size="small" onClick={addOtro} disabled={f.otros.length>=5}>+ Agregar</Button>
          </Grid>
          {f.otros.map((o, ix)=>(
            <React.Fragment key={ix}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Nombre doc."
                  value={o.nombre}
                  onChange={(e)=>setOtro(ix,'nombre', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  type="file"
                  fullWidth
                  inputProps={{ accept:'.pdf,.jpg,.jpeg,.png' }}
                  onChange={(e)=> {
                    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
                    setOtro(ix,'archivo', file);
                  }}
                  label="Archivo"
                />
              </Grid>
              <Grid item xs={10} md={2}>
                <TextField
                  type="date" label="Vence" fullWidth InputLabelProps={{shrink:true}}
                  value={o.vence}
                  onChange={(e)=>setOtro(ix,'vence', e.target.value)}
                />
              </Grid>
              <Grid item xs={2} md={1} sx={{ display:'flex', alignItems:'center' }}>
                <Tooltip title="Quitar">
                  <IconButton onClick={()=>delOtro(ix)}><DeleteOutlineIcon/></IconButton>
                </Tooltip>
              </Grid>
            </React.Fragment>
          ))}
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
