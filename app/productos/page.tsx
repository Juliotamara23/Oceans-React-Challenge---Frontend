"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRestaurant } from "@/contexts/restaurant-context";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { formatCurrency } from "@/lib/utils";
import { InputField } from "@/components/form-field";
import { Plus, Package } from "lucide-react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const { products, addProduct, loading, error, fetchProducts } =
    useRestaurant();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  //useEffect para cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await addProduct(data);
      reset();
      setShowForm(false);
      toast.success("Producto creado exitosamente");
    } catch (error) {
      console.error("Error al crear el producto:", error);
      toast.error(
        "Error al crear el producto. " + (error as any)?.message || ""
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos del restaurante
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Nombre del Producto"
                  placeholder="Ej: Pizza Margherita"
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />
                <InputField
                  label="Precio"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.price?.message}
                  required
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting || loading}>
                  {" "}
                  {isSubmitting || loading ? ( //Loader de cargando
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isSubmitting ? "Creando..." : "Cargando..."}
                    </>
                  ) : (
                    "Crear Producto"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Estado de carga y error para la lista de productos */}
      {loading &&
        !showForm &&
        products.length === 0 && ( // Muestra el loader solo si no hay productos y el formulario no está visible
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        )}

      {error &&
        !loading && ( // Muestra error si existe y no está cargando
          <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
            <Button onClick={fetchProducts} className="mt-4">
              Reintentar
            </Button>
          </div>
        )}

      {/* Condicional para mostrar la tabla solo si no hay carga y no hay error O si hay productos */}
      {!loading && !error && products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Productos ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay productos registrados
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        (!loading || products.length > 0) && ( // Solo muestra la tabla si no está cargando O si ya hay productos cargados
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lista de Productos ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(product.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
