function newdatapro(keyjson, numjson) {
    //数据预处理去重排序

    $("#mannn").empty(); //清空画布

    let result = {};
    for (let keyname in keyjson) {
        let arr1 = keyjson[keyname];
        let keyarr = [];

        //keyarr去重
        for (let i = 0; i < arr1.length; i++) {
            if (keyarr.indexOf(arr1[i]) === -1) {
                keyarr.push(arr1[i]);
            }
        }

        //keyarr排序
        function sortNumber(a, b) {
            return a - b;
        }
        keyarr.sort(sortNumber);
        result[keyname] = keyarr;

        let m = {};
        for (let x = 0; x < keyarr.length; x++) {
            let array = [];
            for (let i = 0; i < numn; i++) {
                array[i] = 0;
            }
            m[keyarr[x]] = array; //m为当前维度当前key值对应的度量数组
        }

        let numcount = 0; //记录当前为第几个度量属性
        for (let numname in numjson) {
            let arr2 = numjson[numname];
            let tempnum = [];
            for (let i = 0; i < arr1.length; i++) {
                for (let x = 0; x < keyarr.length; x++) {
                    if (arr1[i] === keyarr[x]) {
                        m[keyarr[x]][numcount] = m[keyarr[x]][numcount] + parseFloat(arr2[i]);
                    }
                }
            }
            for (let x = 0; x < keyarr.length; x++) {
                tempnum.push(m[keyarr[x]][numcount]);
            }
            result[keyname + numname] = tempnum;
            numcount = numcount + 1;
        }
    }

    return result;
}

function toolenlarge(e) {
    if (document.getElementById("EnlargedDialog").style.display != "block") {
        let thisInstance = e.scheduler.ecInstance;
        let thisOption = thisInstance.getOption();
        let str = "<div id='mydrawEnlarged' style='width: 1200px;height: 800px;margin: 0 auto;'></div>";
        $("#EnlargedDialog").append(str);
        var NewChart = echarts.init(document.getElementById("mydrawEnlarged"));
        NewChart.setOption(thisOption);
        document.getElementById("EnlargedDialog").style.display = "block";
    }
}

function toolpalette(e) {
    /*
    if (document.getElementById('PaletteDialog').style.display != 'block') {
        selectedInstance = e.scheduler.ecInstance;
        selectedInstanceType = 'normal';
        paletteColors = [];
        let tmpcolor = selectedInstance.getOption().color;
        let tmplegenddata = selectedInstance.getOption().legend[0].data;
        for (let i = 0; i < tmplegenddata.length; i++) {
            paletteColors.push(tmpcolor[i % (tmpcolor.length)]);
            var str = tmplegenddata[i] + '：<canvas id=\'myCanvas' + i + '\' width=\'200\' height=\'20\'></canvas><br/>';
            $('#palette').append(str);
            var c = document.getElementById('myCanvas' + i);
            c.onclick = (e) => {
                clickedCanvasId = parseInt(e.target.id.replace('myCanvas', ''));
                document.getElementById('favcolor').value = paletteColors[clickedCanvasId];
                $('#favcolor').click();
            }
            var ctx = c.getContext('2d');
            ctx.fillStyle = paletteColors[i];
            ctx.fillRect(0, 0, 200, 20);
        }
        document.getElementById('PaletteDialog').style.display = 'block';
    }
    */
    layer.open({
        type: 1,
        title: "调整配色",
        content:
            "<div id='PaletteDialog' style='padding: 20px 20px;'>" +
            "<div id='palette' style='height: auto;margin: 0 auto;text-align: center;'></div>" +
            "<div style='text-align: right; cursor: default; height: 25px;'>" +
            "<input type='color' id='favcolor' value='#000000'>" +
            "<div style='width: 16px; height: 25px; display: inline-block'></div>" +
            "<a style='font-size: 16px;' href='javascript:applycolor();'>应用</a>" +
            "<div style='width: 16px; height: 25px; display: inline-block'></div>" +
            "<a style='font-size: 16px;' href='javascript:closePaletteDialog();'>取消</a>" +
            "</div>" +
            "</div>",
        id: "PaletteDialog",
        closeBtn: 0,
        shade: 0,
        success: function() {
            selectedInstance = e.scheduler.ecInstance;
            selectedInstanceType = "normal";
            paletteColors = [];
            let tmpcolor = selectedInstance.getOption().color;
            let tmplegenddata = selectedInstance.getOption().legend[0].data;
            for (let i = 0; i < tmplegenddata.length; i++) {
                paletteColors.push(tmpcolor[i % tmpcolor.length]);
                var str = tmplegenddata[i] + "：<canvas id='myCanvas" + i + "' width='200' height='20'></canvas><br/>";
                $("#palette").append(str);
                var c = document.getElementById("myCanvas" + i);
                c.onclick = e => {
                    clickedCanvasId = parseInt(e.target.id.replace("myCanvas", ""));
                    document.getElementById("favcolor").value = paletteColors[clickedCanvasId];
                    $("#favcolor").click();
                };
                var ctx = c.getContext("2d");
                ctx.fillStyle = paletteColors[i];
                ctx.fillRect(0, 0, 200, 20);
            }
        }
    });

    $("#favcolor").change(() => {
        if (clickedCanvasId > -1 && clickedCanvasId < paletteColors.length) {
            var ctx = document.getElementById("myCanvas" + clickedCanvasId).getContext("2d");
            ctx.fillStyle = favcolor.value;
            ctx.fillRect(0, 0, 200, 20);
            paletteColors[clickedCanvasId] = favcolor.value;
        }
    });
}

function newline(keyjson, numjson, keyn, numn) {
    //折线图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var seriesdata = [];
        var legenddata = [];
        for (let numname in numjson) {
            seriesdata.push({
                name: numname.replace("#V", ""),
                type: "line",
                stack: "总量",
                data: result[keyname + numname]
            });
            legenddata.push(numname.replace("#V", ""));
        }

        var option = {
            legend: {
                type: "scroll",
                right: "25%",
                data: legenddata
            },
            tooltip: {
                trigger: "item",
                axisPointer: {
                    type: "shadow"
                }
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            color: colors,
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    type: "inside",
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            grid: {
                left: "1%",
                right: "10%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [
                {
                    type: "category",
                    name: keyname,
                    nameGap: 5,
                    nameTextStyle: {
                        color: "#000000",
                        fontSize: 12,
                        padding: 10
                    },
                    boundaryGap: false,
                    data: result[keyname]
                }
            ],
            yAxis: [
                {
                    type: "value"
                }
            ],
            series: seriesdata
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newstepline(keyjson, numjson, keyn, numn) {
    //步线图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var seriesdata = [];
        var legenddata = [];
        for (let numname in numjson) {
            seriesdata.push({
                name: numname.replace("#V", ""),
                type: "line",
                stack: "总量",
                step: "middle",
                data: result[keyname + numname]
            });
            legenddata.push(numname.replace("#V", ""));
        }

        var option = {
            legend: {
                type: "scroll",
                right: "25%",
                data: legenddata
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            tooltip: {
                trigger: "item",
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color: colors,
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    type: "inside",
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            grid: {
                left: "1%",
                right: "10%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [
                {
                    type: "category",
                    name: keyname,
                    nameGap: 5,
                    nameTextStyle: {
                        color: "#000000",
                        fontSize: 12,
                        padding: 10
                    },
                    boundaryGap: false,
                    data: result[keyname]
                }
            ],
            yAxis: [
                {
                    type: "value"
                }
            ],
            series: seriesdata
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newparallel(keyjson, numjson, keyn, numn) {
    //平行坐标图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var axisesdata = [];
        var seriesdata = [];

        var axisdim = 0;
        for (let numname in numjson) {
            axisesdata.push({
                dim: axisdim,
                name: numname.replace("#V", "")
            });
            axisdim++;
        }

        for (let i = 0; i < result[keyname].length; i++) {
            let data = [];
            for (let numname in numjson) {
                data.push(result[keyname + numname][i]);
            }
            seriesdata.push({
                name: result[keyname][i],
                type: "parallel",
                data: [data],
                lineStyle: {
                    width: 2
                }
            });
        }

        var option = {
            legend: {
                type: "scroll",
                orient: "vertical",
                left: "0%",
                data: result[keyname]
            },
            color: colors,
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            parallelAxis: axisesdata,
            parallel: {
                left: "15%", // 平行坐标系的位置设置
                right: "13%",
                bottom: "10%",
                top: "20%",
                parallelAxisDefault: {
                    // 『坐标轴』的公有属性可以配置在这里避免重复书写
                    type: "value",
                    nameLocation: "end",
                    nameGap: 20
                }
            },
            series: seriesdata
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newrainfall(keyjson, numjson, keyn, numn) {
    //度量关系图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var xdata = result[keyname];
        var ydata = [];
        var yname = [];
        for (let numname in numjson) {
            ydata.push(result[keyname + numname]);
            yname.push(numname.replace("#V", ""));
        }

        var option = {
            grid: {
                bottom: 80
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    animation: false,
                    label: {
                        backgroundColor: "#505765"
                    }
                }
            },
            legend: {
                type: "scroll",
                data: [yname[0], yname[1]],
                x: "left"
            },
            color: colors,
            dataZoom: [
                {
                    show: true,
                    type: "inside",
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    type: "slider",
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    data: xdata
                }
            ],
            yAxis: [
                {
                    name: yname[0],
                    type: "value"
                },
                {
                    name: yname[1],
                    nameLocation: "start",
                    type: "value",
                    inverse: true
                }
            ],
            series: [
                {
                    name: yname[0],
                    type: "line",
                    yAxisIndex: 0,
                    animation: false,
                    areaStyle: {
                        color: "rgba(255, 158, 68, 0.3)"
                    },
                    lineStyle: {
                        width: 1
                    },
                    data: ydata[0]
                },
                {
                    name: yname[1],
                    type: "line",
                    yAxisIndex: 1,
                    animation: false,
                    areaStyle: {
                        color: "rgba(102, 255, 102, 0.3)"
                    },
                    lineStyle: {
                        width: 1
                    },
                    data: ydata[1]
                }
            ]
        };

        str = "<div class='echartsdom' style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newradar(keyjson, numjson, keyn, numn) {
    //雷达图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var legenddata = [];
        var seriesdata = [];
        var indicatordata = [];
        for (let i = 0; i < result[keyname].length; i++) {
            indicatordata.push({
                name: result[keyname][i]
            });
        }
        for (let numname in numjson) {
            legenddata.push(numname.replace("#V", ""));
            seriesdata.push({
                value: result[keyname + numname],
                name: numname.replace("#V", "")
            });
        }

        var option = {
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            tooltip: {},
            color: colors,
            legend: {
                type: "scroll",
                orient: "vertical",
                x: "left",
                top: "10%",
                data: legenddata
            },
            radar: {
                name: {
                    textStyle: {
                        color: "#000000",
                        backgroundColor: "#ffffff",
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: indicatordata
            },
            series: [
                {
                    type: "radar",
                    data: seriesdata
                }
            ]
        };

        str = "<div class='echartsdom' style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newscatter(keyjson, numjson, keyn, numn) {
    //散点图

    var result = newdatapro(keyjson, numjson);

    var colors = ["#80f1be", "#ffffff", "#404a59"];
    var ii = 0;
    for (let keyname in keyjson) {
        var keys = [];
        for (let numname in numjson) {
            keys.push(numname);
        }
        keys.push(keyname);

        var seriesdata = [];
        for (let i = 0; i < result[keyname].length; i++) {
            var tmparr = [];
            for (let numname in numjson) {
                tmparr.push(result[keyname + numname][i]);
            }
            tmparr.push(result[keyname][i]);
            seriesdata.push(tmparr);
        }

        var visualdata = [];
        if (numn >= 3) {
            var tmpdata = result[keyname + keys[2]];
            var min = tmpdata[0];
            var max = tmpdata[0];
            for (var i = 0; i < tmpdata.length; i++) {
                if (tmpdata[i] > max) {
                    max = tmpdata[i];
                }
                if (tmpdata[i] < min) {
                    min = tmpdata[i];
                }
            }
            visualdata.push({
                left: "right",
                top: "10%",
                dimension: 2,
                min: min,
                max: max,
                itemWidth: 30,
                itemHeight: 120,
                calculable: true,
                precision: 0.1,
                text: ["圆形大小：" + keys[2].replace("#V", "")],
                textGap: 30,
                textStyle: {
                    color: colors[1]
                },
                inRange: {
                    symbolSize: [10, 70]
                },
                outOfRange: {
                    symbolSize: [10, 70],
                    color: ["rgba(255, 255, 255, 0.2)"]
                },
                controller: {
                    inRange: {
                        color: [colors[0]]
                    },
                    outOfRange: {
                        color: ["#444444"]
                    }
                }
            });
        }
        if (numn >= 4) {
            var tmpdata = result[keyname + keys[3]];
            var min = tmpdata[0];
            var max = tmpdata[0];
            for (var i = 0; i < tmpdata.length; i++) {
                if (tmpdata[i] > max) {
                    max = tmpdata[i];
                }
                if (tmpdata[i] < min) {
                    min = tmpdata[i];
                }
            }
            visualdata.push({
                left: "right",
                bottom: "5%",
                dimension: 3,
                min: min,
                max: max,
                itemHeight: 120,
                calculable: true,
                precision: 0.1,
                text: ["明暗：" + keys[3].replace("#V", "")],
                textGap: 30,
                textStyle: {
                    color: colors[1]
                },
                inRange: {
                    colorLightness: [1, 0.5]
                },
                outOfRange: {
                    color: ["rgba(255, 255, 255, 0.2)"]
                },
                controller: {
                    inRange: {
                        color: [colors[0]]
                    },
                    outOfRange: {
                        color: ["#444444"]
                    }
                }
            });
        }

        var option = {
            backgroundColor: colors[2],
            color: [colors[0]],
            grid: {
                x: "10%",
                x2: 150,
                y: "18%",
                y2: "10%"
            },
            legend: {
                y: "top",
                textStyle: {
                    color: colors[1],
                    fontSize: 16
                }
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: e => {
                            /*
                            if (
                                document.getElementById("PaletteDialog").style
                                    .display != "block"
                            ) {
                                selectedInstance = e.scheduler.ecInstance;
                                selectedInstanceType = "scatter";
                                let scatterColor = selectedInstance.getOption()
                                    .color[0];
                                let textColor = selectedInstance.getOption()
                                    .xAxis[0].nameTextStyle.color;
                                let backgroundColor = selectedInstance.getOption()
                                    .backgroundColor;
                                paletteColors = [
                                    scatterColor,
                                    textColor,
                                    backgroundColor
                                ];
                                let str =
                                    "圆点颜色：<canvas id='myCanvas0' width='200' height='20'></canvas><br/>" +
                                    "字体颜色：<canvas id='myCanvas1' width='200' height='20'></canvas><br/>" +
                                    "背景颜色：<canvas id='myCanvas2' width='200' height='20'></canvas><br/>";
                                $("#palette").append(str);
                                var c = document.getElementById("myCanvas0");
                                c.onclick = e => {
                                    clickedCanvasId = parseInt(
                                        e.target.id.replace("myCanvas", "")
                                    );
                                    document.getElementById("favcolor").value =
                                        paletteColors[clickedCanvasId];
                                    $("#favcolor").click();
                                };
                                var ctx = c.getContext("2d");
                                ctx.fillStyle = scatterColor;
                                ctx.fillRect(0, 0, 200, 20);
                                c = document.getElementById("myCanvas1");
                                c.onclick = e => {
                                    clickedCanvasId = parseInt(
                                        e.target.id.replace("myCanvas", "")
                                    );
                                    document.getElementById("favcolor").value =
                                        paletteColors[clickedCanvasId];
                                    $("#favcolor").click();
                                };
                                ctx = c.getContext("2d");
                                ctx.fillStyle = textColor;
                                ctx.fillRect(0, 0, 200, 20);
                                c = document.getElementById("myCanvas2");
                                c.onclick = e => {
                                    clickedCanvasId = parseInt(
                                        e.target.id.replace("myCanvas", "")
                                    );
                                    document.getElementById("favcolor").value =
                                        paletteColors[clickedCanvasId];
                                    $("#favcolor").click();
                                };
                                ctx = c.getContext("2d");
                                ctx.fillStyle = backgroundColor;
                                ctx.fillRect(0, 0, 200, 20);
                                document.getElementById(
                                    "PaletteDialog"
                                ).style.display = "block";
                            }
                            */
                            layer.open({
                                type: 1,
                                title: "调整配色",
                                content:
                                    "<div id='PaletteDialog' style='padding: 20px 20px;'>" +
                                    "<div id='palette' style='height: auto;margin: 0 auto;text-align: center;'></div>" +
                                    "<div style='text-align: right; cursor: default; height: 25px;'>" +
                                    "<input type='color' id='favcolor' value='#000000'>" +
                                    "<div style='width: 16px; height: 25px; display: inline-block'></div>" +
                                    "<a style='font-size: 16px;' href='javascript:applycolor();'>应用</a>" +
                                    "<div style='width: 16px; height: 25px; display: inline-block'></div>" +
                                    "<a style='font-size: 16px;' href='javascript:closePaletteDialog();'>取消</a>" +
                                    "</div>" +
                                    "</div>",
                                id: "PaletteDialog",
                                closeBtn: 0,
                                shade: 0,
                                success: function() {
                                    selectedInstance = e.scheduler.ecInstance;
                                    selectedInstanceType = "scatter";
                                    let scatterColor = selectedInstance.getOption().color[0];
                                    let textColor = selectedInstance.getOption().xAxis[0].nameTextStyle.color;
                                    let backgroundColor = selectedInstance.getOption().backgroundColor;
                                    paletteColors = [scatterColor, textColor, backgroundColor];
                                    let str =
                                        "圆点颜色：<canvas id='myCanvas0' width='200' height='20'></canvas><br/>" +
                                        "字体颜色：<canvas id='myCanvas1' width='200' height='20'></canvas><br/>" +
                                        "背景颜色：<canvas id='myCanvas2' width='200' height='20'></canvas><br/>";
                                    $("#palette").append(str);
                                    var c = document.getElementById("myCanvas0");
                                    c.onclick = e => {
                                        clickedCanvasId = parseInt(e.target.id.replace("myCanvas", ""));
                                        document.getElementById("favcolor").value = paletteColors[clickedCanvasId];
                                        $("#favcolor").click();
                                    };
                                    var ctx = c.getContext("2d");
                                    ctx.fillStyle = scatterColor;
                                    ctx.fillRect(0, 0, 200, 20);
                                    c = document.getElementById("myCanvas1");
                                    c.onclick = e => {
                                        clickedCanvasId = parseInt(e.target.id.replace("myCanvas", ""));
                                        document.getElementById("favcolor").value = paletteColors[clickedCanvasId];
                                        $("#favcolor").click();
                                    };
                                    ctx = c.getContext("2d");
                                    ctx.fillStyle = textColor;
                                    ctx.fillRect(0, 0, 200, 20);
                                    c = document.getElementById("myCanvas2");
                                    c.onclick = e => {
                                        clickedCanvasId = parseInt(e.target.id.replace("myCanvas", ""));
                                        document.getElementById("favcolor").value = paletteColors[clickedCanvasId];
                                        $("#favcolor").click();
                                    };
                                    ctx = c.getContext("2d");
                                    ctx.fillStyle = backgroundColor;
                                    ctx.fillRect(0, 0, 200, 20);
                                }
                            });

                            $("#favcolor").change(() => {
                                if (clickedCanvasId > -1 && clickedCanvasId < paletteColors.length) {
                                    var ctx = document.getElementById("myCanvas" + clickedCanvasId).getContext("2d");
                                    ctx.fillStyle = favcolor.value;
                                    ctx.fillRect(0, 0, 200, 20);
                                    paletteColors[clickedCanvasId] = favcolor.value;
                                }
                            });
                        }
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            tooltip: {
                padding: 10,
                backgroundColor: "#222222",
                borderColor: "#777777",
                borderWidth: 1,
                formatter: obj => {
                    var v = obj.value;
                    var d = obj.dimensionNames;
                    var tmpstr = "";
                    for (let i = 0; i < d.length; i++) {
                        tmpstr = tmpstr + d[i].replace("#V", "") + ": " + v[i] + "<br>";
                    }
                    return (
                        "<div style='border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px'>" +
                        "</div>" +
                        tmpstr
                    );
                }
            },
            xAxis: {
                type: "value",
                name: keys[0].replace("#V", ""),
                nameGap: 16,
                nameTextStyle: {
                    color: colors[1],
                    fontSize: 14
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: colors[1]
                    }
                }
            },
            yAxis: {
                type: "value",
                name: keys[1].replace("#V", ""),
                nameLocation: "end",
                nameGap: 20,
                nameTextStyle: {
                    color: colors[1],
                    fontSize: 14
                },
                axisLine: {
                    lineStyle: {
                        color: colors[1]
                    }
                },
                splitLine: {
                    show: false
                }
            },
            visualMap: visualdata,
            series: {
                name: keyname,
                type: "scatter",
                itemStyle: {
                    normal: {
                        opacity: 0.8,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                },
                dimensions: keys,
                data: seriesdata
            }
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newhistogram(keyjson, numjson, keyn, numn) {
    //柱形图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#000099",
        "#2121ff",
        "#7d7dff",
        "#028288",
        "#03c3cd",
        "#7ff7fd",
        "#02981f",
        "#03df2d",
        "#94fea8",
        "#c4ad04",
        "#fbe225",
        "#fef5b0",
        "#f34803",
        "#fd7f4d",
        "#fecdba"
    ];
    var ii = 0;
    for (var keyname in keyjson) {
        var legenddata = [];
        var seriesdata = [];
        for (var numname in numjson) {
            legenddata.push(numname.replace("#V", ""));
            seriesdata.push({
                name: numname.replace("#V", ""),
                type: "bar",
                data: result[keyname + numname],
                barGap: 0
            });
        }

        var option = {
            tooltip: {
                trigger: "item",
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                type: "scroll",
                right: "25%",
                data: legenddata
            },
            grid: {
                left: "3%",
                right: "10%",
                bottom: "3%",
                containLabel: true
            },
            color: colors,
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    type: "inside",
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: "category",
                    data: result[keyname],
                    name: keyname,
                    nameGap: 5,
                    nameTextStyle: {
                        color: "#000000",
                        fontSize: 12,
                        padding: 10
                    }
                }
            ],
            yAxis: [
                {
                    type: "value"
                }
            ],
            series: seriesdata
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newbar(keyjson, numjson, keyn, numn) {
    //条形图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#000099",
        "#2121ff",
        "#7d7dff",
        "#028288",
        "#03c3cd",
        "#7ff7fd",
        "#02981f",
        "#03df2d",
        "#94fea8",
        "#c4ad04",
        "#fbe225",
        "#fef5b0",
        "#f34803",
        "#fd7f4d",
        "#fecdba"
    ];
    var ii = 0;
    for (var keyname in keyjson) {
        var legenddata = [];
        var seriesdata = [];
        for (var numname in numjson) {
            legenddata.push(numname.replace("#V", ""));
            seriesdata.push({
                name: numname.replace("#V", ""),
                type: "bar",
                data: result[keyname + numname],
                areaStyle: { normal: {} },
                stack: "总量"
            });
        }

        var option = {
            tooltip: {
                trigger: "axis"
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                type: "scroll",
                right: "25%",
                data: legenddata
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            color: colors,
            yAxis: [
                {
                    type: "category",
                    name: keyname,
                    nameGap: 5,
                    nameTextStyle: {
                        color: "#000000",
                        fontSize: 12,
                        padding: 10
                    },
                    data: result[keyname]
                }
            ],
            xAxis: [
                {
                    type: "value"
                }
            ],
            series: seriesdata
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newrose(keyjson, numjson, keyn, numn) {
    //玫瑰图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#000099",
        "#2121ff",
        "#7d7dff",
        "#028288",
        "#03c3cd",
        "#7ff7fd",
        "#02981f",
        "#03df2d",
        "#94fea8",
        "#c4ad04",
        "#fbe225",
        "#fef5b0",
        "#f34803",
        "#fd7f4d",
        "#fecdba"
    ];
    var ii = 0;
    for (var keyname in keyjson) {
        for (var numname in numjson) {
            var seriesdata = [];
            for (let i = 0; i < result[keyname].length; i++) {
                seriesdata.push({
                    name: result[keyname][i],
                    value: result[keyname + numname][i]
                });
            }

            var option = {
                title: {
                    text: keyname + "-" + numname.replace("#V", ""),
                    x: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show: true,
                    feature: {
                        myToolEnlarge: {
                            show: true,
                            title: "查看大图",
                            icon: "image://img/enlarge.png",
                            onclick: toolenlarge
                        },
                        myToolPalette: {
                            show: true,
                            title: "调整配色",
                            icon: "image://img/palette.png",
                            onclick: toolpalette
                        },
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    type: "scroll",
                    orient: "vertical",
                    left: 10,
                    top: 20,
                    bottom: 20,
                    data: result[keyname]
                },
                color: colors,
                series: [
                    {
                        name: keyname,
                        type: "pie",
                        radius: ["20%", "80%"],
                        center: ["50%", "50%"],
                        roseType: "area",
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: seriesdata
                    }
                ]
            };

            var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
            $("#mannn").append(str);
            str = "<div style='height:30px;width:600px;'></div>";
            $("#mannn").append(str);
            var myChart = echarts.init(document.getElementById("mydraw" + ii));
            myChart.setOption(option);
            ii++;
        }
    }
}

function newring(keyjson, numjson, keyn, numn) {
    //环形图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#000099",
        "#2121ff",
        "#7d7dff",
        "#028288",
        "#03c3cd",
        "#7ff7fd",
        "#02981f",
        "#03df2d",
        "#94fea8",
        "#c4ad04",
        "#fbe225",
        "#fef5b0",
        "#f34803",
        "#fd7f4d",
        "#fecdba"
    ];
    var ii = 0;
    for (var keyname in keyjson) {
        for (var numname in numjson) {
            var seriesdata = [];
            for (let i = 0; i < result[keyname].length; i++) {
                seriesdata.push({
                    name: result[keyname][i],
                    value: result[keyname + numname][i]
                });
            }

            var option = {
                title: {
                    text: keyname + "-" + numname.replace("#V", ""),
                    x: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show: true,
                    feature: {
                        myToolEnlarge: {
                            show: true,
                            title: "查看大图",
                            icon: "image://img/enlarge.png",
                            onclick: toolenlarge
                        },
                        myToolPalette: {
                            show: true,
                            title: "调整配色",
                            icon: "image://img/palette.png",
                            onclick: toolpalette
                        },
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    type: "scroll",
                    orient: "vertical",
                    left: 10,
                    top: 20,
                    bottom: 20,
                    data: result[keyname]
                },
                color: colors,
                series: [
                    {
                        name: keyname,
                        type: "pie",
                        radius: ["50%", "70%"],
                        avoidLabelOverlap: false,
                        center: ["50%", "50%"],
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: seriesdata
                    }
                ]
            };

            var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
            $("#mannn").append(str);
            str = "<div style='height:30px;width:600px;'></div>";
            $("#mannn").append(str);
            var myChart = echarts.init(document.getElementById("mydraw" + ii));
            myChart.setOption(option);
            ii++;
        }
    }
}

function newfunnel(keyjson, numjson, keyn, numn) {
    //漏斗图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#000099",
        "#2121ff",
        "#7d7dff",
        "#028288",
        "#03c3cd",
        "#7ff7fd",
        "#02981f",
        "#03df2d",
        "#94fea8",
        "#c4ad04",
        "#fbe225",
        "#fef5b0",
        "#f34803",
        "#fd7f4d",
        "#fecdba"
    ];
    var ii = 0;
    for (var keyname in keyjson) {
        for (var numname in numjson) {
            var seriesdata = [];
            for (let i = 0; i < result[keyname].length; i++) {
                seriesdata.push({
                    name: result[keyname][i],
                    value: result[keyname + numname][i]
                });
            }

            var option = {
                title: {
                    text: keyname + "-" + numname.replace("#V", ""),
                    left: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    type: "scroll",
                    orient: "vertical",
                    x: "left",
                    data: result[keyname]
                },
                toolbox: {
                    show: true,
                    feature: {
                        myToolEnlarge: {
                            show: true,
                            title: "查看大图",
                            icon: "image://img/enlarge.png",
                            onclick: toolenlarge
                        },
                        myToolPalette: {
                            show: true,
                            title: "调整配色",
                            icon: "image://img/palette.png",
                            onclick: toolpalette
                        },
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                color: colors,
                calculable: true,
                series: [
                    {
                        name: keyname,
                        type: "funnel",
                        radius: ["50%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: seriesdata
                    }
                ]
            };

            var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
            $("#mannn").append(str);
            str = "<div style='height:30px;width:600px;'></div>";
            $("#mannn").append(str);
            var myChart = echarts.init(document.getElementById("mydraw" + ii));
            myChart.setOption(option);
            ii++;
        }
    }
}

function newriver(keyjson, numjson, keyn, numn) {
    //主题河流图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#7ff7fd",
        "#03c3cd",
        "#028288",
        "#7d7dff",
        "#2121ff",
        "#000099",
        "#94fea8",
        "#03df2d",
        "#02981f",
        "#fef5b0",
        "#fbe225",
        "#c4ad04",
        "#fecdba",
        "#fd7f4d",
        "#f34803"
    ];
    var ii = 0;
    for (var keyname in keyjson) {
        var legenddata = [];
        var seriesdata = [];

        for (var numname in numjson) {
            legenddata.push(numname.replace("#V", ""));
            for (let i = 0; i < result[keyname].length; i++) {
                let temp = [i, result[keyname + numname][i], numname.replace("#V", "")];
                seriesdata.push(temp);
            }
        }

        var option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "line",
                    lineStyle: {
                        color: "rgba(0,0,0,0.2)",
                        width: 1,
                        type: "solid"
                    }
                }
            },

            legend: {
                type: "scroll",
                right: "25%",
                data: legenddata
            },

            singleAxis: {
                type: "category",
                data: result[keyname],
                axisPointer: {
                    animation: true,
                    label: {
                        show: true
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        opacity: 0.2
                    }
                }
            },

            color: colors,

            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },

            series: [
                {
                    type: "themeRiver",
                    label: {
                        show: false
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 20,
                            shadowColor: "rgba(0, 0, 0, 0.8)"
                        }
                    },
                    data: seriesdata
                }
            ]
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newrectangle(keyjson, numjson, keyn, numn) {
    //矩形树图

    var result = newdatapro(keyjson, numjson);

    var colors = ["#007fff"];
    var ii = 0;
    for (var keyname in keyjson) {
        var keys = [];
        for (let numname in numjson) {
            keys.push(numname);
        }

        var seriesdata = [];
        for (let i = 0; i < result[keyname].length; i++) {
            var tmparr = [];
            for (let numname in numjson) {
                tmparr.push(result[keyname + numname][i]);
            }
            seriesdata.push({
                value: tmparr,
                name: result[keyname][i]
            });
        }

        var mappeddim = numn > 1 ? 1 : 0;
        var tmpdata = result[keyname + keys[mappeddim]];
        var min = tmpdata[0];
        var max = tmpdata[0];
        for (var i = 0; i < tmpdata.length; i++) {
            if (tmpdata[i] > max) {
                max = tmpdata[i];
            }
            if (tmpdata[i] < min) {
                min = tmpdata[i];
            }
        }

        var option = {
            title: {
                text: "矩形大小：" + keys[0].replace("#V", ""),
                left: "center"
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            tooltip: {
                trigger: "item",
                formatter: obj => {
                    var v = obj.value;
                    var tmpstr = "";
                    for (let i = 0; i < keys.length; i++) {
                        tmpstr = tmpstr + keys[i].replace("#V", "") + ": " + v[i] + "<br>";
                    }
                    return (
                        "<div style='border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px'>" +
                        obj.name +
                        "</div>" +
                        tmpstr
                    );
                }
            },
            visualMap: [
                {
                    left: "right",
                    bottom: "5%",
                    dimension: mappeddim,
                    min: min,
                    max: max,
                    itemHeight: 120,
                    calculable: true,
                    precision: 0.1,
                    text: ["明暗：" + keys[mappeddim].replace("#V", "")],
                    textGap: 30,
                    textStyle: {
                        color: "#000000"
                    },
                    inRange: {
                        color: [colors[0]],
                        colorLightness: [0.9, 0.5]
                    },
                    outOfRange: {
                        color: ["#cccccc"]
                    }
                }
            ],
            series: [
                {
                    name: keyname,
                    type: "treemap",
                    visibleMin: 300,
                    data: seriesdata,
                    leafDepth: 2,
                    color: [colors[0]],
                    label: {
                        color: "#000000"
                    },
                    levels: [
                        {
                            itemStyle: {
                                normal: {
                                    borderColor: "#555555",
                                    borderWidth: 1,
                                    gapWidth: 1
                                }
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.6],
                            itemStyle: {
                                normal: {
                                    gapWidth: 0,
                                    borderWidth: 0
                                }
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.5],
                            itemStyle: {
                                normal: {
                                    gapWidth: 0,
                                    borderWidth: 0
                                }
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.5]
                        }
                    ]
                }
            ]
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newheat(keyjson, numjson, keyn, numn) {
    //热力图

    var result = newdatapro(keyjson, numjson);

    var ii = 0;

    var keynamearr = [];
    var keydataarr = [];
    for (let keyname in keyjson) {
        keynamearr.push(keyname);
        keydataarr.push(keyjson[keyname]);
    }

    var key0arr = [];
    for (let i = 0; i < keydataarr[0].length; i++) {
        if (key0arr.indexOf(keydataarr[0][i]) === -1) {
            key0arr.push(keydataarr[0][i]);
        }
    }
    var key1arr = [];
    for (let i = 0; i < keydataarr[1].length; i++) {
        if (key1arr.indexOf(keydataarr[1][i]) === -1) {
            key1arr.push(keydataarr[1][i]);
        }
    }

    function sortNumber(a, b) {
        return a - b;
    }
    key0arr.sort(sortNumber);
    key1arr.sort(sortNumber);

    var numnamearr = [];
    var numdataarr = [];
    for (let numname in numjson) {
        numnamearr.push(numname);
        numdataarr.push(numjson[numname]);
    }

    var seriesdata = [];
    var max = 0;
    var min = 0;
    for (let i = 0; i < key0arr.length; i++) {
        for (let j = 0; j < key1arr.length; j++) {
            seriesdata.push([i, j, 0]);
        }
    }
    for (let i = 0; i < numdataarr[0].length; i++) {
        var tmpi = key0arr.indexOf(keydataarr[0][i]);
        var tmpj = key1arr.indexOf(keydataarr[1][i]);
        var tmp = parseFloat(seriesdata[tmpi * key1arr.length + tmpj][2] + numdataarr[0][i]);
        seriesdata[tmpi * key1arr.length + tmpj][2] = tmp;
        if (tmp > max) max = tmp;
        if (tmp < min) min = tmp;
    }

    seriesdata = seriesdata.map(obj => {
        return [obj[0], obj[1], obj[2] == 0 ? "-" : obj[2]];
    });

    var option = {
        animation: false,
        grid: {
            height: "50%",
            y: "10%"
        },
        tooltip: {
            show: true
        },
        toolbox: {
            show: true,
            feature: {
                myToolEnlarge: {
                    show: true,
                    title: "查看大图",
                    icon: "image://img/enlarge.png",
                    onclick: toolenlarge
                },
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: {
            type: "category",
            name: keynamearr[0],
            data: key0arr,
            splitArea: {
                show: true
            },
            boundaryGap: true,
            axisLabel: {
                show: true,
                interval: 0
            }
        },
        yAxis: {
            type: "category",
            name: keynamearr[1],
            data: key1arr,
            splitArea: {
                show: true
            },
            boundaryGap: true,
            axisLabel: {
                show: true,
                interval: 0
            }
        },
        visualMap: {
            min: min,
            max: max,
            range: [min, max],
            calculable: true,
            orient: "horizontal",
            left: "center",
            bottom: "15%"
        },
        series: [
            {
                name: numnamearr[0].replace("#V", ""),
                type: "heatmap",
                data: seriesdata,
                label: {
                    normal: {
                        show: true,
                        color: "#000000"
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    };

    var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
    $("#mannn").append(str);
    str = "<div style='height:30px;width:600px;'></div>";
    $("#mannn").append(str);
    var myChart = echarts.init(document.getElementById("mydraw" + ii));
    myChart.setOption(option);
}

function newpolmap(keyjson, numjson, keyn, numn) {
    //符号地图

    var result = newdatapro(keyjson, numjson);

    const geoCoordMap = {
        北京: [116.4069921969, 39.9045826842],
        天津: [117.208936, 39.093991],
        上海: [121.47206921691894, 31.23037],
        重庆: [106.54909921691893, 29.56471],
        河北: [104.07642, 38.6518],
        山西: [112.562398, 37.873531],
        辽宁: [123.424505, 41.840355],
        吉林: [125.327676, 43.886841],
        黑龙江: [126.643258, 45.756967],
        江苏: [118.768207, 32.041544],
        浙江: [120.15437, 30.287459],
        安徽: [117.283836, 31.86119],
        福建: [119.307033, 26.075302],
        江西: [115.910022, 28.675696],
        山东: [117.020037, 36.669416],
        河南: [113.754396, 34.765515],
        湖北: [114.342655, 30.546498],
        湖南: [112.984604, 28.112444],
        广东: [113.267324, 23.132191],
        海南: [110.350022, 20.017377],
        四川: [104.066529, 30.659462],
        贵州: [106.714272, 26.578343],
        云南: [102.70968, 25.046807],
        陕西: [108.955033, 34.265472],
        甘肃: [103.824351, 36.058039],
        青海: [101.77971, 36.623178],
        台湾: [121.534234, 25.016838],
        内蒙古: [111.671595, 40.818311],
        广西: [108.32834, 22.815478],
        西藏: [91.133006, 29.660361],
        宁夏: [106.278973, 38.46637],
        新疆: [87.618527, 43.792818],
        香港: [114.171996, 22.277469],
        澳门: [113.543911, 22.186883]
    };

    var colors = ["#ff0000"];
    var ii = 0;
    if (numn !== 1) {
        alert("符号地图暂只能展现一个度量属性");
        return;
    }
    if (keyn !== 1) {
        alert("符号地图暂只能展现一个维度属性");
        return;
    }
    for (var keyname in keyjson) {
        var flag = false;
        var seriesdata = [];
        for (var numname in numjson) {
            var data = [];
            for (var i = 0; i < result[keyname].length; i++) {
                data.push({
                    name: result[keyname][i],
                    value: result[keyname + numname][i]
                });
            }

            var res = [];
            for (i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            if (res.length === 0) {
                alert(keyname + "维度 没有地图信息");
                flag = true;
                break;
            } else {
                var max = res[0].value[2];
                var min = res[0].value[2];
                for (i = 0; i < res.length; i++) {
                    if (max < res[i].value[2]) {
                        max = res[i].value[2];
                    }
                    if (min > res[i].value[2]) {
                        min = res[i].value[2];
                    }
                }
                let seri = {
                    name: numname.replace("#V", ""),
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    data: res,
                    symbolSize: val => {
                        var a = val[2] - min;
                        var b = max - min;
                        return parseInt((a / b) * 15 + 5);
                    },
                    label: {
                        normal: {
                            formatter: "{b}",
                            position: "right",
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {}
                };
                seriesdata.push(seri);
            }
        }
        if (flag) {
            flag = false;
            continue;
        }

        var option = {
            backgroundColor: "#404a59",
            geo: {
                show: true,
                roam: true,
                map: "china",
                label: {
                    show: false
                },
                itemStyle: {
                    areaColor: "#323c48",
                    borderColor: "#111111"
                },
                data: [
                    {name: '北京',value: Math.round(Math.random()*500)},
                    {name: '天津',value: Math.round(Math.random()*500)},
                    {name: '上海',value: Math.round(Math.random()*500)},
                    {name: '重庆',value: Math.round(Math.random()*500)},
                    {name: '河北',value: Math.round(Math.random()*500)},
                    {name: '河南',value: Math.round(Math.random()*500)},
                    {name: '云南',value: Math.round(Math.random()*500)},
                    {name: '辽宁',value: Math.round(Math.random()*500)},
                    {name: '黑龙江',value: Math.round(Math.random()*500)},
                    {name: '湖南',value: Math.round(Math.random()*500)},
                    {name: '安徽',value: Math.round(Math.random()*500)},
                    {name: '山东',value: Math.round(Math.random()*500)},
                    {name: '新疆',value: Math.round(Math.random()*500)},
                    {name: '江苏',value: Math.round(Math.random()*500)},
                    {name: '浙江',value: Math.round(Math.random()*500)},
                    {name: '江西',value: Math.round(Math.random()*500)},
                    {name: '湖北',value: Math.round(Math.random()*500)},
                    {name: '广西',value: Math.round(Math.random()*500)},
                    {name: '甘肃',value: Math.round(Math.random()*500)},
                    {name: '山西',value: Math.round(Math.random()*500)},
                    {name: '内蒙古',value: Math.round(Math.random()*500)},
                    {name: '陕西',value: Math.round(Math.random()*500)},
                    {name: '吉林',value: Math.round(Math.random()*500)},
                    {name: '福建',value: Math.round(Math.random()*500)},
                    {name: '贵州',value: Math.round(Math.random()*500)},
                    {name: '广东',value: Math.round(Math.random()*500)},
                    {name: '青海',value: Math.round(Math.random()*500)},
                    {name: '西藏',value: Math.round(Math.random()*500)},
                    {name: '四川',value: Math.round(Math.random()*500)},
                    {name: '宁夏',value: Math.round(Math.random()*500)},
                    {name: '海南',value: Math.round(Math.random()*500)},
                    {name: '台湾',value: Math.round(Math.random()*500)},
                    {name: '香港',value: Math.round(Math.random()*500)},
                    {name: '澳门',value: Math.round(Math.random()*500)},
                    {name: '南海诸岛',value: Math.round(Math.random()*500)}
                ]
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://./static/img/enlarge.png",
                        onclick: toolenlarge
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            tooltip: {
                trigger: "item",
                formatter: obj => {
                    var v = obj.value;
                    return numname.replace("#V", "：") + v[2];
                }
            },
            color: [colors[0]],
            series: seriesdata
        };
        
        var str = "<div style='height:400px;width:600px;' id='draw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("draw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newregressions(keyjson, numjson, keyn, numn) {
    //回归线图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var legenddata = [];
        var seriesdata = [];
        for (let numname in numjson) {
            legenddata.push(numname.replace("#V", ""));
            seriesdata.push({
                name: numname.replace("#V", ""),
                type: "scatter",
                stack: "总量",
                areaStyle: { normal: {} },
                data: result[keyname + numname]
            });

            var regdata = [];
            for (let i = 0; i < result[keyname].length; i++) {
                regdata.push([result[keyname][i], result[keyname + numname][i]]);
            }
            var regresult = ecStat.regression("polynomial", regdata, 5);
            seriesdata.push({
                name: numname.replace("#V", ""),
                type: "line",
                smooth: true,
                showSymbol: false,
                data: regresult.points,
                markPoint: {
                    itemStyle: {
                        normal: {
                            color: "transparent"
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "left",
                            formatter: regresult.expression,
                            textStyle: {
                                color: "#333333",
                                fontSize: 14
                            }
                        }
                    },
                    data: [
                        {
                            coord: regresult.points[regresult.points.length - 1]
                        }
                    ]
                }
            });
        }

        var option = {
            tooltip: {
                trigger: "axis"
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    myToolPalette: {
                        show: true,
                        title: "调整配色",
                        icon: "image://img/palette.png",
                        onclick: toolpalette
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                type: "scroll",
                right: "25%",
                data: legenddata
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            color: colors,
            xAxis: [
                {
                    type: "category",
                    name: keyname,
                    nameGap: 5,
                    nameTextStyle: {
                        color: "#000000",
                        fontSize: 9
                    },
                    boundaryGap: false,
                    data: result[keyname]
                }
            ],
            yAxis: [
                {
                    type: "value"
                }
            ],
            series: seriesdata
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newbox(keyjson, numjson, keyn, numn) {
    //箱形图

    var result = newdatapro(keyjson, numjson);

    var colors = [
        "#5757ff",
        "#66ff66",
        "#9c63db",
        "#f4b183",
        "#4fd1ff",
        "#529abe",
        "#c800c8",
        "#c4c4c4",
        "#eee800",
        "#ff79bc",
        "#6fc39b",
        "#d7b5fd",
        "#bf9000",
        "#c5f4b3",
        "#ff5757"
    ];
    var ii = 0;
    for (let keyname in keyjson) {
        var boxdata = [];
        var xdata = [];
        for (let numname in numjson) {
            boxdata.push(result[keyname + numname]);
            xdata.push(numname.replace("#V", ""));
        }
        var boxresult = dataTool.prepareBoxplotData(boxdata);

        var option = {
            title: [
                {
                    text: "upper: Q3 + 1.5 * IRQ \nlower: Q1 - 1.5 * IRQ",
                    borderColor: "#999999",
                    borderWidth: 1,
                    textStyle: {
                        fontSize: 12,
                        fontWeight: "lighter"
                    },
                    left: "10%",
                    top: "90%"
                }
            ],
            tooltip: {
                trigger: "item",
                axisPointer: {
                    type: "shadow"
                }
            },
            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            color: colors,
            grid: {
                left: "10%",
                right: "10%",
                bottom: "15%"
            },
            xAxis: {
                type: "category",
                data: xdata,
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                axisLabel: {
                    formatter: "{value}"
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
                name: keyname,
                splitArea: {
                    show: true
                }
            },
            series: [
                {
                    name: "boxplot",
                    type: "boxplot",
                    data: boxresult.boxData,
                    tooltip: {
                        formatter: param => {
                            return [
                                "Experiment " + param.name + ": ",
                                "upper: " + param.data[4],
                                "Q3: " + param.data[3],
                                "median: " + param.data[2],
                                "Q1: " + param.data[1],
                                "lower: " + param.data[0]
                            ].join("<br/>");
                        }
                    }
                },
                {
                    name: "outlier",
                    type: "scatter",
                    data: boxresult.outliers,
                    tooltip: {
                        formatter: obj => {
                            let v = obj.value;
                            let vdata = result[keyname + xdata[v[0]] + "#V"];
                            var i = 0;
                            for (i = 0; i < vdata.length; i++) {
                                if (vdata[i] === v[1]) {
                                    break;
                                }
                            }
                            return result[keyname][i] + ":" + v[1];
                        }
                    }
                }
            ]
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}

function newkline(keyjson, numjson, keyn, numn) {
    //k线图

    var result = newdatapro(keyjson, numjson);

    var ii = 0;
    for (let keyname in keyjson) {
        if (keyn > 1) {
            alert("k线图仅支持选择一个日期维度参数");
            break;
        }
        var flag = false;
        if (numn < 4) flag = true;
        else if (numjson["开盘价#V"] == null) flag = true;
        else if (numjson["收盘价#V"] == null) flag = true;
        else if (numjson["最低价#V"] == null) flag = true;
        else if (numjson["最高价#V"] == null) flag = true;
        if (flag) {
            alert("k线图需选择'开盘价'、'收盘价'、'最低价'、'最高价'四个度量参数");
            break;
        }

        var datedata = result[keyname];
        var kdata = [];
        for (let i = 0; i < datedata.length; i++) {
            let tmpo = result[keyname + "开盘价#V"][i];
            let tmpc = result[keyname + "收盘价#V"][i];
            let tmpl = result[keyname + "最低价#V"][i];
            let tmph = result[keyname + "最高价#V"][i];
            kdata.push([tmpo, tmpc, tmpl, tmph]);
        }

        function calculateMA(dayCount, data) {
            var MAresult = [];
            for (let i = 0; i < data.length; i++) {
                if (i < dayCount) {
                    MAresult.push("-");
                    continue;
                }
                var sum = 0;
                for (let j = 0; j < dayCount; j++) {
                    sum += data[i - j][1];
                }
                MAresult.push(sum / dayCount);
            }
            return MAresult;
        }

        var option = {
            backgroundColor: "#21202d",

            legend: {
                data: ["日K", "MA5", "MA10", "MA20", "MA30"],
                inactiveColor: "#777777",
                textStyle: {
                    color: "#ffffff"
                }
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    animation: false,
                    type: "cross",
                    lineStyle: {
                        color: "#376df4",
                        width: 2,
                        opacity: 1
                    }
                }
            },

            toolbox: {
                show: true,
                feature: {
                    myToolEnlarge: {
                        show: true,
                        title: "查看大图",
                        icon: "image://img/enlarge.png",
                        onclick: toolenlarge
                    },
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },

            xAxis: {
                type: "category",
                data: datedata,
                axisLine: { lineStyle: { color: "#8392a5" } }
            },

            yAxis: {
                scale: true,
                axisLine: { lineStyle: { color: "#8392a5" } },
                splitLine: { show: false }
            },

            grid: {
                bottom: 80
            },
            dataZoom: [
                {
                    textStyle: {
                        color: "#8392a5"
                    },
                    handleIcon:
                        "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    handleSize: "80%",
                    dataBackground: {
                        areaStyle: {
                            color: "#8392a5"
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: "#8392a5"
                        }
                    },
                    handleStyle: {
                        color: "#ffffff",
                        shadowBlur: 3,
                        shadowColor: "rgba(0, 0, 0, 0.6)",
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    type: "inside"
                }
            ],
            animation: false,
            series: [
                {
                    type: "candlestick",
                    name: "日K",
                    data: kdata,
                    itemStyle: {
                        normal: {
                            color: "#fd1050",
                            color0: "#0cf49b",
                            borderColor: "#fd1050",
                            borderColor0: "#0cf49b"
                        }
                    }
                },
                {
                    name: "MA5",
                    type: "line",
                    data: calculateMA(5, kdata),
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    }
                },
                {
                    name: "MA10",
                    type: "line",
                    data: calculateMA(10, kdata),
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    }
                },
                {
                    name: "MA20",
                    type: "line",
                    data: calculateMA(20, kdata),
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    }
                },
                {
                    name: "MA30",
                    type: "line",
                    data: calculateMA(30, kdata),
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    }
                }
            ]
        };

        var str = "<div style='height:400px;width:600px;' id='mydraw" + ii + "'></div>";
        $("#mannn").append(str);
        str = "<div style='height:30px;width:600px;'></div>";
        $("#mannn").append(str);
        var myChart = echarts.init(document.getElementById("mydraw" + ii));
        myChart.setOption(option);
        ii++;
    }
}
