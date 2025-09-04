import {z} from 'zod';

export const VehicleRegistrationSchema = z.object({
  id: z.string(),
  licensePlate: z.string(),
  nickname: z.string().optional(),
});

export type VehicleRegistration = z.infer<typeof VehicleRegistrationSchema>;

export const SvvVehicleInfoSchema = z.object({
  make: z.string(),
  model: z.string(),
  color: z.string(),
});

export type SvvVehicleInfo = z.infer<typeof SvvVehicleInfoSchema>;
