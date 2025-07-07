import {z} from 'zod';

export type VehicleRegistration = {
  id: string;
  licensePlate: string;
};

export const SvvVehicleInfoSchema = z.object({
  make: z.string(),
  model: z.string(),
  color: z.string(),
});

export type SvvVehicleInfo = z.infer<typeof SvvVehicleInfoSchema>;
