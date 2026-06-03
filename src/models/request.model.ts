import { z } from 'zod';

//DTO запроса
export const DimensionsSchema = z.object({
  length: z.number().min(0.1),
  width: z.number().min(0.1),
  height: z.number().min(0.1),
});

export const CartDataSchema = z.object({
  weight: z.number().min(0.01),
  dimensions: DimensionsSchema,
  totalPrice: z.number().min(0),
});

export const DeliveryAddressSchema = z.object({
  city: z.string().min(1),
  street: z.string().min(1),
  house: z.string().min(1),
});

export const CalculateDeliveryRequestSchema = z.object({
  cart: CartDataSchema,
  address: DeliveryAddressSchema,
});

export type Dimensions = z.infer<typeof DimensionsSchema>;
export type CartData = z.infer<typeof CartDataSchema>;
export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>;
export type CalculateDeliveryRequest = z.infer<typeof CalculateDeliveryRequestSchema>;
