import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();

const categories = [
    { name: "Computer Science" },
    { name: "Music" },
    { name: "Fitness" },
    { name: "Photography" },
    { name: "Accounting" },
    { name: "Engineering" },
    { name: "Filming" },
];

async function seedCategories() {
    try {
        for (const category of categories) {
            await database.category.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }
        console.log("✅ Categories seeded successfully");
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
    } finally {
        await database.$disconnect();
    }
}

// Run the seeding process
seedCategories();
