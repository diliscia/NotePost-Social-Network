import axios from 'axios';
import { useDebugValue, useState } from 'react';

// export const UserData = 
// [
//     {
//       id: 1,
//       year: 2016,
//       userGain: 80000,
//       userLost: 823,
//     },
//     {
//       id: 2,
//       year: 2017,
//       userGain: 45677,
//       userLost: 345,
//     },
//     {
//       id: 3,
//       year: 2018,
//       userGain: 78888,
//       userLost: 555,
//     },
//     {
//       id: 4,
//       year: 2019,
//       userGain: 90000,
//       userLost: 4555,
//     },
//     {
//       id: 5,
//       year: 2020,
//       userGain: 4300,
//       userLost: 234,
//     },
//   ];

  // export const UserData = [{"c":2,"day":"2022-06-22T04:00:00.000Z"},{"c":2,"day":"2022-06-24T04:00:00.000Z"},{"c":33,"day":"2022-06-26T04:00:00.000Z"


// const data  = async () => await axios.get(`http://localhost:3001/api/postsByDate`, {
//   headers: {
//       "x-access-token": localStorage.getItem("token"),
//   },
// }).then((response) =>{ 
 
//   console.log(JSON.stringify(response.data))
// }).then((json) => console.log(json))

export const UserData = [{"c":2,"day":"2022-06-22T04:00:00.000Z"},{"c":2,"day":"2022-06-24T04:00:00.000Z"},{"c":33,"day":"2022-06-26T04:00:00.000Z"}];


// export const UserData = async () => {
//     let response; 
//     try {
//       response = await axios.get(`http://localhost:3001/api/postsByDate`, {
//         headers: {
//             "x-access-token": localStorage.getItem("token"),
//         },
//     })
//     } catch (e) {
//       throw new Error(e.message)
//     }
    
//       console.log(JSON.stringify(response.data))
//       return (JSON.stringify(response.data))
// } 