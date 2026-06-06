export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  unit: string
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  stock_quantity: number | null
  created_at: string
  category?: Category
}

export interface Customer {
  id: string
  user_id: string | null
  name: string
  phone: string
  email: string | null
  address: string | null
  created_at: string
}

export interface Order {
  id: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_slot: string | null
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  total_amount: number
  notes: string | null
  whatsapp_sent: boolean
  created_at: string
  customer?: Customer
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  product?: Product
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'superadmin' | 'admin'
  created_at: string
}
