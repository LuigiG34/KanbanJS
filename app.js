// vars
let note;
let dateText;
let titleText;
let contentText;
let dragItem = null;

// variables (inputs,btn & trash)
let inputTitle = document.querySelector('#title-note');
let inputContent = document.querySelector('#content-note');
let validationBtn = document.querySelector('.valid-btn');
let trash = document.querySelector('.trash');
let containers = document.querySelectorAll('.drop');
let notes = document.querySelectorAll('.new-note');



/**
 * Notes Object
 */
class Notes {
    /**
     * Notes constructor
     * @param {*} title 
     * @param {*} content 
     */
    constructor(title, content) {
        // id = notes length
        notes = document.querySelectorAll('.new-note');
        let id = notes.length;

        this.id = ++id;
        this.title = title;
        this.content = content;
        let date = new Date().toLocaleDateString("fr", {
            weekday: "long",
            year: "2-digit",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        })
        this.date = date;
        // 0 = TODO, 1 = DONE, 2 = VERIFIED & 3 = TRASH
        this.status = 0;
    }

    // creates a note and sets id as object id
    createNote(id)
    {
        note = document.createElement('div');
        note.setAttribute('id', id);

        dateText = document.createElement('small');
        titleText = document.createElement('h5');
        contentText = document.createElement('p');
    }

    // add content inside of note (date,title and content)
    // and add attribute draggable + new-note class for an array
    addContentNote(a,b,c)
    {
        dateText.textContent = a;
        titleText.textContent = b;
        contentText.textContent = c;

        note.setAttribute('draggable', 'true');
        note.classList.add('new-note');
    }

    // append notes content and note to the todo container
    appendNote()
    {
        note.append(titleText);
        note.append(contentText);
        note.append(dateText);

        // add events for drag and drop
        note.addEventListener('dragstart', dragStart);
        note.addEventListener('dragend', dragEnd);
    }
}


/******************ARRAY WITH ALL NOTES**********************/
/******************ARRAY WITH ALL NOTES**********************/
/******************ARRAY WITH ALL NOTES**********************/
class ArrayNotes
{
    // all notes are in array
    static array = [];

    // push object to array
    static pushObject(object)
    {
        this.array.push(object);
    }

    // set array to localStorage
    static setStorage()
    {
        window.localStorage.setItem('noteArray', JSON.stringify(this.array));
    }
    
    // get localStorage
    static getStorage()
    {
        return JSON.parse(window.localStorage.getItem('noteArray'));
    }
}


/*********************CREATE NOTE****************************/
/*********************CREATE NOTE****************************/
/*********************CREATE NOTE****************************/
// When user click button
validationBtn.addEventListener('click', () => {
    // if input are empty stop the code
    if(inputTitle.value == "" || inputContent.value == "") return;

    // else create a new note from input values
    let newNote = new Notes(inputTitle.value,inputContent.value);
    newNote.createNote(newNote.id);
    newNote.addContentNote(newNote.date,newNote.title,newNote.content);
    newNote.appendNote();
    containers[0].append(note);


    // push note to array and set local storage
    ArrayNotes.pushObject(newNote);
    ArrayNotes.setStorage();
    notes = document.querySelectorAll('.new-note');
})

/*******************DRAG AND DROP*************************/
/*******************DRAG AND DROP*************************/
/*******************DRAG AND DROP*************************/
// when drag starts item doesnt stay in container
function dragStart()
{
    dragItem = this;
    setTimeout(() => this.style.display = "none", 0);
}
// when drag ends item doesnt keep display none
function dragEnd()
{
    setTimeout(() => this.style.display = "block", 0);
    dragItem = null;
}
// add events drag and drop
for(j of containers)
{
    j.addEventListener('dragover', dragOver);
    j.addEventListener('dragenter', dragEnter);
    j.addEventListener('dragleave', dragLeave);
    j.addEventListener('drop', drop);
}
// when item drop append item to container
function drop()
{
    this.append(dragItem);
    // change status relative to container
    console.log(dragItem);
    if(dragItem.parentNode.classList.contains("to-do")){
        ArrayNotes.array[dragItem.id - 1].status = 0;
        ArrayNotes.setStorage();
    }
    if(dragItem.parentNode.classList.contains("done")){
        ArrayNotes.array[dragItem.id - 1].status = 1;
        ArrayNotes.setStorage();
    }
    if(dragItem.parentNode.classList.contains("verified")){
        ArrayNotes.array[dragItem.id - 1].status = 2;
        ArrayNotes.setStorage();
    }
    this.style.boxShadow = "1px 1px 10px 2px #959595, -1px -1px 15px 2px #ffffff";
}
// when dragged over add animation to container & allow drop
function dragOver(e)
{
    e.preventDefault();
    this.style.boxShadow = "rgb(255 255 255) 5px 5px 125px 0px inset, rgb(10 10 10) -5px 5px 25px 5px inset";
}
// prevent default
function dragEnter(e)
{
    e.preventDefault();
}
// when drag leave make border normal again
function dragLeave()
{
    this.style.boxShadow = "1px 1px 15px 2px #959595, -1px -1px 15px 2px #ffffff";
}
/********TRASH DRAG AND DROP********/
trash.addEventListener('dragover', dragOver);
trash.addEventListener('dragenter', dragEnter);
trash.addEventListener('dragleave', dragLeave);
trash.addEventListener('drop', dropTrash);

function dropTrash()
{
    if(ArrayNotes.array.length === 1){
        localStorage.clear();
        dragItem.remove();
    }else{
       ArrayNotes.array[dragItem.id - 1].status = 3;
        dragItem.remove();
        ArrayNotes.setStorage(); 
    }
}

/*********LOAD STORAGE NOTES**********/
/*********LOAD STORAGE NOTES**********/
/*********LOAD STORAGE NOTES**********/

// when page loads
window.addEventListener('load', () =>{
        let array = JSON.parse(window.localStorage.getItem('noteArray'));
        if(array === null) return;
        if(array.length === 0) return;
        // foreach note in array create a note
        array.forEach(elem => {
            let note = document.createElement('div');
            let dateText = document.createElement('small');
            let titleText = document.createElement('h5');
            let contentText = document.createElement('p');

            // add content to storage note
            dateText.textContent = elem.date;
            titleText.textContent = elem.title;
            contentText.textContent = elem.content;

            // append storage note
            note.append(titleText);
            note.append(contentText);
            note.append(dateText);

            //add Attributes
            note.setAttribute('draggable', 'true');
            note.classList.add('new-note');
            note.setAttribute('id', elem.id);

            // add events for drag and drop
            note.addEventListener('dragstart', dragStart);
            note.addEventListener('dragend', dragEnd);

            // status = 3 is TRASH so we don't append it or keep it in storage
            if(elem.status === 3) return;
            // append to correct container according to status
            containers[elem.status].append(note);
            ArrayNotes.pushObject(elem);
            ArrayNotes.setStorage();
            notes = document.querySelectorAll('.new-note');
        });
})