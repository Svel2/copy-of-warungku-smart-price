import { GoogleGenAI, Type } from "@google/genai";
import { AIPriceSuggestion } from "../types";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const suggestProductInfo = async (productName: string): Promise<AIPriceSuggestion | null> => {
  if (!productName) return null;

  try {
    if (!ai) {
      console.warn("Gemini API Key missing");
      return null;
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Berikan estimasi harga jual eceran yang wajar untuk toko kelontong/warung kecil di Indonesia untuk produk: "${productName}". 
      
      Pilih kategori yang paling tepat dari daftar ini jika cocok:
      - Makanan
      - Minuman
      - Sembako (Beras, Minyak, Telur, dll)
      - Perlengkapan Mandi (Sabun, Sampo, Odol)
      - Kebersihan Rumah (Sabun Lantai, Deterjen)
      - Obat-obatan
      - Rokok
      - Gas & Galon
      - Lainnya

      Berikan output JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedSellPrice: {
              type: Type.NUMBER,
              description: "Estimasi harga jual satuan dalam Rupiah (IDR) (angka saja tanpa titik)",
            },
            suggestedCategory: {
              type: Type.STRING,
              description: "Kategori produk yang sesuai standar warung.",
            },
            marketPriceRange: {
              type: Type.STRING,
              description: "Rentang harga pasar text (contoh: Rp 2.000 - Rp 3.000)",
            },
            reasoning: {
              type: Type.STRING,
              description: "Alasan singkat penentuan harga dalam bahasa Indonesia yang santai",
            },
          },
          required: ["suggestedSellPrice", "suggestedCategory", "marketPriceRange", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIPriceSuggestion;
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    return null;
  }
};

export const generateProductImage = async (productName: string): Promise<string | null> => {
  if (!productName) return null;

  try {
    if (!ai) return null;
    // Using the new Imagen 3 model for high quality generation
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Product photography of ${productName} packaging, isolated on a clean white background, commercial advertisement style, high quality, photorealistic. Indonesian grocery product context.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating product image:", error);
    return null;
  }
};