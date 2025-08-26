// Catálogos tomados del documento maestro (resumen curado).
// Tipos de Servicio
export const TIPOS_SERVICIO = [
  { id: 'ONE_WAY', descripcion: 'One Way' },
  { id: 'ROUND_TRIP', descripcion: 'Round Trip' },
];

// Tipos de Semirremolque (subset representativo + "Otro")
export const TIPOS_SEMIRREMOLQUE = [
  { id: 'RAMPLA_PLANA', descripcion: 'Rampla plana' },
  { id: 'CUELLO_CISNE', descripcion: 'Rampla cuello cisne' },
  { id: 'PORTA_CONT_20', descripcion: 'Porta contenedor 20 pies' },
  { id: 'REFRIGERADO', descripcion: 'Refrigerado' },
  { id: 'SIDER', descripcion: 'Rampla Sider-Encarpada' },
  { id: 'ISO_TANQUE', descripcion: 'ISO-Tanque' },
  { id: 'ROTAINER', descripcion: 'Rotainer' },
  { id: 'OTRO', descripcion: 'Otro tipo de semi' },
];

// Tipos de Carga (subset representativo + "Otro")
export const TIPOS_CARGA = [
  { id: 'DESCONSOLIDADA', descripcion: 'Desconsolidada' },
  { id: 'PALETIZADA', descripcion: 'Paletizada' },
  { id: 'CONT_20_STD', descripcion: 'Contenedor 20 pies estándar' },
  { id: 'CONT_20_HC', descripcion: 'Contenedor 20 pies HighCube' },
  { id: 'CONT_40_STD', descripcion: 'Contenedor 40 pies estándar' },
  { id: 'CONT_40_HC', descripcion: 'Contenedor 40 pies HighCube' },
  { id: 'ISO_TANQUE', descripcion: 'ISO-Tanque' },
  { id: 'ROTAINER', descripcion: 'Rotainer' },
  { id: 'REF_VERDURAS', descripcion: 'Refrigerado - Verduras' },
  { id: 'REF_FRUTAS', descripcion: 'Refrigerado - Frutas' },
  { id: 'REF_CARNICOS', descripcion: 'Refrigerado - Cárnicos' },
  { id: 'REF_LACTEOS', descripcion: 'Refrigerado - Lácteos' },
  { id: 'REF_CONGELADOS', descripcion: 'Refrigerado - Congelados' },
  { id: 'OTRO', descripcion: 'Otro tipo de carga' },
];

// Métodos de pago (display)
export const METODOS_PAGO = ['Transferencia', 'Tarjeta', 'Efectivo', 'Otro'] as const;

// Planes por días (catálogo fijo). Los valores CLP se obtendrán desde Config.
export const PLANES_DIAS = [
  { dias: 30, id: 'P30' },
  { dias: 90, id: 'P90' },
  { dias: 180, id: 'P180' },
  { dias: 360, id: 'P360' },
] as const;
