import React, { useState, useEffect } from "react";
import BarChart from "../chart/BarChart";
import LineChart from "../chart/LineChart";
import PieChart from "../chart/PieChart";
import { UserData } from "../chart/Data";
import axios from "axios";

function Statistics() {
  const [fetchedData, setFetchedData] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/postsByDate`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setFetchedData(res.data);
        handleStats(res.data);
      });
  }, []);

  console.log("data: ", fetchedData);

  const initialValue = {
    labels: [],
    datasets: [{}],
  };

  const [userData, setUserData] = useState(initialValue);
  const handleStats = (data) => {
    console.log(data);
    let labels = [];
    let stats = [];
    let temp = {};
    for (let i = 0; i < data.length; i++) {
      labels[i] = data[i].day;
      stats[i] = data[i].c;
    }
    temp = {
      labels: labels,
      datasets: [
        {
          label: "Posts per Day",
          data: stats,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };
    setUserData(temp);
  };

  return (
    <div className="container my-5">
      <div>
        <div style={{ width: 700 }}>
          <BarChart chartData={userData} />
        </div>
        <div style={{ width: 700 }}>
          <LineChart chartData={userData} />
        </div>
        <div style={{ width: 700 }}>
          <PieChart chartData={userData} />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
