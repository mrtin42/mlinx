export function returnNewImage(pfp) {
  const img = new Image();
    img.src = URL.createObjectURL(pfp);
    return img;
}