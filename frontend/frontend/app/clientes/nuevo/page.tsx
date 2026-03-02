'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function NuevoCliente() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre_completo: '', empresa: '', correo_electronico: '',
    telefono: '', ciudad: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nombre_completo.trim()) e.nombre_completo = 'Requerido';
    if (!form.empresa.trim()) e.empresa = 'Requerido';
    if (!form.correo_electronico.includes('@')) e.correo_electronico = 'Correo inválido';
    if (!form.telefono.trim()) e.telefono = 'Requerido';
    if (!form.ciudad.trim()) e.ciudad = 'Requerido';
    return e;
  };

  const handleSubmit = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setLoading(true);
    try {
      await api.post('/clientes/', form);
      router.push('/clientes');
    } catch (err: any) {
      if (err.response?.data) setErrores(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const campos = [
    { name: 'nombre_completo', label: 'Nombre Completo', type: 'text' },
    { name: 'empresa', label: 'Empresa', type: 'text' },
    { name: 'correo_electronico', label: 'Correo Electrónico', type: 'email' },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'ciudad', label: 'Ciudad / País', type: 'text' },
  ];

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Cliente</h1>
      <div className="bg-white text-black shadow rounded-xl p-6 flex flex-col gap-4">
        {campos.map(campo => (
          <div key={campo.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type={campo.type}
              value={(form as any)[campo.name]}
              onChange={e => setForm({ ...form, [campo.name]: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores[campo.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errores[campo.name] && (
              <p className="text-red-500 text-xs mt-1">{errores[campo.name]}</p>
            )}
          </div>
        ))}
        <div className="flex gap-3 mt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors">
            {loading ? 'Guardando...' : 'Guardar Cliente'}
          </button>
          <button onClick={() => router.back()}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}