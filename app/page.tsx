"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRestaurant } from "@/contexts/restaurant-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Package, ShoppingCart, ClipboardList, TrendingUp, Loader2 } from "lucide-react"

export default function Dashboard() {
  const {
    products,
    orders,
    loading,
    error,
    fetchProducts,
    fetchOrders
  } = useRestaurant()

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  const stats = [
    {
      title: "Total Productos",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Órdenes Totales",
      value: orders.length,
      icon: ClipboardList,
      color: "text-green-600",
    },
    {
      title: "Ingresos Totales",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Valor Promedio por Orden",
      value: formatCurrency(averageOrderValue),
      icon: ShoppingCart,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del sistema de gestión del restaurante</p>
      </div>

      {loading && products.length === 0 && orders.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error al cargar el dashboard: {error}</p>
          <button onClick={() => { fetchProducts(); fetchOrders(); }} className="mt-4 text-blue-500 hover:underline">Reintentar</button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products.slice(0, 5).length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hay productos recientes</p>
                  ) : (
                    products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-green-600">{formatCurrency(parseFloat(product.price as string))}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Órdenes Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {orders.slice(0, 5).length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hay órdenes recientes</p>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</span>
                        <span className="font-medium text-green-600">{formatCurrency(parseFloat(order.total))}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}