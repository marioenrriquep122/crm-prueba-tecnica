import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

export default api;

export interface Cliente {
  id: number;
  nombre_completo: string;
  empresa: string;
  correo_electronico: string;
  telefono: string;
  ciudad: string;
  fecha_registro: string;
  total_oportunidades: number;
}

export interface Oportunidad {
  id: number;
  cliente: number;
  descripcion: string;
  valor_estimado: string;
  estado: 'Nuevo' | 'Contactado' | 'En negociación' | 'En seguimiento' | 'Cerrado';
  fecha_creacion: string;
}

export interface PaisInfo {
  success: boolean;
  nombre?: string;
  capital?: string;
  poblacion?: number;
  region?: string;
  bandera?: string;
  moneda?: string;
  idioma?: string;
  error?: string;
}