import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

dotenv.config();
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const allowedTags = [
	"💑 Dating",
	"🤝 Friends",
	"🎶 Music",
	"✈️ Travel",
	"🍣 Foodie",
	"🎮 Gamer",
	"🏋️ Fitness",
	"📚 Bookworm",
	"🏞️ Outdoors",
	"🎬 Movies",
	"🐾 Animal",
	"🌍 Adventure",
	"⚽ Sports",
	"🎨 ArtL",
	"💻 Tech",
	"🌳 Nature",
	"☕ Coffee",
	"💃 Dancer",
	"🧘 Yogi",
	"💼 Entrepreneur",
];

async function seedUsers(count = 500) {
	for (let i = 0; i < count; i++) {
		const sex = Math.random() < 0.5 ? "female" : "male";
		const orientations = ["heterosexual", "homosexual", "bisexual"];
		const orientation = orientations[Math.floor(Math.random() * orientations.length)];
		const password = "password"; // Replace with the desired password
		
		const username = faker.internet.displayName();
		const email = faker.internet.email();
		const firstName = faker.person.firstName(sex);
		const lastName = faker.person.lastName();
		const passwordHash = await bcrypt.hash(password, 10); // Hash the password

		const bio = faker.lorem.sentence();
		const tags = faker.helpers.arrayElements(allowedTags, 5);
		const gender = sex;
		const sexual_preference = orientation;
		const pictures: string[] = [];
		for (let j = 0; j < 5; j++) pictures.push(faker.image.urlPicsumPhotos({ width: 200, height: 200 }));
		const fame_score = Math.floor(Math.random() * 100);
		const latitude = faker.location.latitude({ min: 38.7, max: 38.8 }); // e.g. Lisbon area
		const longitude = faker.location.longitude({ min: -9.2, max: -9.1 });
		const age = Math.floor(Math.random() * 50) + 18; // Random age between 18 and 67
		const avatar = pictures[Math.floor(Math.random() * pictures.length)];

		const userRes = await pool.query(
			`
      INSERT INTO users (username, email, first_name, last_name, password, email_verified)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id
    `,
			[username, email, firstName, lastName, passwordHash]
		);

		const userId = userRes.rows[0].id;

		await pool.query(
			`
      INSERT INTO profiles (user_id, bio, tags, gender, sexual_preference, pictures, fame_score, latitude, longitude, age, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
			[userId, bio, tags, gender, sexual_preference, pictures, fame_score, latitude, longitude, age, avatar]
		);
	}

	console.log(`Seeded ${count} users`);
	await pool.end();
}

// seedUsers().catch(console.error);
console.log("Seeding users is commented out to prevent accidental execution. Uncomment the seedUsers() call to run it.");
