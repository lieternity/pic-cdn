/**
 * 加载页面锁
 */
let lock1 = false;
let lock2 = false;
let lock3 = false;

/**
 * 网页加载
 */
window.onload = function () {
    lock1 = true;
    unlockPage();
}

/**
 * 加载页面解除
 * @returns
 */
function unlockPage() {
    // 是否解锁
    if (!lock1 || !lock2 || !lock3) {
        return;
    }
    // 获取加载页面
    let load = document.querySelector(".lovexhjLoading");
    load.style.animation = "unlock 1s ease-in-out forwards";
    setTimeout(() => {
        load.style.display = "none";
    }, 1000);
}

/**
 * Vue
 */
const lovexhj = new Vue({
    /**
     * 根
     */
    el: "#lovexhj",

    /**
     * 初始数据
     * @returns
     */
    data() {
        return {
            ServerBase: "https://service-np8jl8as-1258640085.hk.apigw.tencentcs.com/release", // 后端地址
            localConfig: null, // 本地配置
            jsonConfig: null, // Json 配置
            wdnmdData: null, // 记仇数据
            wdnmdIndex: 0, // 当前选择的记仇
            wdnmdGo: true, // 是否在首页
            title: "", // 记仇标题
            body: "", // 记仇内容
            wdnmdLoading: false, // 记仇转圈圈
            pswForm: false, // 密码框
            password: "", // 密码
            loadMore: false, // 加载更多锁
            sexSelect: "", // 选择的身份
        }
    },

    /**
     * 数据渲染完毕
     */
    mounted() {
        // 本地配置获取
        this.getLocalConfig();
        // Json 配置获取
        this.getJsonConfig();
    },

    /**
     * 方法
     */
    methods: {
        /**
         * 本地配置获取
         */
        getLocalConfig() {
            // 获取配置，没有则初始化
            this.localConfig = JSON.parse(window.localStorage.getItem("lovexhj"));
            if (!this.localConfig) {
                window.localStorage.setItem("lovexhj", JSON.stringify({
                    "theme": "light"
                }));
                this.localConfig = JSON.parse(window.localStorage.getItem("lovexhj"));
            }
            lock2 = true;
            unlockPage();
            // 调试
            // console.log(this.localConfig);
            // 主题加载
            this.loadTheme();
        },

        /**
         * Json 配置获取
         */
        getJsonConfig() {
            let json = "https://cdn.staticaly.com/gh/acodegod/pic-cdn/main/2021/jichou/config/config.json";
            let request = new XMLHttpRequest();
            request.open("get", json);
            request.send(null);
            request.onload = () => {
                if (request.status == 200) {
                    this.jsonConfig = JSON.parse(request.responseText);
                    // 调试
                    // console.log(this.jsonConfig);

                    // 同步处理
                    setTimeout(() => {
                        lock3 = true;
                        unlockPage();
                        // 记仇获取
                        this.getWdnmd();
                        // 富文本编辑器创建
                        this.createEditor();
                        // 每次加载数量存储
                        this.pageLoadNum = this.jsonConfig.lovexhj.pageloadNum[1];
                    }, 0);
                }
            }
        },

        /**
         * 主题设置
         */
        loadTheme() {
            // 颜色配置
            let themeConfig = {
                "white": [
                    // 背景颜色
                    ["--bg-color", "rgb(241, 242, 246)"],
                    // 框架颜色
                    ["--box-color", "white"],
                    // 字体颜色
                    ["--font-color", "black"],
                    // 加载转圈圈
                    ["--load", "rgba(211, 211, 211, 0.6)"],
                ],
                "dark": [
                    // 背景颜色
                    ["--bg-color", "rgb(33, 37, 43)"],
                    // 框架颜色
                    ["--box-color", "rgb(40, 44, 52)"],
                    // 字体颜色
                    ["--font-color", "white"],
                    // 加载转圈圈
                    ["--load", "rgba(0, 0, 0, 0.6)"],
                ]
            };

            // 主题切换
            let result = [];
            if (this.localConfig.theme == "light") {
                result = themeConfig.white;
            } else {
                result = themeConfig.dark;
            }

            result.forEach(item => {
                document.documentElement.style.setProperty(item[0], item[1]);
            });
        },

        /**
         * 切换主题
         */
        checkTheme() {
            // 主题修改
            if (this.localConfig.theme == "light") {
                this.localConfig.theme = "dark";
            } else {
                this.localConfig.theme = "light";
            }
            // 存储配置
            this.saveLocalConfig();
            // 刷新主题
            this.loadTheme();
        },

        /**
         * 本地配置存储
         */
        saveLocalConfig() {
            window.localStorage.setItem("lovexhj", JSON.stringify(this.localConfig));
        },

        /**
         * 封面打开
         * @returns
         */
        fmOpen() {
            // 里面是否已经关闭
            let list = this.$refs.lovexhjBookList;
            if (list.className.includes("lovexhjBookActive")) {
                list.classList.remove("lovexhjBookActive");
                return this.$refs.lovexhjBookListBg.classList.remove("lovexhjBookActive", "lovexhjBookListBgActive");
            }

            let fm = this.$refs.lovexhjBookFm;
            if (fm.className.includes("lovexhjBookActive")) {
                return fm.classList.remove("lovexhjBookActive");
            }
            fm.classList.add("lovexhjBookActive");
        },

        /**
         * 记仇获取
         * @param {*} add 是否继续加载
         */
        getWdnmd(add) {
            axios.get(`${this.ServerBase}/get?page=${this.jsonConfig.lovexhj.pageloadNum[0]}&per_page=${this.jsonConfig.lovexhj.pageloadNum[1]}`).then(res => {
                // 错误检测
                if (res.data.error) {
                    return console.log(res.data.error);
                }
                // 数据是否存在
                if (res.data.data.length == 0) {
                    return;
                }
                let resData = res.data.data;

                // 调试
                // console.log(res.data.data);
                // console.log(this.wdnmdData);

                // 日期处理，标题与作者分割处理
                for (let i = 0; i < resData.length; i++) {
                    resData[i].created_at = new Date(resData[i].created_at).toLocaleDateString();
                    let title = [];
                    title.push(resData[i].title.substring(1, resData[i].title.indexOf("]")));
                    title.push(resData[i].title.substring(resData[i].title.indexOf("]") + 1, resData[i].title.length));
                    resData[i].title = title;
                }

                // 如果是继续加载则合并原来数据
                if (add) {
                    this.wdnmdData = this.wdnmdData.concat(resData);
                } else {
                    this.wdnmdData = resData;
                }

                // 是否为最后的数据
                if (resData.length < this.jsonConfig.lovexhj.pageloadNum[1]) {
                    this.loadMore = true;
                }
            }, err => {
                console.log(err);
            });
        },

        /**
         * 记仇选择
         * @param {*} i 记仇的索引
         */
        selectWdnmd(i) {
            setTimeout(() => {
                // 图片查看
                let Viewer = window.Viewer;
                let img = document.querySelectorAll(".lovexhjBookListContext img");
                img.forEach(item => {
                    new Viewer(item);
                });
            }, 0);
            this.wdnmdIndex = i;
            this.ListOpen();
        },

        /**
         * 目录翻页
         * @returns
         */
        ListOpen() {
            let list = this.$refs.lovexhjBookList;
            if (list.className.includes("lovexhjBookActive")) {
                list.classList.remove("lovexhjBookActive");
                return this.$refs.lovexhjBookListBg.classList.remove("lovexhjBookActive", "lovexhjBookListBgActive");
            }
            list.classList.add("lovexhjBookActive");
            this.$refs.lovexhjBookListBg.classList.add("lovexhjBookActive", "lovexhjBookListBgActive");
        },

        /**
         * 板块切换
         */
        move() {
            let dom = this.$refs.lovexhjBookMove;
            if (this.wdnmdGo) {
                dom.style.transform = "translateX(-50%)";
            } else {
                dom.style.transform = "translateX(0%)";
            }
            this.wdnmdGo = !this.wdnmdGo;
        },

        /**
         * 富文本编辑器创建
         */
        createEditor() {
            let E = window.wangEditor;
            let ed = new E("#ed");
            //  菜单配置
            ed.config.menus = [
                "head",
                "bold",
                // "fontSize",
                // "fontName",
                "italic",
                "underline",
                "strikeThrough",
                // "indent",
                // "lineHeight",
                // "foreColor",
                //" backColor",
                "link",
                "list",
                // "todo",
                "justify",
                "quote",
                "emoticon",
                "image",
                "video",
                "table",
                // "code",
                "splitLine",
                "undo",
                "redo",
            ];
            // 关闭粘贴样式
            ed.config.pasteFilterStyle = false;
            // 代码高亮
            ed.highlight = this.hljs;
            // 提示文本
            ed.config.placeholder = this.jsonConfig.lovexhj.editText;
            // 配置 onchange 回调函数
            ed.config.onchange = (content) => {
                this.body = content;
            }
            // 高度设置
            ed.config.height = 150;

            // 创建
            ed.create();

            // 默认样式修改
            let toolbar = document.querySelector(".w-e-toolbar");
            let container = document.querySelector(".w-e-text-container");
            toolbar.style.background = "transparent";
            toolbar.style.borderWidth = "0";
            // toolbar.style.zIndex = "1000";
            container.style.background = "transparent";
            container.style.border = "transparent";
            // container.style.zIndex = "1000";
        },
        /**
         * 记个仇
         * @returns
         */
        wdnmdSubmit() {
            // 密码认证
            if (!this.password) {
                return this.pswForm = true;
            }
            this.wdnmdLoading = true;
            // 数据验证
            if (!this.title || !this.body || !this.sexSelect) {
                this.wdnmdLoading = false;
                return this.$message({
                    message: "记仇也需要认真填写哦！",
                    showClose: true,
                    type: "warning"
                });
            }
            axios.post(this.ServerBase + "/add", {
                title: `[${this.sexSelect}]${this.title}`,
                body: this.body,
                password: this.password
            }).then(res => {
                this.wdnmdLoading = false;
                if (res.data.error) {
                    this.password = "";
                    return this.$message({
                        message: res.data.error,
                        showClose: true,
                        type: "warning"
                    });
                }
                if (res.data.data == "ok") {
                    this.$message({
                        message: this.jsonConfig.lovexhj.wdnmdOk,
                        showClose: true,
                        type: "success"
                    });
                    // 刷新
                    this.getWdnmd();
                }
            }, err => {
                console.log(err);
            });
        },

        /**
         * 设置密码
         * @param {*} a 是否取消设置密码
         */
        setPsw(a) {
            this.pswForm = false;
            if (a && this.password) {
                this.wdnmdSubmit();
            }
        },

        /**
         * 懒加载目录
         */
        lazyLoadList() {
            this.jsonConfig.lovexhj.pageloadNum[0]++;
            this.getWdnmd(true);
        }
    },
})
