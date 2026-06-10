import { z } from 'zod';

export const productSchema = z.object({
  name:        z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  imageUrl:    z.string().optional(),
  price:       z.coerce.number().positive('Preço deve ser positivo'),
  costPrice:   z.coerce.number().nonnegative().optional().nullable(),
  sku:         z.string().optional(),
  stock:       z.coerce.number().int().nonnegative().optional().nullable(),
  status:      z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']),
  unit:        z.enum(['UNIT', 'KG', 'LITER', 'METER', 'BOX', 'PACK']),
});

export type ProductFormData = z.infer<typeof productSchema>;
