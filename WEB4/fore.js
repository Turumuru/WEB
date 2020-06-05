function fore() {
    const x = document.form2.x.value;
    let s = 1;
    let i = 1;
    if (x < 1) {
        while ((Math.pow(x, i)) / (F(i)) >= 0.0003) {
            s = s + (Math.pow(x, i)) / (F(i));
            i++;
        }
        document.form2.s.value = s;
    } else {
        document.form2.s.value = 'Ошибка: x>1';
    }
}

function F(x) {
    if (x === 0)
        return 1;
    else
        return x * F(x - 1);
}