"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/contexts/restaurant-context";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function OrderSummary() {
  const { cart, removeFromCart, getCartTotal, createOrder, loading } =
    useRestaurant();

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      toast.info("Debe agregar al menos un producto a la orden.");
      return;
    }

    try {
      await createOrder();
      toast.success("¡Orden creada exitosamente!");
    } catch (err) {
      console.error("Error al crear la orden:", err);
      toast.error(
        "Error al crear la orden: " + (err as any)?.message ||
          "Inténtelo de nuevo."
      );
    }
  };

  // Se mantiene el renderizado cuando no hay productos en el carrito
  if (cart.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Resumen de la Orden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No hay productos en la orden
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Resumen de la Orden
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x{" "}
                  {formatCurrency(parseFloat(item.product.price as string))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {formatCurrency(
                    parseFloat(item.product.price as string) * item.quantity
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.product.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-green-600">
              {formatCurrency(getCartTotal())}
            </span>
          </div>
        </div>

        <Button
          onClick={handleCreateOrder}
          className="w-full"
          size="lg"
          disabled={loading} // Boton deshabilitado si está cargando
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cerrando Orden...
            </>
          ) : (
            "Cerrar Orden"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}