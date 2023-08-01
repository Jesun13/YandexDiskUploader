import React from "react";
import logo from "./logo.svg";
import "./App.css";
import YandexDiskUploader from "./components/YandexDiskUploader";

function App() {
  return (
    <div className="App">
      <h1>Загрузка файлов на Яндекс.Диск</h1>
      <YandexDiskUploader />
    </div>
  );
}

export default App;
