/**
 * canvas 绘制标尺
 *
 * params:{*}
 *      axisWidth:Number,轴线的宽度，单位px
 *      lineColor:String,轴线的颜色
 *      gridWidth:Number,大网格的宽度
 *      gridHeight:Number,大网格的高度
 *
 * dom:Dom元素,canvas的元素
 */
function initRulerLine(){

    function CanvasRuler(params, dom) {
        let AXIS_WIDTH = 1,
            LINE_COLOR = "#000000",
            GRID_WIDTH = 100,
            GRID_HEIGHT = 20;

        let canvas = dom;

        const DRAW_TYPE = {
            HORIZONTAL: 1,
            VERTICAL: 2,
            ALL: 3,
            NONE: 4
        };

        this.getDrawType = function() {
            return DRAW_TYPE;
        }

        this.setAxisWidth = function(axisWidth) {
            AXIS_WIDTH = Number(axisWidth) ? Number(axisWidth) : 1;
        }
        this.getAxisWidth = function() {
            return AXIS_WIDTH;
        }

        this.setLineColor = function(lineColor) {
            LINE_COLOR = lineColor;
        }
        this.getLineColor = function() {
            return LINE_COLOR;
        }

        this.setGridWidth = function(gridWidth) {
            GRID_WIDTH = Number(gridWidth) ? Number(gridWidth) : 1;
        }
        this.getGridWidth = function() {
            return GRID_WIDTH;
        }

        this.setGridHeight = function(gridHeight) {
            GRID_HEIGHT = Number(gridHeight) ? Number(gridHeight) : 1;
        }
        this.getGridHeight = function() {
            return GRID_HEIGHT;
        }

        this.getDomElement = function() { //清空canvas
            return canvas;
        }

        this.clearCanvas = function() {
            canvas.width = canvas.width;
        }

        this.setAxisWidth(params.axisWidth);
        this.setLineColor(params.lineColor);
        this.setGridWidth(params.gridWidth);
        this.setGridHeight(params.gridHeight);
    }

    CanvasRuler.prototype = {
        constructor: CanvasRuler,
        init: function(type) {
            this.clearCanvas();
            ctx = this.getDomElement().getContext('2d');
            ctx.lineWidth = this.getAxisWidth();
            ctx.strokeStyle = this.getLineColor();
            let DRAW_TYPE = this.getDrawType();
            switch (type) {
                case DRAW_TYPE.HORIZONTAL:
                    this.drawHorizontalAxis(ctx);
                    break;
                case DRAW_TYPE.VERTICAL:
                    this.drawVerticalAxis(ctx);
                    break;
                case DRAW_TYPE.ALL:
                    this.drawHorizontalAxis(ctx);
                    this.drawVerticalAxis(ctx);
                    break;
                default:
                    break;
            }
        },

        //绘制水平轴
        drawHorizontalAxis: function(ctx) {
            let gridWidth = this.getGridWidth();
            let gridHeight = this.getGridHeight();
            ctx.beginPath();
            ctx.moveTo(gridHeight + 0.5, gridHeight);
            ctx.lineTo(gridWidth + 0.5, gridHeight);
            for (let i = 0.5; i < gridWidth; i = i + gridWidth / 10) {
                ctx.moveTo(i, gridHeight);
                if (i < gridHeight) continue;
                if (i == gridWidth / 10 * 5) {
                    ctx.lineTo(i, gridHeight / 2);
                } else {
                    ctx.lineTo(i, gridHeight * 2 / 3);
                }
            }
            ctx.stroke();
            for (let i = gridWidth + 0.5; i < this.getDomElement().width; i = i + gridWidth) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, gridHeight);
                ctx.lineTo(i + gridWidth, gridHeight);
                for (let j = i + gridWidth / 10; j < i + gridWidth; j = j + gridWidth / 10) {
                    ctx.moveTo(j, gridHeight);
                    if (j == i + gridWidth / 10 * 5) {
                        ctx.lineTo(j, gridHeight / 2);
                    } else {
                        ctx.lineTo(j, gridHeight * 2 / 3);
                    }
                }
                ctx.stroke();
            }
        },

        //绘制垂直轴
        drawVerticalAxis: function() {
            let gridWidth = this.getGridWidth();
            let gridHeight = this.getGridHeight();
            ctx.beginPath();
            ctx.moveTo(gridHeight, gridHeight + 0.5);
            ctx.lineTo(gridHeight, gridWidth + 0.5);
            for (let i = 0.5; i < gridWidth; i = i + gridWidth / 10) {
                ctx.moveTo(gridHeight, i);
                if (i < gridHeight) continue;
                if (i == gridWidth / 10 * 5) {
                    ctx.lineTo(gridHeight / 2, i);
                } else {
                    ctx.lineTo(gridHeight * 2 / 3, i);
                }
            }
            ctx.stroke();
            for (let i = gridWidth + 0.5; i < this.getDomElement().height; i = i + gridWidth) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(gridHeight, i);
                ctx.lineTo(gridHeight, i + gridWidth);
                for (let j = i + gridWidth / 10; j < i + gridWidth; j = j + gridWidth / 10) {
                    ctx.moveTo(gridHeight, j);
                    if (j == i + gridWidth / 10 * 5) {
                        ctx.lineTo(gridHeight / 2, j);
                    } else {
                        ctx.lineTo(gridHeight * 2 / 3, j);
                    }
                }
                ctx.stroke();
            }

            /* ctx.fillRect(25,25,100,100);
             ctx.clearRect(50,50,50,50);
             ctx.strokeRect(65,65,20,20);*/
        }

    }
}
export default initRulerLine;
