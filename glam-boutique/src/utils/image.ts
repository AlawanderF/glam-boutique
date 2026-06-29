interface ResizeImageOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Lê um arquivo de imagem, redimensiona via canvas e retorna um data URL JPEG comprimido.
 * Evita salvar imagens muito grandes no localStorage (via stores persistidos).
 */
export function resizeImageFile(file: File, options: ResizeImageOptions = {}): Promise<string> {
  const { maxDimension = 480, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export const MAX_AVATAR_FILE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
