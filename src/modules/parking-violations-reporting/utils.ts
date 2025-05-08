export const blobToBase64 = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const {result} = reader;
      if (typeof result !== 'string') {
        reject(new Error('Invalid blob type'));
        return;
      }
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error('FileReader failed'));
    };
  });
};
