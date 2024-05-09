import React from 'react';
import logo from './logo.svg';
import './App.css';
import { submitFile, uploadFileToS3 } from './api';

function App() {
  const [loading, setLoading] = React.useState(false);

  console.log('Loading: ' + loading)
  return (
    <div className='flex w-full h-full justify-center align-middle items-center bg-slate-800 text-white'>
      {/* bg-gradient-to-br from-blue-700 via-purple-500 (testing gradient design) */}
      {loading ?
        <div className="absolute bg-slate-400 bg-opacity-60 h-full w-full flex items-center justify-center">
          <div className="flex items-center">
            <svg className="animate-spin h-20 w-20 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="24" cy="24" r="100" stroke="currentColor" stroke-width="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div> : <div/>}

      <div className='flex w-1/2 rounded-3xl p-4 items-center justify-center flex-col text-white'>
        <h1 className="text-3xl font-bold">
          FOVUS Challenge
        </h1>
        <form onSubmit={
          async (e) => {
            setLoading(true);
            e.preventDefault();
            const user = (document.getElementById('user') as HTMLInputElement).value;
            const inputText = (document.getElementById('inputText') as HTMLInputElement).value;
            const file = (document.getElementById('file') as HTMLInputElement).files?.[0];
            if (!file) {
              setLoading(false);
              alert('Please select a file');
              return;
            }
            if (!user) {
              setLoading(false);
              alert('Please enter a user');
              return;
            }
            if (!inputText) {
              setLoading(false);
              alert('Please enter an input text');
              return;
            }

            if (/^\s+$/.test(user)) {
              setLoading(false);
              alert('User cannot contain whitespace');
              return;
            }

            try {
              console.log("Bucket: " + await uploadFileToS3(file, user));

              submitFile(file, user, inputText).then((result) => {
                alert(result);
                setLoading(false);
              }).catch((err) => {
                alert(err);
                setLoading(false);
              });
            } catch (err) {
              alert("There was an error with the current user, please try a different username.");
              setLoading(false);
            }
          }
        }>
          <div className='mt-4'>
            <label htmlFor="user" className='mr-2'>Enter user (will be used for your bucket): </label>
            <input type="text" id="user" name="user" className='border-2 border-gray-500 rounded-md p-2 text-black' />
          </div>
          <div className='mt-4'>
            <label htmlFor="inputText" className='mr-2'>Enter input text (will be appended to file): </label>
            <input type="text" id="inputText" name="inputText" className='border-2 border-gray-500 rounded-md p-2 text-black' />
          </div>
          <div className='mt-4'>
            <label htmlFor="file" className='mr-2'>Select file to upload: </label>
            <input type="file" id="file" name="file" className='border-2 border-white rounded-md p-2' />
          </div>
          <div className='mt-8 justify-center w-full'>
            <button type='submit' className='bg-blue-500 align-middle w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
