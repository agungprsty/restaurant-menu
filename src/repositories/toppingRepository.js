const _ = require('lodash');

class ToppingRepository {
  constructor({ prisma }) {
    this.prisma = prisma;
  }

  async save(toppingData) {
    const data = _.omit(toppingData, []); // Params [] digunakan untuk menghilangkan properti

    try {
      const newTopping = await this.prisma.topping.create({
        data,
      });
      return newTopping;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const topping = await this.prisma.topping.findUnique({
        where: { id },
      });
      return topping;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findBySlug(slug) {
    try {
      const topping = await this.prisma.topping.findUnique({
        where: { slug },
      });
      return topping;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.topping.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async update(id, toppingData) {
    const data = _.omit(toppingData, []);
    
    try {
      const topping = await this.prisma.topping.update({
        where: { id },
        data,
      });
      return topping;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.prisma.topping.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = ToppingRepository;
