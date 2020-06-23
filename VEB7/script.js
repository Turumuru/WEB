// интерфейс
var dir, start_pause, restart, change_player, section;
var game, info;
var x_fault, y_fault;

// логика
var bGame;

// основное поле
var canvas, ctx;

// вводим background
var image = new Image(900, 600); //фон
image.src = 'fon.jpg'; //фон

// данные
var name = ""; //имя игрока
var score; //счёт
var hp; //здоровья
var spec; //супер удар
var enemy_list = []; //враги
var bullet_list = []; //ядра
var level = 1;

// всё для пушки
var gun; //пушка
var gun_x, gun_y; //координаты пушки
var angle; //начальный угол орудия
var draw_angle;
var tic; // время перезарядки

// вводим картинки врагов
var en1 = new Image(200, 200);
en1.src = 'врагов1.gif';
var en2 = new Image(150, 150);
en2.src = 'врагов2.gif';
var en3 = new Image(150, 150);
en3.src = 'врагов3.gif';
var en4 = new Image(150, 150);
en4.src = 'врагов4.gif';

// таймер
var game_timer;


function new_session() {
    check_name();
    init();
}

// главная, для инициализпции игры
function init() {
    dir = "game";
    canvas = document.getElementById('canvas');
    gun = new Gun;
    gun_x = 50;
    gun_y = canvas.height - 50;
    score = 0;
    hp = 5;
    spec = 3;
    level = 1;
    // Градусы -> радианы
    // для проворота ядер
    angle = 45 * Math.PI / 180;
    // для проворота пушки
    draw_angle = 45 * Math.PI / 180;
    tic = 0; // время перезарядки
    enemy_list = [];
    bullet_list = [];
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        drawBack(ctx, canvas.width, canvas.height);
        // расположение х относительно левого края
        x_fault = canvas.getBoundingClientRect().left;
        // расположение у относительно верхнего края
        y_fault = canvas.getBoundingClientRect().top;
    }

    // даем имена копкам отвечающих за интерфейс
    start_pause = document.getElementById("btn1");
    restart = document.getElementById("btn2");
    change_player = document.getElementById("btn3");
    section = document.getElementById("btn4");
    game = document.getElementById("game"); // если щелкаем по канвас
    info = document.getElementById("info");
    bGame = false;
}

// рисуем основное поле, то есть всё что отвечает за игру
function drawBack(ctx, w, h) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // вставляем фон
    ctx.drawImage(image, 0, 0);
    // пишем информацию о жизнях и очках
    draw_info();
    // вносим в поле нарисованные  ядра
    for (i = 0; i < bullet_list.length; i++)
        bullet_list[i].draw(ctx);
    // вносим в поле нарисованных врагов
    for (i = 0; i < enemy_list.length; i++)
        enemy_list[i].draw(ctx);
    // рисуем пушку
    gun.draw(ctx);
}

// для выстрела
function shoot() {
    // если игра идёт и время перезарядки достигло 150 милисекунд
    if (bGame && (tic >= 150)) {
        // то обнуляем время перезарядки
        tic = 0;
        // и даём возможность выпускать ядро под заданым углом через радианы
        bullet_list.push(new Bullet(angle));
    }
}

// для вращения пушки
function rotate(event) {
    // если игра началась
    if (bGame) {
        // вычисляет расположение мыши по x (x_fault) за счет вычитания расположения пушки(50) и её наклона(event.x)
        let dx = event.x - x_fault - 50;
        // вычисляет расположение мыши по y (y_fault) за счет вычитания расположения пушки(50), её наклона(event.x) и и длинны конвы
        let dy = canvas.height + y_fault - event.y - 50;
        // проверяем находится ли мышка в поле
        if (dy >= 0 && dx >= 0) {
            // для проворота ядер
            angle = Math.atan2(dy, dx);
            // для проворота пушки
            draw_angle = Math.atan2(dx, dy);
        }
    }
}

// отвечает за начало и паузу
function change_status() {
    if (!bGame) { //если игра запущена
        bGame = true;
        start_pause.value = "Пауза"; // меняем значение на паузу
        //отключаем кпоки
        restart.disabled = true;
        change_player.disabled = true;
        section.disabled = true;
        // setInterval - позволяет вызывать функцию play() регулярно, повторяя вызов через 1 милисекунду
        game_timer = setInterval('play();', 1);
        return;
    }
    if (bGame) {
        bGame = false;
        start_pause.value = "Играть"; // меняем значение на играть
        //включаем кнопки
        restart.disabled = false;
        change_player.disabled = false;
        section.disabled = false;
        // clearInterval - отменяет многократные повторения действий, установленные вызовом функции setInterval()
        clearInterval(game_timer);
        return;
    }
}

// отвечает за просмотр таблицы игроков
function change_section() {
    // если если ноходимся в таблице
    if (dir === "info") {
        // то переходим в игру
        dir = "game";
        //включаем кнопки
        start_pause.disabled = false;
        restart.disabled = false;
        change_player.disabled = false;
        // меняем значение на таблица
        section.value = "Таблица";
        // делаем таблицу невидимой
        info.style.display = "none";
        // делаем игру видимой
        game.style.display = "block";
        return;
    }
    // если если ноходимся в игре
    if (dir === "game") {
        // то переходим в таблицу
        dir = "info";
        //отключаем кпоки
        start_pause.disabled = true;
        restart.disabled = true;
        change_player.disabled = true;
        //меняем значение на игра
        section.value = "Игра";
        info.style.display = "block";
        game.style.display = "none";
        display_table();
        return;
    }
}

// задаем рандомное число
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}


function play() {
    if (hp > 0) { // если у нас есть жизни
        // рисуем все характеристики
        drawBack(ctx, canvas.width, canvas.height);
        // увеличиваем время перезарядки
        tic++;
        // подсчитываем уровень за счет очков
        level = score / 500 + 1;
        // увеличение количества врагов в зависимости от уровня
        en_amount = 3 + level * 2;

        // для того что бы удалять ядро при пересечении правой границы канвас
        for (i = 0; i < bullet_list.length; i++) {
            if (bullet_list[i].posX + bullet_list[i].size >= canvas.width)
                bullet_list.splice(i--, 1);
        }

        // пока есть враги и ядра
        for (i = 0; i < bullet_list.length; i++) {
            for (j = 0; j < enemy_list.length; j++) {
                // проверяет коснулось ли ядро врага
                if (clash(bullet_list[i], enemy_list[j])) {
                    //если попали то увеличиваем очки на прописанную величину points
                    score += enemy_list[j].points;
                    //удаляем врага
                    enemy_list.splice(j--, 1);
                }
            }
        }

        // пока есть враги
        for (j = 0; j < enemy_list.length; j++) {
            // если они пересекли правую границу
            if (enemy_list[j].posX <= 0) {
                // то удаляем врага
                enemy_list.splice(j--, 1);
                // и отнимаем жизнь
                hp--;
            }
        }

        // пока есть враги
        for (j = 0; j < enemy_list.length; j++) {
            // совершаем движение врагов с их скоростью
            enemy_list[j].posX -= enemy_list[j].speed;
        }

        // пока список врагов меньше, что расчитано на уровень
        while (enemy_list.length < en_amount)
            get_enemy();
    } else {
        end_game();
    }
}

// рисуем шупку
Gun = new Class({
    draw: function (ctx) {
        with (this) {
// круг и трапеция
            ctx.save()
            // translate() - установливает новую нулевую позицию по координатам (gun_x, gun_y)
            ctx.translate(gun_x, gun_y);
            // rotate - для вращения пушки
            ctx.rotate(draw_angle);
            // задаём цвет
            ctx.fillStyle = "Navy";
            // начинаем рисовать
            ctx.beginPath();
            ctx.arc(0, 0, 35, 2 * Math.PI, Math.PI, false);
            ctx.moveTo(15 - 50, 0);
            ctx.lineTo(30 - 50, 0 - 65);
            ctx.lineTo(70 - 50, 0 - 65);
            ctx.lineTo(85 - 50, 0);
            ctx.lineTo(15 - 50, 0);
            ctx.closePath();
            // закрашиваем нарисованое
            ctx.fill();
            // сохраняем состояние канваса
            ctx.restore();
// подставка
            ctx.save()
            // задаём цвет при перезарядке
            if (tic >= 100)
                ctx.fillStyle = '#fff';
            else
                ctx.fillStyle = 'red';
            // начинаем рисовать
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(20, canvas.height - 30);
            ctx.lineTo(80, canvas.height - 30);
            ctx.lineTo(100, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fill();
            // сохраняем состояние канваса
            ctx.restore();
        }
    }
})

// ядро
Bullet = new Class({
    initialize: function (angle) {
        this.posX = 0;
        this.posY = 0;
        this.speed = 25; // скорость
        this.size = 5;
        this.angle = angle;
    },
    // вычисляем полёт с балистикой
    fly: function () {
        // формула балистики
        // x = x + скорость(25) * cos(45 * Math.PI / 180) / 5
        // y = x * tg(45 * Math.PI / 180) - (0,4 * x**2 / 2 * скорость(25)**2 * cos((45 * Math.PI / 180)**2))
        p1 = this.posX * Math.tan(this.angle);
        p2 = 0.4 * (this.posX ** 2);
        p3 = 2 * (this.speed ** 2) * (Math.cos(this.angle) ** 2);
        this.posY = p1 - (p2 / p3);
        this.posX += this.speed * Math.cos(this.angle) / 5;
    },
    draw: function (ctx) {
        // задаём цвет ядер
        ctx.fillStyle = 'red';
        // save - сохраняет все состояния и добавляет текущее состояние в стек
        ctx.save();
        // translate() - установливает новую нулевую позицию по координатам (gun_x, gun_y)
        ctx.translate(gun_x, gun_y);
        // начинаем рисовать
        ctx.beginPath();
        ctx.arc(this.posX, -this.posY, this.size + 10, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        // сохраняем состояние канваса
        ctx.restore();
        // вычисляем полёт с балистикой
        this.fly();
    }
})

// враги
enemy_data = [{
    size: 200,
    speed: 2 * level / 5, // увеличение скорости с увеличением уровня
    points: 5, // количество очков за попадание
    img: en1
}, {
    size: 150,
    speed: 4 * level / 5,
    points: 10,
    img: en2
}, {
    size: 150,
    speed: 6 * level / 5,
    points: 20,
    img: en3
}, {
    size: 150,
    speed: 8 * level / 5,
    points: 40,
    img: en4
}]

Enemy = new Class({
    initialize: function (pX, pY, sz, sp, pts, im) {
        this.posX = pX; // позиция фигуры по X
        this.posY = pY; // позиция фигуры по Y
        this.size = sz;
        this.speed = sp;
        this.points = pts;
        this.img = im;
    },
    draw: function (ctx) {
        // вставляем картинки врагов
        // расчитываем положение картинки врага по х и у за счет нахождения центра  картинки
        ctx.drawImage(this.img, this.posX - this.size / 2, canvas.height - this.posY - this.size / 2, this.size, this.size);
    },
})

// дабавление врагов
function get_enemy() {
    type = randomInt(0, 4);
    // x = длина поля + рандомное значение от 100 до 1000, для того чтобы враги лители с промежутком
    x = canvas.width + randomInt(100, 1000);
    // y = рандомное значение от 100 до (длины - 100), для разного расположения врагов по оси oy
    // первое число отвечает за ограничение снизу а второе за ограничение врагов сверху
    y = randomInt(100, canvas.height - 100);
    // даем имя списку врагов
    data = enemy_data[type]
    // добавляем врагов из списка по х и у раннее вычислимых и с заданными размерами, скоростью, очками и картинкой
    enemy_list.push(new Enemy(x, y, data.size, data.speed, data.points, data.img));
}

// информация (жизни и очки)
function draw_info() {
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText(get_hp(), 10, 40);
    ctx.font = "30px Arial";
    ctx.fillText(score, 15, 70);
}

// жизни
function get_hp() {
    str = '';
    i = 0;
    while (i++ < hp) str += '❤';
    while (i++ <= 5) str += '♡';
    return str;
}

//name
function check_name() {
    firstName = prompt('Как Вас зовут?');
    if (Boolean(firstName)) {
        name = firstName;
    } else
        check_name();
}

// проверяет ли коснулось ли ядро врага
function clash(figure1, figure2) {
    clashX = false; //сначала по х и у не касается врага
    clashY = false;
    // если позиция ядра (х) - половина картнки врага меньше или равно позиции врага (х) и позиция ядра(х) + половина картинки врага больше равно позиции врага (х), то true
    //проверяем пролетело ли ядро через центр
    if (figure1.posX - figure2.size / 2 <= figure2.posX && figure1.posX + figure2.size / 2 >= figure2.posX) clashX = true;
    // если позиция ядра (y) - половина картнки врага меньше или равно позиции врага (y) и позиция ядра(y) + половина картинки врага больше равно позиции врага (y), то true
    if (figure1.posY - figure2.size / 2 <= figure2.posY && figure1.posY + figure2.size / 2 >= figure2.posY) clashY = true;
    //  если попали по х и по у то передаем true
    return clashX && clashY;
}

//
function end_game() {
    alert("GAME OVER");
    //сохраняем значение имя и набранные очки
    localStorage.setItem(name, score);
    // ставим игру на паузу
    change_status();
    //переносим игрока в таблицу рекордов
    change_section();
}

// выводит таблицу рекордов
function display_table() {
    // вводит имя и очки
    let html = "<table><th>ИМЯ</th><th>ОЧКИ</th>";

    for (let i = 0; i < localStorage.length && i < 15; i++) {
        html += "<tr>";
        for (let j = 0; j < 1; j++) {
            // вводим в таблицу всех игроков с их очками
            let key = localStorage.key(i)
            html += "<td>" + localStorage.key(i) + "</td>";
            html += "<td>" + localStorage.getItem(key) + "</td>"
        }
        html +=

            "</tr>";
    }
    html += "</table>";

    document.getElementById("top").innerHTML = html;
}