"use client";
import { useState, useEffect } from "react";
import Header from "@Header";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import Card from "../components/Card";
const PORT = process.env.PORT || 3000;
function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let cards = [];
  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/search?search=${search}`, {
        cache: "no-store",
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  }

  return (
    <>
      <Header />

      <form className="flex flex-col items-center justify-center" action="">
        <input
          required={true}
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          placeholder="Search"
          className=" mt-20 p-6 border-2 rounded-lg border-purple-600 w-2/3 "
        />
        <button
          disabled={loading}
          className=" disabled:pointer-events-none disabled:cursor-not-allowed p-6 mt-10 rounded-lg w-1/2 bg-purple-500 hover:bg-purple-800 text-white"
          onClick={handleClick}
        >
          Search
        </button>
      </form>
      {loading ? (
        <InfinitySpin color="rgb(168 85 247)" width="400" />
      ) : (
        <div className="flex justify-around items-center flex-wrap mt-5 ml-4 mr-4">
          {data.length > 0 ? data.map((item) => <Card {...item} />) : []}
        </div>
      )}
      {error && <h1 className="text-2xl font-extrabold">{error.message}</h1>}
    </>
  );
}

export default App;
