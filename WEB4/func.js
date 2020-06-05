"use spict"


let min = document.querySelector('.min');
let max = document.querySelector('.max');
let create = document.querySelector('.create');
let n = document.querySelector('.n');
let sort = document.querySelector('.sort');
let array = [];

create.onclick = function () {
    let miN = +min.value;
    let maX = +max.value;
    let num = +n.value;

    function getRandomInt(miN, maX) {
        return Math.floor(Math.random() * (maX - miN)) + miN;
    }

    function getArray(num) {
        let arr = []
        for (let i = 0; i < num; i++) {
            arr[i] = [];
            for (let j = 0; j < num; j++) {
                arr[i][j] = getRandomInt(miN, maX);
            }
        }
        return arr;
    }

    let html = '<table>';
    let arr = [];
    arr = getArray(num);
    for (let i = 0; i < num; i++) {
        html += '<tr>';
        for (let j = 0; j < num; j++) {
            html += '<td height="10%">' + arr[i][j] + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('mass').innerHTML = html;
    array = arr.slice();
}

sort.onclick = function () {
    function compareNumeric(a, b) {
        return (b - a);
    }

    function getResultArray(a) {
        return a.sort(compareNumeric);
    }

    let num = +n.value;
    let arr1 = [];

    array = array.flat();
    getResultArray(array);

    for (let j = 0; j < num * num; j += num) {
        arr1.push(array.slice(j, j + num));
    }
    array = [];
    for (let j = 0; j < num; j++) {
        array[j] = arr1[num - 1 - j];
        if ((num - 1) % 2 === 0) {
            if (j % 2 === 0){
                array[j].reverse();
            }
        } else {
            if (j % 2 === 1) {
                array[j].reverse();
            }
        }
    }
    let htmlsort = '<table>';
    for (let j = 0; j < num; j++) {
        htmlsort += '<tr>';
        for (let i = 0; i < num; i++) {
            htmlsort += '<td height="10%">' + array[i][j] + '</td>';
        }
        htmlsort += '</tr>';
    }
    htmlsort += '</table>';
    document.getElementById('sortmass').innerHTML = htmlsort;
}