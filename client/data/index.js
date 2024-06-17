import axios from "axios";
import { writeFileSync } from "fs";

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function generateRandomCurrency(min = 1000, max = 10000) {
    const randomValue = Math.floor(getRandomNumber(min, max));
    return randomValue;
}

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

async function callApi(i) {
    try {
        const res = await axios.get(`https://knowyourdata-tfds.withgoogle.com/item?id=train[5shard]_${i}&sample_every=1&dataset=cars196`);
        console.log("ext", res.data[10].values[0]);
        const img = "data:image/jpeg;base64," + res.data[0].values[0];
        const name = res.data[3].values[0];

        return {
            img,
            name,
            seats: getRandomItem([2, 4, 5, 6, 7, 8]),
            fuel: getRandomItem(["petrol", "diesel"]),
            rent: generateRandomCurrency(),
        };
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function main() {
    const promises = [];

    for (let i = 0; i < 100; i++) {
        promises.push(callApi(i + 1));
    }

    const results = await Promise.all(promises);
    const data = results.filter((record) => record !== null);
    writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("Data written to data.json");
}

main();
