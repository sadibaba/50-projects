export const sharePin = async (pinId: string, title: string) => {
  const url = `${window.location.origin}/pin/${pinId}`;
  if (navigator.share) {
    try {
      await navigator.share({ title, url, text: `Save this idea: ${title}` });
      return "shared";
    } catch {
      return "cancelled";
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied";
};

export const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() + ".jpg";
    link.click();
    URL.revokeObjectURL(link.href);
    return true;
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }
};
