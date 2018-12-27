// 读取文件Md5值
// file => promise
import SparkMD5 from 'spark-md5';

const toMD5 = file => {
  return new Promise((resolve, reject) => {
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = 2097152, // read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      frOnload = function(e) {
        spark.append(e.target.result); // append array buffer
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          resolve(spark.end());
        }
      },
      frOnerror = function() {
        reject('read file fail');
      };
    function loadNext() {
      var fileReader = new FileReader();
      fileReader.onload = frOnload;
      fileReader.onerror = frOnerror;
      var start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  });
};

export default toMD5;
