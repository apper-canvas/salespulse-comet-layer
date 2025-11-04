import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const activityService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities.find(activity => activity.Id === parseInt(id));
  },

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      timestamp: new Date().toISOString(),
      userId: "user1"
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      const deletedActivity = activities.splice(index, 1)[0];
      return { ...deletedActivity };
    }
    throw new Error("Activity not found");
  }
};

export default activityService;