'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { Cliente, Oportunidad, PaisInfo } from '@/lib/api';

const COLORES: Record<string, string> = {
  'Nuevo': 'bg-blue-100 text-blue-700',
  'Contactado': 'bg-yellow-100 text-yellow-700',
  'En negociación': 'bg-purple-100 text-purple-700',
  'En seguimiento': 'bg-orange-100 text-orange-700',
  'Cerrado': 'bg-green-100 text-green-700',
};

export default function DetalleCliente() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
  const [paisInfo, setPaisInfo] = useState<PaisInfo | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, oRes, pRes] = await Promise.all([
          api.get(`/clientes/${id}/`),
          api.get(`/oportunidades/?cliente=${id}`),
          api.get(`/clientes/${id}/pais-info/`),
        ]);
        setCliente(cRes.data);
        setOportunidades(oRes.data.results || oRes.data);
        setPaisInfo(pRes.data);
      } catch (e) { console.error(e); }
    };
    load();
  }, [id]);

  const eliminarOportunidad = async (oid: number) => {
    if (!confirm('¿Eliminar esta oportunidad?')) return;
    await api.delete(`/oportunidades/${oid}/`);
    setOportunidades(prev => prev.filter(o => o.id !== oid));
  };

  if (!cliente) return <div className="p-6 text-center text-gray-400 py-20">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{cliente.nombre_completo}</h1>
          <p className="text-gray-500">{cliente.empresa}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/clientes/${id}/editar`}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-medium transition-colors">
            Editar
          </Link>
          <button
            onClick={() => router.push('/clientes')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white text-black shadow rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">📋 Información</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600">Correo:</span> {cliente.correo_electronico}</p>
            <p><span className="font-medium text-gray-600">Teléfono:</span> {cliente.telefono}</p>
            <p><span className="font-medium text-gray-600">Ciudad:</span> {cliente.ciudad}</p>
            <p><span className="font-medium text-gray-600">Registro:</span> {new Date(cliente.fecha_registro).toLocaleDateString('es-CO')}</p>
          </div>
        </div>

        <div className="bg-white text-black shadow rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">🌍 Info del País</h2>
          {paisInfo?.success ? (
            <div className="flex gap-3">
              {paisInfo.bandera && (
                <img src={paisInfo.bandera} alt="bandera" className="w-14 h-9 object-cover rounded shadow" />
              )}
              <div className="text-sm space-y-1">
                <p><span className="font-medium">País:</span> {paisInfo.nombre}</p>
                <p><span className="font-medium">Capital:</span> {paisInfo.capital}</p>
                <p><span className="font-medium">Región:</span> {paisInfo.region}</p>
                <p><span className="font-medium">Moneda:</span> {paisInfo.moneda}</p>
                <p><span className="font-medium">Idioma:</span> {paisInfo.idioma}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">{paisInfo?.error || 'No disponible'}</p>
          )}
        </div>
      </div>

      <div className="bg-white text-black shadow rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700 text-lg">💼 Oportunidades ({oportunidades.length})</h2>
          <Link href={`/oportunidades/nueva?cliente=${id}`}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 font-medium transition-colors">
            + Agregar
          </Link>
        </div>
        {oportunidades.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Sin oportunidades registradas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Descripción</th>
                <th className="pb-2 font-medium">Valor</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Fecha</th>
                <th className="pb-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {oportunidades.map(op => (
                <tr key={op.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2">{op.descripcion}</td>
                  <td className="py-2">${Number(op.valor_estimado).toLocaleString('es-CO')}</td>
                  <td className="py-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLORES[op.estado]}`}>
                      {op.estado}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{new Date(op.fecha_creacion).toLocaleDateString('es-CO')}</td>
                  <td className="py-2 flex gap-2">
                    <Link href={`/oportunidades/${op.id}/editar`}
                      className="text-yellow-600 hover:underline font-medium">Editar</Link>
                    <button onClick={() => eliminarOportunidad(op.id)}
                      className="text-red-600 hover:underline font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}