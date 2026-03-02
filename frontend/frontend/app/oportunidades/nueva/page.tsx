'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api, { Cliente } from '@/lib/api';

export default function NuevaOportunidad() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clienteIdParam = searchParams.get('cliente');

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [form, setForm] = useState({
        cliente: clienteIdParam || '',
        descripcion: '',
        valor_estimado: '',
        estado: 'Nuevo',
    });
    const [errores, setErrores] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/clientes/?page_size=100').then(res => {
            setClientes(res.data.results || res.data);
        });
    }, []);

    const validar = () => {
        const e: Record<string, string> = {};
        if (!form.cliente) e.cliente = 'Selecciona un cliente';
        if (!form.descripcion.trim()) e.descripcion = 'Requerido';
        if (!form.valor_estimado || isNaN(Number(form.valor_estimado))) e.valor_estimado = 'Valor numérico requerido';
        return e;
    };

    const handleSubmit = async () => {
        const e = validar();
        if (Object.keys(e).length > 0) { setErrores(e); return; }
        setLoading(true);
        try {
            await api.post('/oportunidades/', form);
            if (clienteIdParam) router.push(`/clientes/${clienteIdParam}`);
            else router.push('/oportunidades');
        } catch (err: any) {
            if (err.response?.data) setErrores(err.response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Nueva Oportunidad</h1>
            <div className="bg-white text-black shadow rounded-xl p-6 flex flex-col gap-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <select
                        value={form.cliente}
                        onChange={e => setForm({ ...form, cliente: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.cliente ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Seleccionar cliente...</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre_completo} – {c.empresa}</option>
                        ))}
                    </select>
                    {errores.cliente && <p className="text-red-500 text-xs mt-1">{errores.cliente}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                        value={form.descripcion}
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                        rows={3}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errores.descripcion && <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado ($)</label>
                    <input
                        type="number"
                        value={form.valor_estimado}
                        onChange={e => setForm({ ...form, valor_estimado: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.valor_estimado ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errores.valor_estimado && <p className="text-red-500 text-xs mt-1">{errores.valor_estimado}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        value={form.estado}
                        onChange={e => setForm({ ...form, estado: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {['Nuevo', 'Contactado', 'En negociación', 'En seguimiento', 'Cerrado'].map(e => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 mt-2">
                    <button onClick={handleSubmit} disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors">
                        {loading ? 'Guardando...' : 'Guardar'}
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