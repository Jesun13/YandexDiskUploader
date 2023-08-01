import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

// https://disk.yandex.ru/d/FOtuRVGkLc4fjQ - ссылка папки Яндекс.Диск для проверки, в неё загружаются файлы

export default function YandexDiskUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > 100) {
      alert(
        "Ошибка: Выбрано больше 100 файлов. Пожалуйста, выберите не более 100 файлов."
      );
      return;
    }

    const apiUrl = "https://cloud-api.yandex.net/v1/disk/resources/upload";
    const token = "y0_AgAAAAAT1UanAADLWwAAAADpGhyBBc3pxEu6Qp2YFcqz_i5XUoczRMA";
    const uploadDir = "/Test";

    for (const file of acceptedFiles) {
      // Обходим все принятые файлы и загружаем их на Яндекс.Диск
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Запрашиваем ссылку для загрузки на Яндекс.Диск с помощью API
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `OAuth ${token}`,
          },
          params: {
            path: `${uploadDir}/${file.name}`,
            overwrite: true,
          },
        });

        const { href } = response.data;
        // Загружаем файл на Яндекс.Диск с помощью HTTP-запроса PUT
        await axios.put(href, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Обновляем состояние загруженных файлов, добавляя новый файл в массив
        setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, file]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  // Используем хук useDropzone для обработки событий перетаскивания и выбора файлов
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: true,
      minSize: 0,
      maxSize: 5242880,
      maxFiles: 101,
    });

  return (
    <div style={{ display: "flex", justifyContent: "center" , alignItems:'center', width:'100%', flexDirection: 'column'}}>
      <div
        {...getRootProps()}
        style={{ padding: "20px", border: "2px dashed #ccc" , width:'90%', cursor: 'pointer'}}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Перетащите сюда файлы...</p>
        ) : (
          <p >Перетащите сюда файлы или нажмите, чтобы выбрать файлы</p>
        )}
      </div>
      {uploadedFiles.length > 0 && (
        <div>
          <h3>
            Загруженные файлы {uploadedFiles.length} из {acceptedFiles.length}:
          </h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} style={{ listStyleType: "none", marginBottom:'5px' }}>
              {index + 1}.{file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
