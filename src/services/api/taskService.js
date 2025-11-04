import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 280));
    return [...tasks];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tasks.find(task => task.Id === parseInt(id));
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: "user1"
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 320));
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates
      };
      return { ...tasks[index] };
    }
    throw new Error("Task not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      return { ...deletedTask };
    }
    throw new Error("Task not found");
  },

  async toggleComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      return { ...tasks[index] };
    }
    throw new Error("Task not found");
  }
};

export default taskService;