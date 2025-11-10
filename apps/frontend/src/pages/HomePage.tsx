import { useNavigate } from 'react-router-dom'
import { SearchBar, type SearchParams } from '@/components/molecules/SearchBar'

export function HomePage() {
  const navigate = useNavigate()

  const handleSearch = (params: SearchParams) => {
    // Validar que las fechas estén presentes
    if (!params.fechaInicio || !params.fechaFin) {
      return
    }

    // Construir query params para la página de resultados
    const searchParams = new URLSearchParams({
      destino: params.destino,
      checkIn: params.fechaInicio.toISOString(),
      checkOut: params.fechaFin.toISOString(),
      adultos: params.huespedes.adultos.toString(),
      ninos: params.huespedes.ninos.toString(),
      bebes: params.huespedes.bebes.toString(),
    })

    navigate(`/resultados?${searchParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Encuentra tu habitación perfecta</h1>
            <p className="text-xl text-base-content/70 mb-8">
              Busca entre nuestras habitaciones disponibles y reserva tu estadía ideal
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Buscar disponibilidad</h2>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Búsqueda fácil</h3>
            <p className="text-base-content/70">
              Encuentra habitaciones disponibles según tus fechas y preferencias
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Reserva rápida</h3>
            <p className="text-base-content/70">
              Confirma tu reserva en pocos pasos con nuestro proceso simplificado
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Seguro y confiable</h3>
            <p className="text-base-content/70">
              Tu información está protegida y tus reservas están garantizadas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

