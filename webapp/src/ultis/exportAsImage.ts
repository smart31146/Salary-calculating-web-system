import html2canvas from "html2canvas";

const exportAsImage = async (
  element: HTMLElement,
  imageFileName: string
): Promise<void> => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};

const downloadImage = (blob: string, fileName: string): void => {
  let fakeLink;
  if (typeof window !== "undefined") {
    fakeLink = window.document.createElement("a");
  }
  if (fakeLink) {
    fakeLink.style.display = "none";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  }
};

export default exportAsImage;