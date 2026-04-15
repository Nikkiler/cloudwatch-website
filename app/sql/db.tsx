import postgres from 'postgres';

const sql = postgres({
	host: "localhost",
	port: 5432,
	database: "awsproject",
	username: "postgres",
	password: "inhisname",
});

export default sql;