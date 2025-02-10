// Utility functions for managing localStorage
export const StorageUtils = {
  // Save data to localStorage with error handling
  saveData: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Saved ${key} to localStorage:`, data);
      
      // Manually trigger storage event
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },

  // Retrieve data from localStorage with error handling
  getData: (key, defaultValue = []) => {
    try {
      const storedData = localStorage.getItem(key);
      const parsedData = storedData ? JSON.parse(storedData) : defaultValue;
      return parsedData;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  // Initialize default data if not exists
  initializeDefaultData: () => {
    const defaultDepartments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing'];
    const currentDate = new Date();
    
    const defaultEmployees = [
      { 
        id: 1, 
        name: 'John Doe', 
        department: 'Engineering', 
        joinDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
        baseSalary: 75000
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        department: 'Sales', 
        joinDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15).toISOString(),
        baseSalary: 65000
      },
      { 
        id: 3, 
        name: 'Mike Johnson', 
        department: 'HR', 
        joinDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10).toISOString(),
        baseSalary: 60000
      },
      { 
        id: 4, 
        name: 'Emily Brown', 
        department: 'Finance', 
        joinDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString(),
        baseSalary: 70000
      },
      { 
        id: 5, 
        name: 'David Wilson', 
        department: 'Marketing', 
        joinDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20).toISOString(),
        baseSalary: 55000
      }
    ];

    // Only set if not already exists
    if (!localStorage.getItem('departments')) {
      StorageUtils.saveData('departments', defaultDepartments);
    }
    if (!localStorage.getItem('employees')) {
      StorageUtils.saveData('employees', defaultEmployees);
    }
  }
};
