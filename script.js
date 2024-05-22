document.querySelector('#push').onclick = function() {
    if (document.querySelector('#newtask input').value.length == 0) {
        alert("Please Enter a Task");
    } else {
        document.getElementById("tasks").style.display = "block";
        document.querySelector('#tasks').innerHTML += `
            <div class="task">
                <span id="taskname">
                    ${document.querySelector('#newtask input').value}
                </span>
                <div class="button-group">
                    <button class="delete">
                        <i class="far fa-trash-alt"></i>
                    </button>
                    <button class="allocateTimer">
                        <i class="fas fa-clock"></i>
                    </button>
                </div>
            </div>
        `;

        updateTaskEvents();
        document.querySelector("#newtask input").value = "";
    }
}

let timerInterval;
let activeTask = null;
let timer = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    timeInSeconds: function() {
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    },
    start: function() {
        timerInterval = setInterval(() => {
            if (this.timeInSeconds() > 0) {
                this.decrement();
                updateTimerDisplay();
            } else {
                timer.stop();
                alert("Time's up!");
                timer.reset();
            }
        }, 1000);
    },
    stop: function() {
        clearInterval(timerInterval);
    },
    reset: function() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        updateTimerDisplay();
        activeTask = null;
        document.querySelector('#startTimer').disabled = true;
        document.querySelector('#stopTimer').disabled = true;
        document.querySelector('#resetTimer').disabled = true;
    },
    decrement: function() {
        if (this.seconds > 0) {
            this.seconds--;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } else if (this.hours > 0) {
            this.hours--;
            this.minutes = 59;
            this.seconds = 59;
        }
    }
};

document.querySelector('#startTimer').onclick = function() {
    if (activeTask) {
        timer.hours = parseInt(document.querySelector('#hours').textContent);
        timer.minutes = parseInt(document.querySelector('#minutes').textContent);
        timer.seconds = parseInt(document.querySelector('#seconds').textContent);
        timer.start();
    }
}

document.querySelector('#stopTimer').onclick = function() {
    timer.stop();
}

document.querySelector('#resetTimer').onclick = function() {
    timer.stop();
    timer.reset();
}

function updateTimerDisplay() {
    document.querySelector('#hours').textContent = timer.hours.toString().padStart(2, '0');
    document.querySelector('#minutes').textContent = timer.minutes.toString().padStart(2, '0');
    document.querySelector('#seconds').textContent = timer.seconds.toString().padStart(2, '0');
}

function updateTaskEvents() {
    document.querySelectorAll('.delete').forEach(button => {
        button.onclick = function() {
            if (this.parentNode.parentNode === activeTask) {
                alert("Cannot delete a task with an active timer.");
            } else {
                this.parentNode.parentNode.remove();
                checkVisibility();
            }
        }
    });

    document.querySelectorAll('.allocateTimer').forEach(button => {
        button.onclick = function() {
            if (activeTask && activeTask !== this.parentNode.parentNode) {
                alert("A timer is already allocated to another task.");
            } else {
                activeTask = this.parentNode.parentNode;
            }
        }
    });
}

function checkVisibility() {
    if (document.querySelectorAll('.task').length === 0) {
        document.getElementById("tasks").style.display = "none";
    }
}

document.querySelectorAll('#timerDisplay span').forEach(span => {
    span.onclick = function() {
        let unit = this.id;
        let value = prompt(`Set ${unit}:`, "0");
        value = parseInt(value, 10);
        if (!isNaN(value) && value >= 0) {
            timer[unit] = value;
            updateTimerDisplay();
            if (timer.timeInSeconds() > 0) {
                document.querySelector('#startTimer').disabled = false;
                document.querySelector('#stopTimer').disabled = false;
                document.querySelector('#resetTimer').disabled = false;
            }
        }
    }
});

// Initial call to set up events
updateTaskEvents();