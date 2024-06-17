export var ENV = {};

export const checkEnv = () => {
    if (
        !process.env.ACCESS_TOKEN ||
        !process.env.CLIENT_URL ||
        !process.env.MAIL_EMAIL ||
        !process.env.MAIL_PASS ||
        !process.env.MONGODB_URL ||
        !process.env.PAYMENT_CONF_URL ||
        !process.env.REFRESH_TOKEN ||
        !process.env.STRIPE_KEY ||
        !process.env.VERIFICATION_TOKEN ||
        !process.env.VERIFICATION_URL
    )
        throw "Initialization Error";
    ENV = {
        ACCESS_TOKEN: process.env.ACCESS_TOKEN,
        DB_NAME: "drive_ease",
        CLIENT_URL: process.env.CLIENT_URL,
        MAIL_EMAIL: process.env.MAIL_EMAIL,
        MAIL_PASS: process.env.MAIL_PASS,
        MONGODB_URL: process.env.MONGODB_URL,
        PASSWORD_SALT: process.env.PASSWORD_SALT ?? 10,
        PAYMENT_CONF_URL: process.env.PAYMENT_CONF_URL,
        PORT: process.env.PORT ?? 7000,
        REFRESH_TOKEN: process.env.REFRESH_TOKEN,
        STRIPE_KEY: process.env.STRIPE_KEY,
        VERIFICATION_TOKEN: process.env.VERIFICATION_TOKEN,
        VERIFICATION_URL: process.env.VERIFICATION_URL,
    };
};
