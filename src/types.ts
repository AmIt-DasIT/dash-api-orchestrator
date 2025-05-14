
// Entity Types

export interface SiteUser {
  id: string;
  username: string;
  email_address: string;
  phone_number: string | null;
  is_member: boolean;
  membership_id: string | null;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  name: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberedUser {
  id: string;
  user_id: string;
  membership_id: string;
  start_date: string;
  end_date: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  name: string | null;
  unit_number: string | null;
  street_number: string | null;
  address_line1: string;
  address_line2: string | null;
  phone_no: string | null;
  city: string;
  region: string | null;
  postal_code: string | null;
  country_id: string | null;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  country_name: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  address_id: string;
  is_default: boolean;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentType {
  id: string;
  value: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPaymentMethod {
  id: string;
  user_id: string;
  payment_type_id: string;
  provider: string | null;
  account_number: string | null;
  expiry_date: string | null;
  is_default: boolean;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingCart {
  id: string;
  user_id: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingCartItem {
  id: string;
  cart_id: string;
  product_item_id: string;
  qty: number;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  product_image: string | null;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  parent_category_id: string | null;
  category_name: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface Variation {
  id: string;
  name: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface VariationOption {
  id: string;
  variation_id: string;
  value: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductItem {
  id: string;
  product_id: string;
  SKU: string;
  qty_in_stock: number;
  product_image: string | null;
  price: number;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductConfiguration {
  id: string;
  product_item_id: string;
  variation_option_id: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopOrder {
  id: string;
  user_id: string;
  order_date: string;
  payment_method_id: string | null;
  shipping_address: string | null;
  shipping_method: string | null;
  order_total: number;
  order_status: string | null;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderLine {
  id: string;
  product_item_id: string;
  order_id: string;
  qty: number;
  price: number;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  discount_rate: number;
  start_date: string;
  end_date: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionCategory {
  category_id: string;
  promotion_id: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderStatus {
  id: string;
  status: string;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserReview {
  id: string;
  user_id: string;
  ordered_product_id: string | null;
  rating_value: number;
  comment: string | null;
  delete_flag: boolean;
  created_at: string;
  updated_at: string;
}

// DTO Types for API requests
export type CreateUserDto = Omit<SiteUser, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserDto = Partial<Omit<SiteUser, 'id' | 'created_at' | 'updated_at'>>;

export type CreateProductDto = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductDto = Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;

// Add similar DTO types for all other entities
