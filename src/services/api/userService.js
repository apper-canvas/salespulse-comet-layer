const STORAGE_KEY = "userProfile";

// Default user data
const defaultProfile = {
  Id: 1,
  name: "John Smith",
  email: "john.smith@salespulse.com",
  role: "manager",
  phone: "+1 (555) 123-4567",
  avatar: ""
};

class UserService {
  constructor() {
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      // Also set in user storage for Layout component
      localStorage.setItem("user", JSON.stringify(defaultProfile));
    }
  }

  // Simulate API delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProfile() {
    await this.delay();
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      throw new Error("Profile not found");
    }

    return JSON.parse(data);
  }

  async updateProfile(profileData) {
    await this.delay();

    // Validate required fields
    if (!profileData.name?.trim()) {
      throw new Error("Name is required");
    }

    if (!profileData.email?.trim()) {
      throw new Error("Email is required");
    }

    if (!profileData.role) {
      throw new Error("Role is required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      throw new Error("Invalid email format");
    }

    // Keep the original ID
    const currentData = await this.getProfile();
    const updatedProfile = {
      ...currentData,
      ...profileData,
      Id: currentData.Id // Preserve ID
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    
    return updatedProfile;
  }

  async deleteProfile() {
    await this.delay();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("user");
    return true;
  }

  // Get user for display purposes (used by Layout)
  async getCurrentUser() {
    try {
      const profile = await this.getProfile();
      return {
        Id: profile.Id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar
      };
    } catch (error) {
      return null;
    }
  }
}

const userService = new UserService();
export default userService;