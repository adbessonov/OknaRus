let typePercent = '';
let ratio = '';
let TableData = [];
const Manufactors = new Set();
const ConstructionTypes = new Set();
const Seasons = new Set();
// Получить модал
var modal = document.getElementById("myModal");
// Получить кнопку, которая открывает модал
var btn = document.getElementById("myBtn");
// Получаем элемент <span>, который закрывает модал
var span = document.getElementsByClassName("close")[0];
// Когда пользователь нажимает на кнопку, открывается модал
btn.onclick = function () {
    modal.style.display = "block";
}
// Когда пользователь нажимает на <span> (x), закрывается модал
span.onclick = function () {
    modal.style.display = "none";
}
// Когда пользователь нажимает в любом месте за пределами модального окна, срабатывает закрытие
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function get_ratio(color, type) {
    return 1;
    // кофицент в зависимости от условий
}

function combo_list_from_set(content) { //set
    let res = '';
    for (const value of content)
        if (value !== undefined)
            res += '<option value="' + value + '">' + value + '</option>';
    return res;
}

// Переносим расчет в функцию ( В процессе )
function calc_costs(price) {
    var height = parseFloat($('#height').val());
    var width = parseFloat($('#width').val());
    var costm2 = parseFloat(price);//$('#productCost').text().trim());
    var area = parseFloat((height / 100 * width / 100) / 100).toFixed(2);
    // var result = area * cost;
    var result = parseFloat((parseInt(height, 10) / 100 * parseInt(width, 10) / 100) * typePercent * costm2 / 100).toFixed(2);
    return result;
}

function viborka_one(manuf, constr_type, season) {
    console.log("пример выборки")
    let result = [];
    //const Series = new Set();
    for (var i = 0; i < TableData.length; i++) {
        let row = TableData[i];
        row[0] == manuf && row[6] == constr_type ? console.log(i) : 1 == 1;//  без сезона
        if (row[0] == manuf && row[6] == constr_type && row[7] == season) {
            result.push(i);
            //    Series.add(row[2]);
        }
        //
    } //....можно вернуть из выборки номера подходящих строк. вернее их массив
    //console.log(Series); $('#serie').html(combo_list_from_set(Series));// не тут
    return result;
}

$(document).ready(function () {
    // $.get('/static/products.csv', function (data) {
    $.get('https://wp.profi-bro.ru/static/calc/products.csv', function (data) {
        var rows = data.split('\n');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].split(';');
            TableData.push(cells);
            Manufactors.add(TableData[i][0]);
            Seasons.add(TableData[i][7]);
            ConstructionTypes.add(TableData[i][6]);
        }

        $('#manufacturer').html(combo_list_from_set(Manufactors));
        $('#type').html(combo_list_from_set(ConstructionTypes));
        $('#season').html(combo_list_from_set(Seasons));
        $('#type').focus();


        $('#type').click(function () {
            const l_manuf = new Set();
            let tip = $(this).val().trim();
            console.log("Contruction: ", tip);
            for (var i = 0; i < TableData.length; i++) {
                console.log(i, ' : ', TableData[i][6] == tip ? "наш" : "не наш");
                if (TableData[i][6] == tip) l_manuf.add(TableData[i][0]);
                // получаем ссылку на изображение из row[8] и присваиваем ее атрибуту "src" элемента с id "productConstructionImg"
                if (TableData[i][6] == tip) $('#productConstructionImg').attr('src', TableData[i][9]);
            }
            $('#manufacturer').html(combo_list_from_set(l_manuf));
        });

        $('#season').click(function () {
            const tip = $('#type').val();
            const l_manuf = new Set();
            TableData.filter(function (a) {
                if (a[7] == $('#season').val() && a[6] == tip)
                    l_manuf.add(a[0]);
                return a[7] == $('#season').val() && a[6] == tip;
            });
            $('#manufacturer').html(combo_list_from_set(l_manuf));
        });

        $('#manufacturer').click(function () {
            const Series = new Set();
            for (var i = 0; i < TableData.length; i++) {
                let row = TableData[i];
                if (row[0] == $('#manufacturer').val() && row[6] == $('#type').val() && row[7] == $('#season').val()) {
                    Series.add(row[2]);
                }
            } //....можно вернуть из выборки номера подходящих строк. вернее их массив
            console.log(Series);
            $('#serie').html(combo_list_from_set(Series));// не тут
        });

//Получаем данные по выбранному профилю в шаблон
        $('#serie').click(function () {
            for (var i = 0; i < TableData.length; i++) {
                let row = TableData[i];
                if (row[0] == $('#manufacturer').val() && row[6] == $('#type').val() && row[7] == $('#season').val() && $('#serie').val() == row[2]) {
                    console.log('Нашли нужный', row);
                    $('#image.image1').attr('src', row[4]).attr('alt', row[2]);
                    $('#productSeries').text(row[2]);
                    $('#productBrand').text(row[0]);
                    $('#productCost').text(row[5]);
                    $('#productDescription').html(row[3]);
                    $('#productType').text(row[1]);
                    $('#productConstructionImg').attr('src', row[9]);
                    typePercent = row[8].trim();
                    console.log("Коэффициент = ", typePercent);
                }
            } //....можно вернуть из выборки номера подходящих строк. вернее их массив

        });
        // Кнопка для расчета
        $('.button-price').click(function () {
            let res_numbers = viborka_one($('#manufacturer').val(), $('#type').val(), $('#season').val());
            for (i of res_numbers) {
                let row = TableData[i];
                console.log('Подходит ', row[0], row[1], row[2], "цена :", row[5], "затраты : ", calc_costs(row[5]));
                //console.log(row[5],row[3]);
            }
        });
    });
    // Рассчитываем (Функция)
    $('#cost').click(function () {
        var height = parseFloat($('#height').val());
        var width = parseFloat($('#width').val());
        var costm2 = parseFloat($('#productCost').text().trim()); // Получаем стоимость за м2
        var area = parseFloat((height / 100 * width / 100) / 100).toFixed(2); // Подсчет размера в м2
        ratio = $('#productСolor.form-control').val().toLowerCase() == '#ffffff' ? 0 : 80;
        var pokraska = ratio * area; // стоимость покраски
        // var result = area * cost;
        var result = parseFloat((parseInt(height, 10) / 100 * parseInt(width, 10) / 100) * typePercent * costm2 / 100 + pokraska).toFixed(0); // Формула расчета
        if (isNaN(result) || result == 0) {
            result = "Пожалуйста, заполните все поля корректно.";
        } else {
            result = parseFloat(result).toFixed(0);
        }
        $('#result').text(result); // Окончательная стоимость
        $('#area').text(area); // размер в М2
    });
    //Подключаем КолорПикер
    $('#color').colorpicker({});
    //Проверка на заполненность полей
    const heightInput = document.getElementById('height');
    const widthInput = document.getElementById('width');

    // добавляем обработчик события onblur для поля "height"
    heightInput.addEventListener('blur', function () {
        const heightValue = heightInput.value;

        // проверяем, заполнено ли поле
        if (heightValue === '') {
            heightInput.classList.add('error-field');
            return;
        }

        // если поле заполнено, удаляем класс "error-field"
        heightInput.classList.remove('error-field');
    });

// добавляем обработчик для поля "width"
    widthInput.addEventListener('blur', function () {
        const widthValue = widthInput.value;

        // проверяем, заполнено ли поле
        if (widthValue === '') {
            widthInput.classList.add('error-field');
            return;
        }

        // если поле заполнено, удаляем класс "error-field"
        widthInput.classList.remove('error-field');
    });
});
// Подключаем Форму отправки на почту ( нужно уточнить, может будет лучше ХУКОМ)
$(document).ready(function () {
    $("feedback-form").submit(function () {
        // Получение ID формы
        var formID = $(this).attr('id');
        // Добавление решётки к имени ID
        var formNm = $('#' + formID);
        $.ajax({
            type: "POST",
            url: '/static/send.php',
            data: formNm.serialize(),
            beforeSend: function () {
                // Вывод текста в процессе отправки
                $(formNm).html('<p style="text-align:center">Отправка...</p>');
            },
            success: function (data) {
                // Вывод текста результата отправки
                $(formNm).html('<p style="text-align:center">' + data + '</p>');
            },
            error: function (jqXHR, text, error) {
                // Вывод текста ошибки отправки
                $(formNm).html(error);
            }
        });
        return false;
    });
});
//Отключаем незаполненные поля с самого начала
$(document).ready(() => {
    // Устанавливаем обработчики событий для select'ов
    $('#type').click(() => {
        // Сбрасываем значения следующих селектов
        $('#season').prop('selectedIndex', 0).prop('disabled', false);
        $('#manufacturer').prop('selectedIndex', 0).prop('disabled', true);
        $('#serie').prop('selectedIndex', 0).prop('disabled', true);
    });

    $('#season').click(() => {
        // Сбрасываем значения следующих селектов
        $('#manufacturer').prop('selectedIndex', 0).prop('disabled', false);
        $('#serie').prop('selectedIndex', 0).prop('disabled', true);
    });

    $('#manufacturer').click(() => {
        // Сбрасываем значения следующих селектов
        $('#serie').prop('selectedIndex', 0).prop('disabled', false);
    });
});



