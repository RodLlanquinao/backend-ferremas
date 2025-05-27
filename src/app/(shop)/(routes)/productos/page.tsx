'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product } from '@/types/product'
import { productsApi } from '@/services/api/products'
import { ProductCard } from '@/components/ui/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

interface FilterState {
  search: string
  categoria: string
  minPrice: string
  maxPrice: string
}

const initialFilters: FilterState = {
  search: '',
  categoria: '',
  minPrice: '',
  maxPrice: ''
}

const categorias = [
  { value: '', label: 'Todas las categorías' },
  { value: 'herramientas-electricas', label: 'Herramientas Eléctricas' },
  { value: 'herramientas-manuales', label: 'Herramientas Manuales' },
  { value: 'materiales-construccion', label: 'Materiales de Construcción' },
  { value: 'ferreteria', label: 'Ferretería' }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const searchParams = useSearchParams()

  useEffect(() => {
    const categoria = searchParams.get('categoria') || ''
    setFilters(prev => ({ ...prev, categoria }))
  }, [searchParams])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        // En un caso real, pasaríamos los filtros a la API
        const response = await productsApi.getAll()
        let filteredProducts = response.products

        // Aplicar filtros en el cliente (en un caso real, esto se haría en el backend)
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredProducts = filteredProducts.filter(
            product => 
              product.name.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower)
          )
        }

        if (filters.categoria) {
          filteredProducts = filteredProducts.filter(
            product => product.category === filters.categoria
          )
        }

        if (filters.minPrice) {
          filteredProducts = filteredProducts.filter(
            product => product.price >= parseInt(filters.minPrice)
          )
        }

        if (filters.maxPrice) {
          filteredProducts = filteredProducts.filter(
            product => product.price <= parseInt(filters.maxPrice)
          )
        }

        setProducts(filteredProducts)
      } catch (err) {
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Los filtros ya están actualizados a través del estado controlado
  }

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="aspect-square mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <EmptyState
          icon={X}
          title="Error"
          description={error}
          actionLabel="Intentar nuevamente"
          actionHref="/productos"
        />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Buscar
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Categoría
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {categorias.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Precio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </form>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Productos</h1>
            <span className="text-muted-foreground">
              {products.length} productos encontrados
            </span>
          </div>

          {products.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No se encontraron productos"
              description="Intenta ajustar los filtros o busca algo diferente."
              actionLabel="Limpiar filtros"
              actionHref="/productos"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

