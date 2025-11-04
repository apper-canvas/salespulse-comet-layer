import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const dealService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...deals];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return deals.find(deal => deal.Id === parseInt(id));
  },

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 450));
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "user1"
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = deals.findIndex(deal => deal.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = {
        ...deals[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return { ...deals[index] };
    }
    throw new Error("Deal not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = deals.findIndex(deal => deal.Id === parseInt(id));
    if (index !== -1) {
      const deletedDeal = deals.splice(index, 1)[0];
      return { ...deletedDeal };
    }
    throw new Error("Deal not found");
  }
};

export default dealService;