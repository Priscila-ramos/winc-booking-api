
const createReviewService = (prisma) => ({
  getAll: () => prisma.review.findMany(),

  getById: (id) => prisma.review.findUnique({
    where: { id }
  }),

  create: (data) => prisma.review.create({
    data
  }),

  update: (id, data) => prisma.review.update({
    where: { id },
    data
  }),

  remove: (id) => prisma.review.delete({
    where: { id }
  })
});

export default createReviewService;
