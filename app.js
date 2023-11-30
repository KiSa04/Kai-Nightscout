document.addEventListener("DOMContentLoaded", (function() {

    const t = {
        center: function() {
            n = `${document.getElementById("nightscoutURL").value}/api/v1/entries`, r();
            const t = `${document.getElementById("nightscoutURL").value}/api/v1/entries`;
            t ? s().then((e => {
                const o = e.transaction(["config"], "readwrite");
                o.objectStore("config").put(t, "nightscoutURL"), o.oncomplete = function() {
                    const t = document.getElementById("config-container");
                    t.style.visibility = "hidden", t.style.display = "none";
                }
            })).catch((t => {
                console.error("Erro ao abrir o banco de dados:", t)
            })) : alert("Por favor, insira um URL válido."), console.log(n)
        }
    };
    let e, o, n;

    function i(t, o, n) {
        const i = {
            body: `Glicose: ${t} [${o}${n}]`,
            silent: new Boolean(!1)
        };
        1 == e && new Notification("Atualização de Glicose", i)
    }

    function c() {
        const e = document.getElementById("config-container");
        e.style.display = "block", e.style.visibility = "visible", console.log("??:197"), document.getElementById("nightscoutURL").focus(), document.addEventListener("keydown", (function(e) {
            switch (e.key) {
                case "Enter":
                    t.center();
                    break;
                case "left":
                    t.left()
            }
        }))
    }

    function s() {
        return new Promise(((t, e) => {
            const o = indexedDB.open("MyDatabase", 2);
            o.onupgradeneeded = function(t) {
                t.target.result.createObjectStore("config")
            }, o.onsuccess = function(e) {
                const o = e.target.result;
                t(o)
            }, o.onerror = function(t) {
                e(t.target.error)
            }
        }))
    }

    function r() {
        let t;
        try {
            fetch(n).then((t => {
                if (!t.ok) throw new Error(`Erro na solicitação: ${t.status}`);
                return t.text()
            })).then((o => {
                try {
                     
                    const n = o.split("\n"),
                        c = n[0].split("\t"),
                        s = n[9].split("\t"),
                        r = parseFloat(c[2]);
                    let a, l;
                    t = parseFloat(s[2]), void 0 === t && (t = r), r >= 160 || r <= 75 ? (e = 1, console.log(r)) : e = 0, r < t ? (l = "-", a = t - r) : r > t ? (l = "+", a = r - t) : (a = 0, l = ""), document.getElementById("glucoseValue").textContent = `${r}mg/dL [${l}${a}.0]`,
                        function(t, e, o) {
                            "Notification" in window ? "granted" !== Notification.permission ? Notification.requestPermission().then((n => {
                                "granted" === n ? (Notification.prototype.silent = !0, i(t, e, o)) : console.warn("Permissão para notificações negada.")
                            })) : (Notification.prototype.silent = !0, i(t, e, o)) : console.warn("Este navegador não suporta notificações.")
                        }(r, l, a)
                } catch (t) {
                    console.error("Erro ao processar dados:", t), document.getElementById("glucoseValue").textContent = "Erro ao processar dados"
                }
            })).catch((t => {
                console.error("Erro ao buscar dados da API Nightscout:", t), c()
            }))
        } catch (t) {}
    }
    s().then((t => {
        t.transaction(["config"], "readonly").objectStore("config").get("nightscoutURL").onsuccess = function(t) {
            if (o = t.target.result, o && "https:///api/v1/entries" != o) {
                console.log(o), n = o;
                const t = document.getElementById("config-container");
                t.style.visibility = "hidden", t.style.display = "none"
              
            } else c();
            r()
        }
    })), setInterval(r, 6e4)
}));