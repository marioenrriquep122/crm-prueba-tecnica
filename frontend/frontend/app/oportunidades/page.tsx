'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { Oportunidad } from '@/lib/api';

const COLORES: Record<string, string> = {
  'Nuevo': 'bg-blue-100 text-blue-700',
  'Contactado': 'bg-yellow-100 text-yellow-700',
  'En negociación': 'bg-purple-100 text-purple-700',
  'En seguimiento': 'bg-orange-100 text-orange-700',
  'Cerrado': 'bg-green-100 text-green-700',
};

export default function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  const fetchOportunidades = async () => {
    setLoading(true);
    try {
      const params = filtroEstado ? `?estado=${filtroEstado}` : '';
      const res = await api.get(`/oportunidades/${params}`);
      setOportunidades(res.data.results || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOportunidades(); }, [filtroEstado]);

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta oportunidad?')) return;
    await api.delete(`/oportunidades/${id}/`);
    fetchOportunidades();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Oportunidades</h1>
        <Link href="/oportunidades/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
          + Nueva Oportunidad
        </Link>
      </div>

      <select
        value={filtroEstado}
        onChange={e => setFiltroEstado(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los estados</option>
        {['Nuevo', 'Contactado', 'En negociación', 'En seguimiento', 'Cerrado'].map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando...</div>
      ) : (
        <div className="bg-white text-black shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Cliente', 'Descripción', 'Valor Estimado', 'Estado', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {oportunidades.map(op => (
                <tr key={op.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{op.cliente}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{op.descripcion}</td>
                  <td className="px-4 py-3 text-sm">${Number(op.valor_estimado).toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLORES[op.estado]}`}>
                      {op.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(op.fecha_creacion).toLocaleDateString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/oportunidades/${op.id}/editar`}
                        className="text-yellow-600 hover:underline text-sm font-medium">Editar</Link>
                      <button onClick={() => eliminar(op.id)}
                        className="text-red-600 hover:underline text-sm font-medium">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {oportunidades.length === 0 && (
            <p className="text-center text-gray-400 py-12">No hay oportunidades.</p>
          )}
        </div>
      )}
    </div>
  );
}