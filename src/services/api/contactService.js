import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const contactService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...contacts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return contacts.find(contact => contact.Id === parseInt(id));
  },

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "user1"
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return { ...contacts[index] };
    }
    throw new Error("Contact not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index !== -1) {
      const deletedContact = contacts.splice(index, 1)[0];
      return { ...deletedContact };
    }
    throw new Error("Contact not found");
  }
};

export default contactService;