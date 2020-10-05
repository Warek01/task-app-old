let input = document.querySelector('#input'),
    noContent = document.querySelector('#no-content'),
    mainContent = document.querySelector('.main-content');

const BGCOLS = ['#bdc3c7', '#1abc9c', '#3498db', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f' ,'#c0392b'];
const TEXTCOLS = ['#fff', '#ad64d1', '#bdc3c7', '#9AECDB', '#25CCF7', '#32ff7e', '#7efff5'];
let currentBgCol = 0,
    currentTextCol = 0;

(()=> {
    let isBlocked = false;
    
    document.querySelector('.options li:first-child').addEventListener('click', e => {
        let menu = document.querySelector('#help'),
            display = window.getComputedStyle(menu).getPropertyValue('display');

        if (display == 'none')
            menu.style.display = 'block'
        
        document.querySelector('header .options').style.pointerEvents = 'none';
    }) // help
    
    document.querySelector('.options li:nth-of-type(2)').addEventListener('click', e => {

        if (++currentBgCol > BGCOLS.length - 1) currentBgCol = 0;

        document.body.style.backgroundColor = BGCOLS[currentBgCol];

        document.querySelector('#bgcol').style.backgroundColor = BGCOLS[currentBgCol];
    }) // background color
    
    document.querySelector('.options li:nth-of-type(3)').addEventListener('click', e => {

        if (++currentTextCol > TEXTCOLS.length - 1) currentTextCol = 0;

        for (let elem of document.querySelectorAll('.text-col')) {
            elem.style.color = TEXTCOLS[currentTextCol];
        }

        document.querySelector('#textcol').style.backgroundColor = TEXTCOLS[currentTextCol];
    }) // text color

    document.querySelector('#close-btn').addEventListener('click', e => {
        let menu = document.querySelector('#help'),
            display = window.getComputedStyle(menu).getPropertyValue('display');

        if (display == 'block')
            menu.style.display = 'none'

        document.querySelector('header .options').style.pointerEvents = 'auto';
    }) // help menu close button

})()

document.addEventListener('keydown', e => {

    switch (e.key){
        case 'Delete':
            deleteTask()
            break;

        case 'Enter':
            if (input.value !== '' && input.value !== ' ') {

            addTask()
            input.value = '';

            if (noContent.style.display !== 'none')
            noContent.style.display = 'none';
            } 
            break;

        case 'F1':
            event.preventDefault()
            if (currentBgCol !== 0) {

                currentBgCol = 0;
                document.body.style.backgroundColor = BGCOLS[currentBgCol];
                document.querySelector('#bgcol').style.backgroundColor = BGCOLS[currentBgCol];

            }
            
            if (currentTextCol !== 0) {

                currentTextCol = 0;
                
                for (let elem of document.querySelectorAll('.text-col')) {
                    elem.style.color = TEXTCOLS[currentTextCol];
                }
        
                document.querySelector('#textcol').style.backgroundColor = TEXTCOLS[currentTextCol];
            }
            break;
    }
}) // add task


class Task {
    constructor() {
        let task = document.createElement('div'),
            inputCheck = document.createElement('input'),
            span = document.createElement('span'),
            img = document.createElement('img'),
            taskContent = document.createElement('p'),
            separateLine = document.createElement('div'),
            clearDiv = document.createElement('div');

        taskContent.textContent = input.value;
        
        task.className = 'task';

        separateLine.className = 'separate-line';

        inputCheck.className = 'task-check';
        inputCheck.type = 'checkbox';

        span.className = 'checkbox';
        img.src = 'img/checkmark-16.png';
        span.append(img);

        clearDiv.style.clear = 'both'; 

        task.append(separateLine, inputCheck, span, taskContent, clearDiv)

        taskContent.classList.add('taskContent' ,'text-col')
        taskContent.style.color = TEXTCOLS[currentTextCol];

        inputCheck.addEventListener('click', e => {
            let p = e.target.closest('div').querySelector('p.taskContent');

            (p.style.textDecoration == 'line-through')?
            p.style.textDecoration = 'none' :
            p.style.textDecoration = 'line-through';
        })

        return task;
    }
}

function addTask() {
    mainContent.append(new Task())
    manageLines()
}

function deleteTask() {
    if (mainContent.childElementCount > 0) {

        let elem = mainContent.firstElementChild;
        elem.style.opacity = '0';
        elem.style.marginTop = '-70px';
        
        setTimeout(()=> {
            elem.remove()
            manageLines()

            if (mainContent.childElementCount === 0) noContent.style.display = 'flex';
        }, 310) 
    }
}

function manageLines() {

    for (let task of document.querySelectorAll('.task')) {
        
        if (task == document.querySelector('.main-content').firstElementChild) {
            //task.querySelector('.separate-line').style.display = 'none'
            task.querySelector('.separate-line').style.width = '0';
        }
    }
}