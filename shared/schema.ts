import { z } from "zod";

export const uploadFileSchema = z.object({
  filename: z.string(),
  size: z.number(),
  mimetype: z.string(),
});

export const convertFileSchema = z.object({
  filename: z.string(),
  content: z.string(), // base64 encoded file content
});

export type UploadFile = z.infer<typeof uploadFileSchema>;
export type ConvertFile = z.infer<typeof convertFileSchema>;

export interface ConversionResult {
  success: boolean;
  filename: string;
  content?: string; // base64 encoded converted XML
  error?: string;
}
