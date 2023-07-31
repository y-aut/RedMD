$(function () {
    function fileChanged() {
        const files = $("#file").get(0).files;
        if (!files) return;
        if (files.length > 1) return alert("複数のファイルをアップロードすることはできません。");
        const [file] = files;
        if (!file.name.endsWith(".html")) return alert("HTML ファイル以外をアップロードすることはできません。");
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            sessionStorage.setItem("title", file.name);
            sessionStorage.setItem("content", reader.result);
            sessionStorage.removeItem("shown");
            location.href = "show.html";
        }, false);
        reader.readAsText(file);
    }

    $(".file-select > button").click(function () {
        $(this).siblings('input[type="file"]').click();
    });
    $("#file").change(function () {
        fileChanged();
    });

    const da = $(".drop-area").get(0);

    da.addEventListener("dragover", function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.style.background = "#e1e7f0";
    }, false);

    da.addEventListener("dragleave", function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.style.background = "#ffffff";
    }, false);

    da.addEventListener("drop", function (e) {
        e.stopPropagation();
        e.preventDefault();
        const files = e.dataTransfer.files;
        $("#file").get(0).files = files;
        fileChanged();
    }, false);
});
