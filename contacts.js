const fs = require('fs');
const {promises: fsPromises} = fs;
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json') ;

 async function listContacts() {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedData = JSON.parse(data)
    console.table(parsedData);
  }
  
  async function getContactById(contactId) {
    const data = await listContacts();
    const findContact = data.find((contact) => contact.id === contactId );
    console.table(findContact);
  }
  
 async function removeContact(contactId) {
    const data = await listContacts();
    const filteredContact = data.filter((contact) => contact.id !== contactId );
    const filteredContactsList = JSON.stringify(filteredContact);
    await fsPromises.writeFile(contactsPath, filteredContactsList);
    console.table(filteredContact);
  }
  
  async function addContact(name, email, phone) {
    const data = await listContacts();
    let biggestId = 0;
    data.forEach(el=> {
      if(el.id > biggestId) {
        biggestId = el.id;
      }
    });
    const newContact = {
      id: biggestId + 1,
      name,
      email,
      phone
      
    }
    const newContactList = [...data, newContact];
    const newContactListString = JSON.stringify(newContactList);
    await fsPromises.writeFile(contactsPath, newContactListString);
    console.table(newContactList);
  }
  
  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
  };
  