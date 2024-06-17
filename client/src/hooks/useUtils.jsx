export default function useUtils() {
    const convertToBase64 = (file) => {
        return new Promise((resolve) => {
            try {
                if (!file || !file.type.includes("image/")) {
                    resolve("Please select a valid image!");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    const image = new Image();
                    image.src = e.target?.result;
                    image.onload = () => resolve(image.src);
                    image.onerror = () => resolve("Image failed to load");
                };
                reader.onerror = () => resolve("File reading failed");
                reader.readAsDataURL(file);
            } catch (err) {
                console.error(err);
                resolve(err.message);
            }
        });
    };

    return { convertToBase64 };
}
