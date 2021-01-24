const Joi = require("joi");
const contactModel = require("./constacts.models");

class ContactsControllers {
  
  async listContacts(req, res, next) {
    const contacts = await contactModel.find({});
    res.status(200).send(contacts);
  }

  async getById(req, res, next) {
    const findedContact = await contactModel.findById(req.params.contactId);
    res.status(200).json(findedContact);
    if (!findedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
  }

  async removeContact(req, res, next) {
    const removedContact = await contactModel.findByIdAndDelete(
      req.params.contactId
    );
    res.status(200).json({ message: "contact deleted" });
    if (!removedContact) {
      return res.status(404).json({ message: "Not found" });
    }
  }

  async addContact(req, res, next) {
    const addedContact = await contactModel.create(req.body);
    res.status(201).send(addedContact);
  }

  async updateContact(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const updatedContact = await contactModel.findByIdAndUpdate(
      req.params.contactId,
      { $set: req.body }
    );

    if (!updatedContact) {
      return res.status(400).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  }

  validateUpdateContact(req, res, next) {
    const updatedContactRules = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email().min(1),
      phone: Joi.string().min(1),
    });
    const result = updatedContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    next();
  }

  validateAddedContact(req, res, next) {
    const addedConatactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const result = addedConatactRules.validate(req.body);
    
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    next();
  }
}

module.exports = new ContactsControllers();
