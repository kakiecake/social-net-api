const exitWithError = (message: string) => {
    console.error('ERROR:', message);
    process.exit(-1);
};

export default () => ({
    debug: process.env.NODE_ENV === 'production',
    jwt: {
        privateKey:
            process.env.JWT_PRIVATE_KEY ||
            exitWithError('JWT_PRIVATE_KEY must be specified'),
        expiration:
            process.env.NODE_ENV === 'production'
                ? process.env.JWT_EXPIRATION || '30m'
                : '60s',
    },
});
