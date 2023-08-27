import React from "react";
import Banner from './Banner';
import Capsules from './Capsules';

function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <Banner />

      {/* Capsules */}
      <Capsules />
    </div>
  );
}

export default Home;