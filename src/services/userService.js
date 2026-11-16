
const createUserService = (prisma) => ({
  getAll: () => prisma.user.findMany({
    omit: { password: true }
  }),

  getById: (id) => prisma.user.findUnique({
    where: { id },
    omit: { password: true }
  }),

  create: (data) => prisma.user.create({
    data,
    omit: { password: true }
  }),

  update: (id, data) => prisma.user.update({
    where: { id },
    data,
    omit: { password: true }
  }),

  
remove: (id) => prisma.$transaction(async (tx) => {
  await tx.booking.deleteMany({
    where: { userId: id }
  });

  await tx.review.deleteMany({
    where: { userId: id }
  });

  return tx.user.delete({
    where: { id }
  });
})
});

export default createUserService;
