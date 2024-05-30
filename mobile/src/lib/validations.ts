import {z} from 'zod';

export const callUserIdSchema = z.object({
  id: z
    .string({required_error: 'Bu alan zorunludur'})
    .min(4, 'Kullanıcı ID alanı en az 4 karakter olmalıdır'),
});
