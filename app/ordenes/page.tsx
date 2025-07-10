"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRestaurant } from "@/contexts/restaurant-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Order } from "@/types"
import { ClipboardList, Eye } from "lucide-react"
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    fetchOrders
  } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // useEffect para cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Órdenes</h1>
        <p className="text-muted-foreground">Visualiza y gestiona todas las órdenes del restaurante</p>
      </div>

      {/* Mostrar estado de carga y error para la lista de órdenes */}
      {loading && orders.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Cargando órdenes...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-8 text-red-500">
          <p>Error: {error}</p>
          <Button onClick={fetchOrders} className="mt-4">Reintentar</Button>
        </div>
      )}

      {(!loading || orders.length > 0) && ( // Solo muestra la tabla si no está cargando O si ya hay órdenes cargadas
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Órdenes ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 && !loading ? ( // Solo muestra "No hay órdenes" si no hay órdenes y ya no está cargando
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay órdenes registradas</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha de la Orden</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatDate(order.orderDate)}</p>
                          <p className="text-sm text-muted-foreground">
                            {(order.orderProducts?.length || 0)} producto{((order.orderProducts?.length || 0) !== 1) ? "s" : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(parseFloat(order.total))}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles de la Orden</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid gap-2">
                                  <p>
                                    <strong>Fecha:</strong> {formatDate(selectedOrder.orderDate)}
                                  </p>
                                  <p>
                                    <strong>ID de Orden:</strong> {selectedOrder.id}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Productos:</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead className="text-right">Precio Unit.</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.orderProducts?.map((item, index) => (
                                        <TableRow key={item.id}>
                                          <TableCell className="font-medium">{item.product.name}</TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(parseFloat(item.priceAtPurchase))}</TableCell>
                                          <TableCell className="text-right font-medium">
                                            {formatCurrency(parseFloat(item.priceAtPurchase) * item.quantity)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                <div className="border-t pt-4">
                                  <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total de la Orden:</span>
                                    <span className="text-green-600">{formatCurrency(parseFloat(selectedOrder.total))}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
