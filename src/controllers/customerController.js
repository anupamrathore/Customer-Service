import Customer from '../models/customer.js';

// GET all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET customer by ID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE new customer(s)
export const createCustomer = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Multiple customers
      const emails = req.body.map(c => c.email);
      const existingCustomers = await Customer.findAll({ where: { email: emails } });

      if (existingCustomers.length > 0) {
        return res.status(400).json({ message: 'Some emails already exist', existingCustomers });
      }

      const newCustomers = await Customer.bulkCreate(req.body);
      return res.status(201).json(newCustomers);
    } else {
      // Single customer
      const { name, email, phone } = req.body;

      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newCustomer = await Customer.create({ name, email, phone });
      return res.status(201).json(newCustomer);
    }
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE customer by ID
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    customer.name = name ?? customer.name;
    customer.email = email ?? customer.email;
    customer.phone = phone ?? customer.phone;

    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE customer by ID
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
