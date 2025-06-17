import { z } from 'zod';

export const hotelSearchSchema = z.object({
  ski_site: z.number(),
  from_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  to_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  group_size: z.number().min(1).max(10)
});
