
const createPropertyService = (prisma) => ({
  getAll: () => prisma.property.findMany(),

  getById: (id) => prisma.property.findUnique({
    where: { id }
  }),

  create: (data) => prisma.property.create({
    data
  }),

  update: (id, data) => prisma.property.update({
    where: { id },
    data
  }),

  remove: (id) => prisma.property.delete({
    where: { id }
  })
});

export default createPropertyService;
