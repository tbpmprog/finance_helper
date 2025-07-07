
export const TABLE_SCHEMAS = {
    seq: {
        fields: {
            name: { default: '', require: true },
            idx:  { default: 0,  require: true }
        }
    },
    incomes: {
        fields: {
            id:         { default: '', require: true  },
            dt:         { default: '', require: true  },
            name:       { default: '', require: true  },
            comment:    { default: '', require: false },
            amount:     { default: '', require: true  },
            is_deleted: { default: 0,  require: true  }
        }
    },
    expenses: {
        fields: {
            id:         { default: '', require: true  },
            dt:         { default: '', require: true  },
            name:       { default: '', require: true  },
            comment:    { default: '', require: false },
            amount:     { default: '', require: true  },
            is_deleted: { default: 0,  require: true  }
        },
    }
};
