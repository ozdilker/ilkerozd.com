/**
 * Basit metinleri boş satırlara göre paragraflara böler.
 * Ağır bir markdown kütüphanesi eklemek yerine, çok satırlı düz metinleri
 * (ör. `hakkimda_metin`, `detay`) <p> etiketleriyle render edebilmek için kullanılır.
 */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
