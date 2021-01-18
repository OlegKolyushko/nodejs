const path = require("path");
const Joi = require("joi");
const contactUtils = require('./contact.utils');

class ContactsControllers {
  async listContacts(req, res, next) {
    const contacts = await contactUtils.listContacts();
    res.status(200).send(contacts);
  }

  async getById(req, res, next) {
    const contactId = parseInt(req.params.id);
    const foundedContact = await contactUtils.getContactById(contactId);

    if (!foundedContact) {
      return res.status(404).send({ message: "Contact not found" });
    }

    res.status(200).send(foundedContact);
  }

  async removeContact(req, res, next) {
    const contactId = parseInt(req.params.id);
    const contact = await contactUtils.getContactById(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    contactUtils.removeContact(contactId);


    res.status(200).send({ message: "contact deleted" });
  }

  async addContact(req, res, next) {
    const newContact = await contactUtils.addContact(req.body);
    res.status(201).send(newContact);
  }

  async updateContact(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const contactId = parseInt(req.params.id);
    const contact = await contactUtils.getContactById(contactId);

    if(!contact) {
      return res.status(404).send({message: 'Contact Not Found'});
    }

    const updatedContact = await contactUtils.updateContact(contactId, req.body);
    res.status(200).send(updatedContact);
  }

  validateUpdateContact(req, res, next) {
    const updatedContactRules = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email(),
      phone: Joi.string().min(1),
    });
    const result = updatedContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send({ message: result.error });
    }
    next();
  }

  validateAddedContact(req, res, next) {
    const addedConatactRules = Joi.object({
      name: Joi.string().required().min(1).required(),
      email: Joi.string().required().email().required(),
      phone: Joi.string().required().min(1).required(),
    });
    const result = addedConatactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send({ message: result.error });
    }
    next();
  }
}

module.exports = new ContactsControllers();
