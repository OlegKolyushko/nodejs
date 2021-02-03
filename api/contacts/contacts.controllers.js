const Joi = require("joi");
const contactModel = require("./constacts.models");

class ContactsControllers {
  async listContacts(req, res, next) {
    try {
      const contacts = await contactModel.find({});
      res.status(200).send(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getContactById(req, res, next) {
    try {
      const findedContact = await contactModel.findById(req.params.id);
      if (!findedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(findedContact);
    } catch (error) {
      next(error);
    }
  }

  async removeContact(req, res, next) {
    try {
      const removedContact = await contactModel.findByIdAndDelete(
        req.params.id
      );
      if (!removedContact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json({ message: "contact deleted" });
    } catch (error) {
      next(error);
    }
  }

  async addContact(req, res, next) {
    try {
      const addedContact = await contactModel.create(req.body);
      res.status(201).send(addedContact);
    } catch (error) {
      next(error);
    }
  }

  async updateContact(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const updatedContact = await contactModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedContact) {
        return res.status(400).json({ message: "Not found" });
      }
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  validateUpdateContact(req, res, next) {
    const updatedContactRules = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email().min(1),
      phone: Joi.string().min(1),
      subscription: Joi.string(),
      password: Joi.string(),
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
