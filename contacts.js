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
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedData = JSON.parse(data);
    const findContact = parsedData.find((contact) => contact.id === contactId );
    console.table(findContact);
  }
  
 async function removeContact(contactId) {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedData = JSON.parse(data);
    const filteredContact = parsedData.filter((contact) => contact.id !== contactId );
    const filteredContactsList = JSON.stringify(filteredContact);
    const newList = await fsPromises.writeFile(contactsPath, filteredContactsList);
    console.table(newList);
  }
  
  async function addContact(name, email, phone) {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    let biggestId = 0;
    const parsedData = JSON.parse(data)
    parsedData.forEach(el=> {
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
    const newContactList = [...parsedData, newContact];
    const newContactListString = JSON.stringify(newContactList);
    const newList = await fsPromises.writeFile(contactsPath, newContactListString);
    console.table(newList);
  }
  
  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
  };
  