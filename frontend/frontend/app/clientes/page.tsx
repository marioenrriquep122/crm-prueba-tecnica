'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { Cliente } from '@/lib/api';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clientes/');
      setClientes(res.data.results || res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  const eliminar = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
    await api.delete(`/clientes/${id}/`);
    fetchClientes();
  };

  const filtrados = clientes.filter(c =>
    c.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.empresa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <Link href="/clientes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
          + Nuevo Cliente
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o empresa..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-lg">Cargando clientes...</div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nombre', 'Empresa', 'Correo', 'Teléfono', 'Ciudad', 'Oportunidades', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(cliente => (
                <tr key={cliente.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{cliente.nombre_completo}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.empresa}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{cliente.correo_electronico}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.telefono}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.ciudad}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {cliente.total_oportunidades}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/clientes/${cliente.id}`}
                        className="text-blue-600 hover:underline text-sm font-medium">Ver</Link>
                      <Link href={`/clientes/${cliente.id}/editar`}
                        className="text-yellow-600 hover:underline text-sm font-medium">Editar</Link>
                      <button onClick={() => eliminar(cliente.id)}
                        className="text-red-600 hover:underline text-sm font-medium">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <p className="text-center text-gray-400 py-12">No hay clientes registrados.</p>
          )}
        </div>
      )}
    </div>
  );
}