export const sheetConfigs = {
  default: {
    columns: {
      name: {
        required: true,
        type: 'string'
      },
      amount: {
        required: true,
        type: 'number',
        validate: value => value > 0
      },
      date: {
        required: true,
        type: 'date',
        validate: value => {
          const date = new Date(value);
          const now = new Date();
          return date.getMonth() === now.getMonth() &&
                 date.getFullYear() === now.getFullYear();
        }
      },
      verified: {
        required: false,
        type: 'boolean'
      }
    }
  },
  // Example of a custom sheet configuration
  expenses: {
    columns: {
      name: {
        required: true,
        type: 'string'
      },
      amount: {
        required: true,
        type: 'number',
        validate: value => value >= 0 // Allows zero for expenses
      },
      date: {
        required: true,
        type: 'date',
        validate: value => {
          const date = new Date(value);
          const now = new Date();
          // Allows previous month for expenses
          return date.getTime() >= new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        }
      },
      verified: {
        required: false,
        type: 'boolean'
      }
    }
  }
};