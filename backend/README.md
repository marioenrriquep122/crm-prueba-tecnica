# CRM App – Prueba Técnica

Sistema CRM desarrollado con Django REST Framework + Next.js 14.

## Stack Tecnológico

- **Backend:** Python 3.14, Django 5, Django REST Framework
- **Base de datos:** PostgreSQL 16
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **API externa:** RestCountries API (info de países por cliente)

## Requisitos Previos

- Python 3.10+
- Node.js 18+
- PostgreSQL 16

## Instalación Backend
```bash
# 1. Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar variables de entorno
# Copia .env.example a .env y ajusta los valores
cp .env.example .env

# 4. Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE crm_db;"

# 5. Aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# 6. Crear superusuario (opcional)
python manage.py createsuperuser

# 7. Correr el servidor
python manage.py runserver
```

El backend estará disponible en: http://localhost:8000

## Instalación Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:3000

## Automatización

Marca como "En seguimiento" las oportunidades con más de 7 días en estado "Nuevo":
```bash
python manage.py actualizar_oportunidades
```

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/POST | /api/clientes/ | Listar y crear clientes |
| GET/PUT/DELETE | /api/clientes/{id}/ | Detalle, editar, eliminar cliente |
| GET | /api/clientes/{id}/pais-info/ | Info del país del cliente |
| GET/POST | /api/oportunidades/ | Listar y crear oportunidades |
| GET/PUT/DELETE | /api/oportunidades/{id}/ | Detalle, editar, eliminar oportunidad |

## Variables de Entorno
```env
SECRET_KEY=tu-clave-secreta
DEBUG=True
DB_NAME=crm_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
```

## Estructura del Proyecto
```
crm-prueba/
├── crm/                          # App Django principal
│   ├── management/commands/      # Comando de automatización
│   ├── models.py                 # Modelos Cliente y Oportunidad
│   ├── serializers.py            # Serializers DRF
│   ├── views.py                  # ViewSets
│   ├── urls.py                   # Rutas API
│   ├── services.py               # Consumo API externa
│   └── admin.py                  # Panel admin
├── config/                       # Configuración Django
├── frontend/                     # Next.js App
│   ├── app/
│   │   ├── clientes/             # CRUD Clientes
│   │   └── oportunidades/        # CRUD Oportunidades
│   └── lib/api.ts                # Cliente HTTP
├── requirements.txt
└── README.md
```