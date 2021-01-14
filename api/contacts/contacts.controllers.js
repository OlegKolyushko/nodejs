const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");
const Joi = require("joi");
const { parse } = require("path");

const contactsPath = path.join(__dirname, "../db/contacts.json");

class ContactsControllers {
  async listContacts(req, res, next) {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    res.status(200).send(contacts);
  }

  async getById(req, res, next) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);
    const contactId = parseInt(req.params.id);
    const findContact = parsedData.find((contact) => contact.id === contactId);
    res.status(200).json(findContact);
    if (!findContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
  }

  async removeContact(req, res, next) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);
    const contactId = parseInt(req.params.id);
    const filteredContact = parsedData.filter(
      (contact) => contact.id !== contactId
    );
    const filteredContactsList = JSON.stringify(filteredContact);
    const newList = await fsPromises.writeFile(
      contactsPath,
      filteredContactsList
    );
    res.status(200).json({ message: "contact deleted" });

    const findId = parsedData.find((el) => el.id === contactId);
    if (!findId) {
      return res.status(404).json({ message: "Not found" });
    }
  }

  async addContact(req, res, next) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);
    let biggestId = 0;
    parsedData.forEach((el) => {
      if (el.id > biggestId) {
        biggestId = el.id;
      }
    });

    const contactsItem = req.body;

    const newContact = {
      id: biggestId + 1,
      ...contactsItem,
    };

    const newContactList = [...parsedData, newContact];
    const newContactListString = JSON.stringify(newContactList);
    const newList = await fsPromises.writeFile(
      contactsPath,
      newContactListString
    );
    res.status(201).send(newContact);
  }

  async updateContact(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const id = parseInt(req.params.id);

    const targetContactIndex = contacts.findIndex(
      (contact) => contact.id === id
    );
    if (targetContactIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    const updatedContact = (contacts[targetContactIndex] = {
      ...contacts[targetContactIndex],
      ...req.body,
    });

    const newContactListString = JSON.stringify(updatedContact);
    const newList = await fsPromises.writeFile(
      contactsPath,
      newContactListString
    );

    res.status(200).json(updatedContact);
  }

  validateUpdateContact(req, res, next) {
    const updatedContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const result = Joi.validate(req.body, updatedContactRules);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    next();
  }

  validateAddedContact(req, res, next) {
    const addedConatactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const result = Joi.validate(req.body, addedConatactRules);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    next();
  }
}

module.exports = new ContactsControllers();
