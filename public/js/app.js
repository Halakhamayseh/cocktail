$('#putF').hide()
$('#putBc').hide()
$('#putBs').on('click', callback)
function callback() {
    $('#putF').toggle()
    $('#putBc').toggle()
}

$('#putBc').on('click', callbacktow)
function callbacktow() {
    $('#putF').hide()
    $('#putBc').hide()
}