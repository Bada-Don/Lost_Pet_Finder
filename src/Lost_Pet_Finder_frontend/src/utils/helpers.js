export const formatDate = (dateStr) => {
  console.log("Formatting date:", dateStr, "Type:", typeof dateStr); // Debug log
  if (!dateStr || dateStr === "") return 'Not specified';
  try {
    const date = new Date(dateStr);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log("Invalid date detected:", dateStr);
      return 'Not specified';
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Not specified';
  }
};

export const arrayBufferToBase64 = (buffer) => {
  if (!buffer || !buffer.length) return '';

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