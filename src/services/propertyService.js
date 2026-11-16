
const createPropertyService = (prisma) => ({
  getAll: () => prisma.property.findMany(),

 
getById: (id) => prisma.property.findUnique({
  where: { id },
  include: {
    reviews: true,
    bookings: true,
    amenities: true
  }
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
