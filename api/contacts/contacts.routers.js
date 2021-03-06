const { Router } = require("express");
const contactsControllers = require("../../contacts/contacts.controllers");

const contactsRouters = Router();

contactsRouters.get("/", contactsControllers.listContacts);

contactsRouters.get("/:id", contactsControllers.getContactById);

contactsRouters.delete("/:id", contactsControllers.removeContact);

contactsRouters.post(
  "/",
  contactsControllers.validateAddedContact,
  contactsControllers.addContact
);

contactsRouters.patch(
  "/:id",
  contactsControllers.validateUpdateContact,
  contactsControllers.updateContact
);

module.exports = contactsRouters;
