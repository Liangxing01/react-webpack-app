'use strict';
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
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


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
