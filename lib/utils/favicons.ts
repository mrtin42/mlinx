const formatForFavicon = (url: string, sz: number) => {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${sz}`;
}

export default formatForFavicon;