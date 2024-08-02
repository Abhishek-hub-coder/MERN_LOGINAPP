/** converting the image into base 64 */

// it is going to take file as a argument.
// converting the image into base 64 format so that we can store that image into bassse 64 format.

export default function convertToBase64(file) {
  return new Promise((resolve, reject) => { 
    // creating new instance of the file reader
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    }

    // if there is an error message
    fileReader.onerror = () => {
      reject(error);
    }

  })




















}