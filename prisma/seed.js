
import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();

async function main() {
  const usersData = JSON.parse(
    await readFile(
      new URL("../src/data/users.json", import.meta.url),
      "utf8"
    )
  );
  
for (const user of usersData.users) {
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: user
  });
}


const hostsData = JSON.parse(
  await readFile(
    new URL("../src/data/hosts.json", import.meta.url),
    "utf8"
  )
);


for (const host of hostsData.hosts) {
  await prisma.host.upsert({
    where: { id: host.id },
    update: {},
    create: host
  });
}


const amenitiesData = JSON.parse(
  await readFile(
    new URL("../src/data/amenities.json", import.meta.url),
    "utf8"
  )
);


for (const amenity of amenitiesData.amenities) {
  await prisma.amenity.upsert({
    where: { id: amenity.id },
    update: {},
    create: amenity
  });
}


const propertiesData = JSON.parse(
  await readFile(
    new URL("../src/data/properties.json", import.meta.url),
    "utf8"
  )
);


for (const property of propertiesData.properties) {
  await prisma.property.upsert({
    where: { id: property.id },
    update: {},
    create: property
  });
}


const bookingsData = JSON.parse(
  await readFile(
    new URL("../src/data/bookings.json", import.meta.url),
    "utf8"
  )
);

for (const booking of bookingsData.bookings) {
  await prisma.booking.upsert({
    where: { id: booking.id },
    update: {},
    create: {
      ...booking,
      checkinDate: new Date(booking.checkinDate),
      checkoutDate: new Date(booking.checkoutDate)
    }
  });
}


const reviewsData = JSON.parse(
  await readFile(
    new URL("../src/data/reviews.json", import.meta.url),
    "utf8"
  )
);

for (const review of reviewsData.reviews) {
  await prisma.review.upsert({
    where: { id: review.id },
    update: {},
    create: review
  });
}


}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

