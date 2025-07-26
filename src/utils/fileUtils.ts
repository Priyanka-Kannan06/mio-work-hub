
export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
};

export const getFileNameFromUrl = (url: string, fallbackName: string = 'document') => {
  try {
    const urlPath = new URL(url).pathname;
    const fileName = urlPath.split('/').pop();
    return fileName || fallbackName;
  } catch {
    return fallbackName;
  }
};
