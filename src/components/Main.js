'use strict';
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关路径
let imageDates = require('../data/imageDate.json');

/*
*   利用自使用函数获取图片地址
*   @Param 图片数据
*   @return 新的图片数组
* */
imageDates = (function getImagesURL(imagesArr) {
  for ( let i = 0, j = imagesArr.length; i < j; i++) {
      let singleImageDate = imagesArr[i];
      singleImageDate.imageURL = require("../images/" + singleImageDate.fileName);
      imagesArr[i] = singleImageDate ;
  }
  return imagesArr;
})(imageDates);

var ImgFigure = React.createClass({
  /*
  *  imgFigure的点击处理函数
  * */
  handleClick: function(event){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    event.stopPropagation();
    event.preventDefault();
  },
  render:function(){
      var styleObj = {};

      //如果props的属性中指定了这张图片的位置，则使用
      if(this.props.arrange.pos){
        styleObj = this.props.arrange.pos;
      }
      if(this.props.arrange.rotate){
        (['-moz-','-ms-','-webkit-','']).forEach(function(value){
          styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }.bind(this))
      }

      var imgFigureClassName = 'img-figure';
          imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': "";

      return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <img src={this.props.data.imageURL} alt={this.props.data.titile}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
              <p>
                {this.props.data.des}
              </p>
            </div>
          </figcaption>
        </figure>
      )
  }
})

function getRangeRandom ( low , high){
  return(Math.ceil(Math.random() *(high - low) + low))
}
/*
*  获取0-30之间的正负值
* */
function get30DegRandom (){
  return ((Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random()*30))
}

var AppComponent = React.createClass({
  Constant:{
    centerPos:{
      left: 0,
      right: 0
    },
    hPosRange:{//水平方向的取值范围
      leftSecx: [0,0],
      rightSecx: [0,0],
      y:[0,0]
    },
    vPosRange: {//垂直方向的取值范围
      x: [0,0],
      topY:[0,0]
    }
  },
  getInitialState:function(){
    return {
      imgsArrangeArr: [
       /* {
          pos: {
            left: '0',
            right: '0'
          },
          rotate: 0,    //旋转角度
          isInverse: false, //图片正反面
          isCenter: false   //图片是否居中
        }*/
      ]
    }
  },
  /*
  * 翻转图片
  * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  * @return { Function }  这是一个闭包函数，其内return 一个真正被执行的函数
  * */
  inverse: function( index ){
    return function (){
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this)
  },

  /*
   * 布局所有的图片
   * @Param centerIndex
   * */
  rearrange:function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecx,
      hPosRangeRightSecX = hPosRange.rightSecx,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random()*2), //取一个或者不取
      topSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    //首先居中centerIndex的图片,居中的centerindex 的图片不需要旋转
    imgsArrangeCenterArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
    };
    //取出要布局上册的图片的状态信息
    topSpliceIndex =  Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topSpliceIndex, topImgNum);

    imgsArrangeTopArr.forEach(function(event, index){
      imgsArrangeTopArr[index] = {
        pos : {
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter: false
      };
    });

    //布局左右两侧的图片
    for (let i = 0,j = imgsArrangeArr.length, k = j / 2 ; i < j ; i++){
      let hPosRangeORX = null ;
      //前部分布局左边
      if( i < k ){
        hPosRangeORX = hPosRangeLeftSecX;
      } else {
        hPosRangeORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] ={
        pos : {
          top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left: getRangeRandom(hPosRangeORX[0],hPosRangeORX[1])
        },
        rotate:get30DegRandom(),
        isCenter: false
      }
    }

    if( imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topSpliceIndex,0,imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  },
  /*
  *  利用 rerrange函数，居中对应的index的图片
  *  @param index,需要被居中的图片对应的图片信息
  *  @return {Function}
  */
  center: function (index) {
     return function () {
        this.rearrange(index)
     }.bind(this);
  },

  componentDidMount: function () {
    //首先拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小
    var imgFirgureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFirgureDOM.scrollWidth,
      imgH = imgFirgureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算左侧右侧区域排布位置的取值范围
    this.Constant.hPosRange.leftSecx[0] = -halfImgW;
    this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  },
  render:function (){
    var controllerUnits = [],
      imgFigures = [];

    imageDates.forEach(function (value, index) {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate:0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }

});

export default AppComponent;
