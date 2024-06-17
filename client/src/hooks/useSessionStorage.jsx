export default function useSessionStorage() {
    const getItem = (key) => sessionStorage.getItem(key);
    const setItem = (key, value) => sessionStorage.setItem(key, value);
    const removeItem = (key) => sessionStorage.removeItem(key);

    return { getItem, setItem, removeItem };
}
