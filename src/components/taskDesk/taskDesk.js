export default function taskDesk() {
    const deskWrapper = document.querySelector('.deskWrapper');
    const taskDesk = document.querySelectorAll('.taskDesk');

    const taskAddBox = document.querySelectorAll('.taskDesk_add_box');

    const buttonAdd = document.querySelectorAll('.js-add-card');
    const buttonClose = document.querySelectorAll('.js-close');
    const buttonSave = document.querySelectorAll('.taskDesk_button_save');
    const buttonAddTitle = document.querySelectorAll('.js-add-column');
    const buttonSaveTitle = document.querySelectorAll('.js-save-title');
    const buttonDeleteColumn = document.querySelectorAll('.js-del-column');

    const taskArea = document.querySelectorAll('.js-task-area');
    const taskInput = document.querySelectorAll('.js-task-input');
    const taskList = document.querySelectorAll('.task_list');

    const KEY_ENTER = '13';


    const handleAddButton = (e) => {
        e.target.parentElement.classList.add('active'); // ищем текущего родителя, чтобы работать с конкретным тасклистом
    };

    const handleCloseButton = (e) => {
        e.target.parentElement.classList.remove('active');

        e.target.form.querySelector('.js-task-area').value = ''; // при закрытии редактирования тасков, очищаем текущее поле
        handleCheckArea(e);
    };

    const handleCheckArea = (e) => {
        if (e.target.value === '') {
            e.target.form.classList.add('emptyArea');
        } else {
            e.target.form.classList.remove('emptyArea');
        }
    };

    const handleSaveTask = (e) => {
        const newTask = document.createElement('li');
        newTask.classList.add('task_item');
        newTask.innerHTML = e.target.form.querySelector('.js-task-area').value; // записываем в новый таск данные из текущей textarea
        e.target.closest('.taskDesk').querySelector('.task_list').appendChild(newTask); // ищем текущий тасклист и добавляем ему таск

        e.target.form.querySelector('.js-task-area').value = ''; // очищаем текущую textarea

        handleCheckArea(e);
    };

    const handleCheckInputTitle = (e) => {
        if (e.target.value === '') {
            e.target.form.querySelector('.js-save-title').classList.remove('emptyInput');
        } else {
            e.target.form.querySelector('.js-save-title').classList.add('emptyInput');
        }
    };

    const handleAddTitle = (e) => {
        e.target.closest('.taskDesk').classList.add('active');
        e.target.form.querySelector('.js-task-input').classList.add('active'); // показываем поле для ввода заголовка
        e.target.form.querySelector('.js-save-title').classList.add('active'); // показываем кнопку "Сохранить заголовок"
    };

    const handleSaveTitle = (e) => {
        e.target.closest('.taskDesk').querySelector('.taskDesk_title').innerHTML = e.target.form.querySelector('.js-task-input').value;
        e.target.form.classList.remove('addColumn');
        e.target.form.classList.add('active');
    };

    // const handleClearColumn = (e) => {
    //     e.target.closest('.taskDesk').classList.remove('active');
    //     e.target.closest('.taskDesk').querySelector('.taskDesk_add_box').classList.remove('active');
    //     e.target.closest('.taskDesk').querySelector('.taskDesk_add_box').classList.remove('addColumn');
    //     e.target.closest('.taskDesk').querySelector('.js-task-input').classList.remove('active');
    // };

    const dragAndDrop = (e) => {
        e.preventDefault();
        let startCoords = {
            x: e.clientX,
            y: e.clientY
        };
        function onMouseMove(moveEvt) {
            moveEvt.preventDefault();

            let shift = {
                x: startCoords.x - moveEvt.clientX,
                y: startCoords.y - moveEvt.clientY
            };

            startCoords = {
                x: moveEvt.clientX,
                y: moveEvt.clientY
            };
            e.target.style.position = 'absolute';
            e.target.style.top = (e.target.offsetTop - shift.y) + 'px';
            e.target.style.left = (e.target.offsetLeft - shift.x) + 'px';
            e.target.style.pointerEvents = 'none';
            e.target.style.zIndex = 10000;
        }

        const onMouseUp = function (upEvt) {
            upEvt.preventDefault();
            e.target.style.position = 'static';
            e.target.style.top = 0;
            e.target.style.left = 0;
            e.target.style.pointerEvents = 'auto';
            e.target.style.zIndex = 1000;

            const clonedTask = e.target.cloneNode(true);
            const thisTask = e.target;
            const onElem = document.elementFromPoint(upEvt.clientX, upEvt.clientY);

            onElem.closest('.taskDesk').querySelector('.task_list').appendChild(clonedTask);

            thisTask.remove();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };


    const handleClickOnDesk = (e) => { // отслеживаю клики на всей карточке
        if (e.target.classList.contains('js-add-column')) {
            handleAddTitle(e);
        }
        if (e.target.classList.contains('js-save-title')) {
            handleSaveTitle(e);
            // e.target.closest('.taskDesk').querySelector('.js-del-column').classList.add('active'); // показываем кнопку очистки колонки
        }
        if (e.target.classList.contains('js-add-card')) {
            handleAddButton(e);
        }
        if (e.target.classList.contains('js-close')) {
            handleCloseButton(e);
        }
        if (e.target.classList.contains('taskDesk_button_save')) {
            handleSaveTask(e);
        }

    };

    const handleDragListItem = (e) => {
        if (e.target.classList.contains('task_item')) {
            e.target.addEventListener('mousedown', dragAndDrop);
        }

    };

    // добавление новой доски

    const addClickListeners = () => {
        const newLastDesk = deskWrapper.children[deskWrapper.children.length - 1]; // ищем новую доску через родителя
        const newDeskForm = newLastDesk.querySelector('.taskDesk_add_box');
        const newInputTitle = newDeskForm.querySelector('.js-task-input');
        const newArea = newDeskForm.querySelector('.js-task-area');
        const newSaveTitleButton = newDeskForm.querySelector('.js-save-title');
        const clearColumnButton =  newLastDesk.querySelector('.js-del-column');

        newDeskForm.classList.add('addColumn');

        newLastDesk.addEventListener('click', handleClickOnDesk); // навешиваем обработчики события click на новую доску
        newInputTitle.addEventListener('input', handleCheckInputTitle);
        newArea.addEventListener('input', handleCheckArea);
        newSaveTitleButton.addEventListener('click', addNewDesk);

        // clearColumnButton.addEventListener('click', handleClearColumn);
    };

    const addNewDesk = (e) => { // функция копирования и добавления доски из template
        const temp = document.querySelector('.js-template');
        const deskClone = temp.content.cloneNode(true);
        deskWrapper.appendChild(deskClone);
        addClickListeners();
    };

    addNewDesk(); // сразу же отрисуем доску


    const handlePressEnter = (e) => {
        console.log(e.keyCode);
        if (e.keyCode === KEY_ENTER) {
            console.log('ENTER')
        }
    };

    document.addEventListener('mousedown', handleDragListItem, true);

}