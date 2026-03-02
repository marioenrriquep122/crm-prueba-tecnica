import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-4xl font-bold text-gray-800">Sistema CRM</h1>
      <p className="text-gray-500 text-lg">Gestión de Clientes y Oportunidades</p>
      <div className="flex gap-4">
        <Link href="/clientes"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-medium text-lg transition-colors">
          Ver Clientes
        </Link>
        <Link href="/oportunidades"
          className="bg-gray-700 text-white px-8 py-3 rounded-xl hover:bg-gray-800 font-medium text-lg transition-colors">
          Ver Oportunidades
        </Link>
      </div>
    </div>
  );
}