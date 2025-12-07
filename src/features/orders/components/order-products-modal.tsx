import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Order } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface OrderProductsModalProps {
  products: Order['products']
  orderId: string
  children: React.ReactNode
}

const OrderProductsModal = ({
  products,
  orderId,
  children,
}: OrderProductsModalProps) => {
  // Calculate total amount
  const totalAmount = products.reduce(
    (sum, product) => sum + product.totalPrice,
    0
  )

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Order Products</DialogTitle>
          <DialogDescription>
            Order ID: {orderId} | Total Items: {products.length} | Total Amount:{' '}
            {formatCurrency(totalAmount)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {products.map((product, index) => {
              // Handle the case where product might not have a variant
              const hasVariant = product.variant && Object.keys(product.variant).length > 0;
              const productName = hasVariant ? product.variant?.name : product.product.name;
              const productDescription = hasVariant ? product.variant?.description : product.product.description;
              const productPrice = hasVariant ? product.variant?.price : (product.totalPrice / product.quantity);
              const productImages = hasVariant && product.variant?.images?.length as number > 0
                ? product.variant?.images
                : product.product.images;

              return (
                <div key={`${hasVariant ? product.variant?.id : product.product.name}-${index}`} className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-md border">
                      <img
                        src={productImages?.[0] || '/placeholder.png'}
                        alt={productName}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{productName}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {productDescription}
                      </p>
                      {hasVariant && product.variant?.formattedOptions && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {product.variant.formattedOptions.map((option, idx) => (
                            <Badge key={idx} variant="outline">
                              {option.name}: {option.value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(productPrice!)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {product.quantity}
                      </p>
                      <p className="font-medium">
                        Total: {formatCurrency(product.totalPrice)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {product.product.category && (
                      <p className="text-sm font-medium">Category: {product.product.category.name}</p>
                    )}
                    {product.product.subCategory && (
                      <p className="text-sm font-medium">Subcategory: {product.product.subCategory.name}</p>
                    )}
                    {product.product.reels?.[0]?.size && (
                      <p className="text-sm font-medium">Reel Size: {product.product.reels[0].size}</p>
                    )}
                  </div>
                  {index < products.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default OrderProductsModal