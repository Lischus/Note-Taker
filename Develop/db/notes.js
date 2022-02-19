const uuid = require('../helper/uuid');
const fs = require('fs');
const util = require('util');
const { parse } = require('path');

const readFileAsync = util.promisify(fs.readFile);

const writeFileAsync = util.promisify(fs.writeFile);

class Notes {
    read() {
        return readFileAsync('db/db.json', 'utf-8')
    }
    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note))
    }
    getNotes() {
        return this.read().then((notes) => {
            let parseNotes
            try {
                parseNotes = [].concat(JSON.parse(notes))
            } catch (error) {
                parseNotes = []
            }
            return parseNotes
        })
    }
    addNote(note) {
        const {title, text} = note
        const newNote = {title, text, id:uuid()}
        return this.getNotes().then((notes) => [...notes, newNote])
        .then((updatedNotes) => this.write(updatedNotes))
        .then(() => newNote)
    }
};

module.exports = new Notes()