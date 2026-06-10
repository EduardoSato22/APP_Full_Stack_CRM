import { z } from 'zod';

export const customerSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName:  z.string().min(1, 'Sobrenome é obrigatório'),
  email:     z.string().email('Email inválido'),
  phone:     z.string().optional(),
  age:       z.coerce.number().int().positive().optional().nullable(),
  company:   z.string().optional(),
  position:  z.string().optional(),
  status:    z.enum(['LEAD', 'PROSPECT', 'ACTIVE', 'INACTIVE', 'CHURNED']),
  source:    z.enum(['ORGANIC', 'REFERRAL', 'ADS', 'COLD_OUTREACH', 'EVENT', 'OTHER']).optional(),
  photoUrl:  z.string().optional(),
  notes:     z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
