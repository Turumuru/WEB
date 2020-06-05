let random = document.querySelector('.random');
let change = document.querySelector('.change');
let arr = [];


random.onclick = function () {
    for (let i = 0; i < 7; i++) {
        arr[i] = [];
        for (let j = 0; j < 9; j++) {
            arr[i][j] = Math.round(Math.random() * 100);
        }
    }
    let html = '<table>';
    for (let i = 0; i < 7; i++) {
        html += '<tr>';
        for (let j = 0; j < 9; j++) {
            html += '<td height="10%">' + arr[i][j] + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('table').innerHTML = html;
}

change.onclick = function () {
    let max = 0;
    let x = 0;
    let y = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            if(max < arr[i][j]) {
                max = arr[i][j];
                x = i;
                y = j;
            }
        }
    }
    let tmp = arr[0][0];
    arr[0][0] = max;
    arr[x][y] = tmp;
    let html = '<table>';
    for (let i = 0; i < 7; i++) {
        html += '<tr>';
        for (let j = 0; j < 9; j++) {
            html += '<td height="10%">' + arr[i][j] + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('table').innerHTML = html;
}