/**
 * div 绘制标尺
 *
 * params:{*}
 *      axisWidth:Number,轴线的宽度，单位px
 *      lineColor:String,轴线的颜色
 *      gridWidth:Number,大网格的宽度
 *      gridHeight:Number,大网格的高度
 *
 */
function initRulerLine(params){
    let axisWidth = params.axisWidth ? params.axisWidth: 1,
        lineColor = params.lineColor ? params.lineColor: "#000000",
        gridWidth = params.gridWidth ? params.gridWidth: 100,
        gridHeight = params.gridHeight ? params.gridHeight: 20;

    //绘制开始
    function init(){
        drawHorizontalAxis();
        drawVerticalAxis();
    }
    //绘制水平轴
    function drawHorizontalAxis(){

    }
    //绘制垂直轴
    function drawVerticalAxis(){

    }


}
export default initRulerLine;
