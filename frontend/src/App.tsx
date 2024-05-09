import React from 'react';
import logo from './logo.svg';
import './App.css';
import { submitFile, uploadFileToS3 } from './api';

function App() {
  return (
    <div className='flex w-full h-full justify-center align-middle items-center bg-slate-800'>
      {/* bg-gradient-to-br from-blue-700 via-purple-500 (testing gradient design) */}
      <div className='flex w-1/2 rounded-3xl p-4 items-center justify-center flex-col text-white'>
        <h1 className="text-3xl font-bold">
          FOVUS Challenge
        </h1>
        <form onSubmit={
          async (e) => {
            e.preventDefault();
            const user = (document.getElementById('user') as HTMLInputElement).value;
            const inputText = (document.getElementById('inputText') as HTMLInputElement).value;
            const file = (document.getElementById('file') as HTMLInputElement).files?.[0];
            if (!file) {
              alert('Please select a file');
              return;
            }
            if (!user) {
              alert('Please enter a user');
              return;
            }
            if (!inputText) {
              alert('Please enter an input text');
              return;
            }
            
            console.log("Bucket: " + await uploadFileToS3(file, user));

            submitFile(file, user, inputText).then((result) => {
              alert(result);
            }).catch((err) => {
              alert(err);
            });
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
        <div className='mt-4'>
          <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Upload
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default App;
