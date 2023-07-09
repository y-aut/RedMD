$(function () {
    function territory(obj) {
        const tagName = obj.get(0).tagName;
        if (tagName[0] != 'H') {
            return obj.find().add(obj);
        }
        // より上位の見出しまで
        const tags = [];
        for (let i = 1; i <= Number(tagName[1]); i++) {
            tags.push("H" + i);
        }
        const next = obj.nextAll(tags.join(","));
        if (next.length == 0) {
            return obj.nextAll().add(obj);
        } else {
            return obj.nextUntil(next.eq(0)).add(obj);
        }
    }

    function redChanged() {
        $(".changeAll").each(function (i, elem) {
            if (territory($(elem).parent()).find("[shown='false']").length) {
                $(elem).attr("mode", "true");
            } else {
                $(elem).attr("mode", "false");
            }
        });
    }

    function setRed(obj, value) {
        obj.attr("shown", value);
        redChanged();
    }

    function setRedAll(obj, value) {
        const target = obj.find(".red").add(obj.filter(".red"));
        target.attr("shown", value);
        redChanged();
    }

    function load(content) {
        $("body").html(content);
        $("code").replaceWith(function () {
            const text = $(this).text();
            $(this).replaceWith('<span class="red" shown="false">' + text + '</span>');
        });
        $(".red").click(function () {
            setRed($(this), $(this).attr("shown") == "true" ? "false" : "true");
        });

        $("h1,h2,h3,li").each(function (i, elem) {
            const target = territory($(this)).find(".red");
            if (target.length) {
                $(this).prepend('<div class="changeAll" mode="true"></div>');
            }
        });
        $(".changeAll").click(function () {
            const target = territory($(this).parent());
            setRedAll(target, $(this).attr("mode"));
        });
    }

    $("#file").change(function () {
        if (!this.files) return;
        const [file] = this.files;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            load(reader.result);
        }, false);
        reader.readAsText(file);
    });
});
