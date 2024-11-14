import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <App /> // app主页对象。
);

// 配置主题 没定义颜色，暂时先不弄
// ConfigProvider.config({
//     theme: {
//       primaryColor: MacroDefines.PRIMARY_COLOR
//     }
//   })

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();
