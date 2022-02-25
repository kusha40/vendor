
$(".mb-confirm").on("click", function (e) {
    e.preventDefault();
    var box = $($(this).data("box"));
    if (box.length > 0) {
        box.toggleClass("open");
        //alert(id);
        var sound = box.data("sound");

        if (sound === 'alert')
            playAudio('alert');

        if (sound === 'fail')
            playAudio('fail');
        var clkHref = $(this).attr('href');
        $("#delrecord").attr("href", clkHref);
    }
    return false;
});

$(".mb-up").on("click", function (e) {
    e.preventDefault();
    var box = $($(this).data("box"));
    if (box.length > 0) {
        box.toggleClass("open");
        //alert(id);
        var sound = box.data("sound");

        if (sound === 'alert')
            playAudio('alert');

        if (sound === 'fail')
            playAudio('fail');
        var clkHref = $(this).attr('href');
        $("#stepup").attr("href", clkHref);
    }
    return false;
});

$(".mb-down").on("click", function (e) {
    e.preventDefault();
    var box = $($(this).data("box"));
    if (box.length > 0) {
        box.toggleClass("open");
        //alert(id);
        var sound = box.data("sound");

        if (sound === 'alert')
            playAudio('alert');

        if (sound === 'fail')
            playAudio('fail');
        var clkHref = $(this).attr('href');
        $("#stepdown").attr("href", clkHref);
    }
    return false;
});

$(".mb-confirm-close").on("click", function () {
    $(this).parents(".message-box").removeClass("open");
    return false;
});

/* MESSAGE BOX */
$(".mb-control").on("click", function () {
    var box = $($(this).data("box"));
    if (box.length > 0) {
        box.toggleClass("open");

        var sound = box.data("sound");

        if (sound === 'alert')
            playAudio('alert');

        if (sound === 'fail')
            playAudio('fail');

    }
    return false;
});
$(".mb-control-close").on("click", function () {
    $(this).parents(".message-box").removeClass("open");
    return false;
});
/* END MESSAGE BOX */

/* PLAY SOUND FUNCTION */
function playAudio(file) {
    if (file === 'alert')
        document.getElementById('audio-alert').play();

    if (file === 'fail')
        document.getElementById('audio-fail').play();
}
/* END PLAY SOUND FUNCTION */
