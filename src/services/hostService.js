
const createHostService = (prisma) => ({
  getAll: () => prisma.host.findMany({
    omit: { password: true }
  }),

  getById: (id) => prisma.host.findUnique({
    where: { id },
    omit: { password: true }
  }),

  create: (data) => prisma.host.create({
    data,
    omit: { password: true }
  }),

  update: (id, data) => prisma.host.update({
    where: { id },
    data,
    omit: { password: true }
  }),


remove: (id) => prisma.$transaction(async (tx) => {
  const properties = await tx.property.findMany({
    where: { hostId: id },
    select: { id: true }
  });

  const propertyIds = properties.map((property) => property.id);

  await tx.booking.deleteMany({
    where: {
      propertyId: { in: propertyIds }
    }
  });

  await tx.review.deleteMany({
    where: {
      propertyId: { in: propertyIds }
    }
  });

  await tx.property.deleteMany({
    where: { hostId: id }
  });

  return tx.host.delete({
    where: { id }
  });
})
});

export default createHostService;
