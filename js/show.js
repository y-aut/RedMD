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

    function bitsToString(bits) {
        // 16 ビットごとに char に変換
        let ans = "";
        let code = 0;
        let size = 0;
        for (let i = 0; i < bits.length; i++) {
            code |= bits[i] << size;
            if (++size == 16) {
                size = 0;
                ans += String.fromCharCode(code);
                code = 0;
            }
        }
        if (size != 0) {
            ans += String.fromCharCode(code);
        }
        return ans;
    }

    function stringToBits(str) {
        let ans = [];
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            for (let j = 0, mask = 1; j < 16; j++, mask <<= 1) {
                ans.push(code & mask ? 1 : 0);
            }
        }
        return ans;
    }

    function saveData() {
        let bits = [];
        $(".red").each(function (i, elem) {
            if ($(elem).attr("shown") == "true") {
                bits.push(1);
            } else {
                bits.push(0);
            }
        });
        sessionStorage.setItem("shown", bitsToString(bits));
    }

    function loadData() {
        const str = sessionStorage.getItem("shown");
        if (str) {
            const bits = stringToBits(str);
            $(".red").each(function (i, elem) {
                if (bits[i] == 1) {
                    $(elem).attr("shown", "true");
                } else {
                    $(elem).attr("shown", "false");
                }
            });
        }
        redChanged(false);
    }

    function setProgress() {
        const red = $(".red").length;
        const done = $(".red[shown='true']").length;
        const progress = red == 0 ? 0 : (done / red * 100);
        $(".progress").text(Math.floor(progress) + " %");
        $(".progress-bar").css("--progress", progress + "%");
    }

    function redChanged(save = true) {
        $(".changeAll").each(function (i, elem) {
            if (territory($(elem).parent()).find("[shown='false']").length) {
                $(elem).attr("mode", "true");
            } else {
                $(elem).attr("mode", "false");
            }
        });
        setProgress();
        if (save) saveData();
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

    function loadContent() {
        $("#content").html(sessionStorage.getItem("content"));
        $("code").replaceWith(function () {
            const text = $(this).text();
            $(this).replaceWith('<span class="red" shown="false">' + text + '</span>');
        });
        $(".red").click(function () {
            setRed($(this), $(this).attr("shown") == "true" ? "false" : "true");
        });
        $("h1,h2,h3,li").each(function (i, elem) {
            const target = territory($(elem)).find(".red");
            if (target.length) {
                $(elem).prepend('<div class="changeAll" mode="true"></div>');
            }
        });
        $(".changeAll").click(function () {
            const target = territory($(this).parent());
            setRedAll(target, $(this).attr("mode"));
        });
        loadData();
    }

    $("#file-input").click(function (e) {
        e.target.value = "";
    })
    $("#file-input").change(function () {
        if (!this.files) return;
        const [file] = this.files;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            sessionStorage.setItem("content", reader.result);
            sessionStorage.removeItem("shown");
            loadContent();
        }, false);
        reader.readAsText(file);
    })

    loadContent();
});