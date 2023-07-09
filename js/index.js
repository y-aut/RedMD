$(function () {
    $("#file").change(function () {
        if (!this.files) return;
        const [file] = this.files;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            sessionStorage.setItem("content", reader.result);
            sessionStorage.removeItem("shown");
            location.href = "show.html";
        }, false);
        reader.readAsText(file);
    });
});
