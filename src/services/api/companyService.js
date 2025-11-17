import companiesData from '@/services/mockData/companies.json';

// Create a mutable copy for CRUD operations
let companies = [...companiesData];

const companyService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return companies.map(company => ({ ...company }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error(`Company with id ${id} not found`);
    }
    return { ...company };
  },

  async create(companyData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCompany = {
      ...companyData,
      Id: Math.max(...companies.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = companies.findIndex(company => company.Id === parseInt(id));
    if (index !== -1) {
      companies[index] = {
        ...companies[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return { ...companies[index] };
    }
    throw new Error(`Company with id ${id} not found`);
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = companies.findIndex(company => company.Id === parseInt(id));
    if (index !== -1) {
      const deleted = { ...companies[index] };
      companies.splice(index, 1);
      return deleted;
    }
    throw new Error(`Company with id ${id} not found`);
  }
};

export default companyService;