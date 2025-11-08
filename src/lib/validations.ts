import { z } from "zod";

// Organization validation schemas
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  slug: z
    .string()
    .trim()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(50, "El slug no puede exceder 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "El slug no puede comenzar ni terminar con guión",
    }),
  logo_url: z
    .string()
    .trim()
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

// Brand validation schemas
export const createBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  slug: z
    .string()
    .trim()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(50, "El slug no puede exceder 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "El slug no puede comenzar ni terminar con guión",
    }),
  industry: z
    .string()
    .trim()
    .max(100, "La industria no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
  logo_url: z
    .string()
    .trim()
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

// Project validation schemas
export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede exceder 150 caracteres"),
  description: z
    .string()
    .trim()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional()
    .or(z.literal("")),
  brand_id: z
    .string()
    .uuid("Debe seleccionar una marca válida"),
  status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido")
    .refine((date) => {
      const selectedDate = new Date(date);
      return !isNaN(selectedDate.getTime());
    }, "Fecha inválida"),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido")
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    if (!data.end_date) return true;
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end >= start;
  },
  {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["end_date"],
  }
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Helper function to generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};