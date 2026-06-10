import { z } from 'zod';

export const dealSchema = z.object({
  title:      z.string().min(1, 'Título é obrigatório'),
  value:      z.coerce.number().nonnegative(),
  stage:      z.enum(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION']),
  customerId: z.coerce.number().positive('Selecione um cliente'),
  notes:      z.string().optional(),
});

export type DealFormData = z.infer<typeof dealSchema>;
