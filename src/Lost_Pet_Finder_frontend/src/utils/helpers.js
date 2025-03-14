export const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    return new Date(dateStr).toLocaleDateString();
  };
  
  export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  
  export const convertImageToBlob = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };