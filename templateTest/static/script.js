document.addEventListener("DOMContentLoaded", function() {
    var calendarEl = document.getElementById('calendar');
    var modal = document.getElementById("event-modal");
    var span = document.getElementsByClassName("close")[0];
    var form = document.getElementById("event-form");
    var deleteButton = document.getElementById("delete-event");
    var selectedEvent;
    var taskForm = document.getElementById('task-form');
    var taskList = document.getElementById('task-list');
    var newTaskInput = document.getElementById('new-task');
    var deleteTaskButton = document.getElementById('delete-task');
    
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            var li = document.createElement('li');
            
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    li.style.textDecoration = 'line-through';
                } else {
                    li.style.textDecoration = 'none';
                }
            });
            
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(taskText));
            taskList.appendChild(li);
            newTaskInput.value = '';
        }
    });

    deleteTaskButton.addEventListener('click', function() {
        var selectedTasks = taskList.querySelectorAll('li input:checked');
        selectedTasks.forEach(function(checkbox) {
            taskList.removeChild(checkbox.parentNode);
        });
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        editable: true,
        events: [

            // Puedes añadir más eventos aquí
        ],
        dateClick: function(info) {
            form.reset();
            selectedEvent = null;
            document.getElementById('event-start').value = info.dateStr + 'T00:00';
            document.getElementById('event-end').value = info.dateStr + 'T00:00';
            modal.style.display = "block";
        },
        eventClick: function(info) {
            selectedEvent = info.event;
            document.getElementById('event-title').value = info.event.title;
            document.getElementById('event-start').value = info.event.start.toISOString().slice(0, 16);
            document.getElementById('event-end').value = info.event.end ? info.event.end.toISOString().slice(0, 16) : '';
            modal.style.display = "block";
        }
    });

    calendar.render();

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = function(event) {
        event.preventDefault();
        var title = document.getElementById('event-title').value;
        var start = document.getElementById('event-start').value;
        var end = document.getElementById('event-end').value;
        
        if (selectedEvent) {
            selectedEvent.setProp('title', title);
            selectedEvent.setStart(start);
            selectedEvent.setEnd(end ? end : null);
        } else {
            calendar.addEvent({
                title: title,
                start: start,
                end: end ? end : null
            });
        }
        modal.style.display = "none";
    }

    deleteButton.onclick = function() {
        if (selectedEvent) {
            selectedEvent.remove();
            modal.style.display = "none";
        }
    }

    window.addEventListener('resize', function() {
        calendar.updateSize();
    });
});
