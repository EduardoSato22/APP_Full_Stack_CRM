import { z } from 'zod';

export const activitySchema = z.object({
  type:        z.enum(['CALL', 'EMAIL', 'MEETING', 'TASK', 'NOTE', 'WHATSAPP']),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  title:       z.string().min(1, 'Título é obrigatório'),
  dueDate:     z.string().optional(),
  description: z.string().optional(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
