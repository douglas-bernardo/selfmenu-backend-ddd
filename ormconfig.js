module.exports = [
    {
        name: 'default',
        type: 'mysql',
        url: `${process.env.JAWSDB_URL}`,
        entities: [`${process.env.DATABASE_ENTITIES}`],
        migrations: [`${process.env.DATABASE_MIGRATIONS}`],
        cli: {
            migrationsDir: `${process.env.DATABASE_MIGRATIONS_DIR}`,
        },
    },
    {
        name: 'mongo',
        type: 'mongodb',
        url: `${process.env.MONGO_URL}`,
        useUnifiedTopology: true,
        entities: [`${process.env.MONGO_ENTITIES}`],
    },
];
