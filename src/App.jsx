import React from "react"
import Navbar from "./Navbar"
import ThemeController from "./ThemeController"
import Select, {Button} from "./Select"
import Footer from "./Footer"

function App() {

  return (
    <>
    <Navbar />
    {/* <ThemeController /> */}
     <div className="container items-center justify-center w-full h-full mx-auto mt-10 text-center">
      <div className="items-center justify-center px-5 mx-3 my-5 text-center">
        <h3 className="mb-3 text-2xl font-bold text-sky-200">DROPDOWN LIST ITEM</h3>
        <p className="mb-6 text-base text-white">Berikut adalah Dropdown list item yang diperoleh dari Data <span className="text-red-500 ">Pokémon API</span>.</p>
        <Select />
      </div>
     </div>
      <Footer />
    </>
  )
}

export default App
