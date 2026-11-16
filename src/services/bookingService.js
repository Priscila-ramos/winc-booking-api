
const createBookingService = (prisma) => ({
  getAll: () => prisma.booking.findMany(),

  getById: (id) => prisma.booking.findUnique({
    where: { id }
  }),

  create: (data) => prisma.booking.create({
    data: {
      ...data,
      checkinDate: new Date(data.checkinDate),
      checkoutDate: new Date(data.checkoutDate)
    }
  }),

  update: (id, data) => {
    const updateData = { ...data };

    if (updateData.checkinDate !== undefined) {
      updateData.checkinDate = new Date(updateData.checkinDate);
    }

    if (updateData.checkoutDate !== undefined) {
      updateData.checkoutDate = new Date(updateData.checkoutDate);
    }

    return prisma.booking.update({
      where: { id },
      data: updateData
    });
  },

  remove: (id) => prisma.booking.delete({
    where: { id }
  })
});

export default createBookingService;
